const axios = require('axios')

const settings = require('../local_settings')

const GOOGLE_PLACES_URL = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json'
const GOOGLE_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json'

function geocode(address) {
  const params = {
    address,
    key: settings.GOOGLE_GEOCODE_KEY,
  }
  return axios.get(GOOGLE_GEOCODE_URL, { params })
}

function getSingleNearby(address, options) {
  return new Promise((resolve) => {
    geocode(address).then((geoResp) => {
      const geoData = geoResp.data.results[0]
      const originLocation = {
        lat: geoData.geometry.location.lat,
        lng: geoData.geometry.location.lng,
        address,
      }

      const params = {
        key: settings.GOOGLE_PLACES_KEY,
        location: `${originLocation.lat},${originLocation.lng}`,
        keyword: options.keyword,
        radius: options.radius,
      }

      return axios.get(GOOGLE_PLACES_URL, { params }).then((placesResp) => {
        const data = {
          origin_location: originLocation,
          results: placesResp.data.results,
        }

        return resolve(data)
      })
    })
  })
}

function nearby(origins, radius, keyword) {
  return new Promise((resolve) => {
    const promises = origins.map((address) => {
      const options = {
        radius,
        keyword,
      }
      return getSingleNearby(address, options)
    })

    Promise.all(promises).then((response) => {
      const data = response.map(d => (
        {
          origin_location: d.origin_location,
          destinations: d.results.map(dest => (
            {
              // TODO add more stuff here
              name: dest.name,
            }
          )),
        }
      ))

      resolve(data)
    })
  })
}

function getNearby(req, res) {
  nearby(req.query.origins.split('|'), req.query.radius, req.query.keyword).then(data => res.send(data))
}

module.exports = {
  get: getNearby,
}
