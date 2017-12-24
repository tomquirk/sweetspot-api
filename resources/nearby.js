const axios = require('axios');

const settings = require('../local_settings')
const GOOGLE_PLACES_URL = `https://maps.googleapis.com/maps/api/place/nearbysearch/json`
const GOOGLE_GEOCODE_URL = `https://maps.googleapis.com/maps/api/geocode/json`

function geocode(address) {
  const params = {
    address,
    key: settings.GOOGLE_GEOCODE_KEY,
  }
  return axios.get(GOOGLE_GEOCODE_URL, { params })
}

function getSingleNearby(address, options) {
  return new Promise((resolve, reject) => {
    console.log(address)
    geocode(address).then((geo_resp) => {
      const geoData = geo_resp.data.results[0]
      console.log(geoData)
      const originLocation = {
        lat: geoData.geometry.location.lat,
        lng: geoData.geometry.location.lng,
        address: address,
      }

      const params = {
        key: settings.GOOGLE_PLACES_KEY,
        location: `${originLocation.lat},${originLocation.lng}`,
        keyword: options.keyword,
        radius: options.radius,
      }

      return axios.get(GOOGLE_PLACES_URL, { params }).then((places_resp) => {
        const data = {
          origin_location: originLocation,
          results: places_resp.data.results
        }

        return resolve(data)
      })
    })
  })
}

function getNearby(req, res) {
  const origins = req.query.origins.split("|")
  const promises = origins.map(address => {
    const options = {
      radius: req.query.radius,
      keyword: req.query.keyword,
    }
    return getSingleNearby(address, options)
  })

  Promise.all(promises).then((response) => {
    const data = response.map(d => {
      return {
        origin_location: d.origin_location,
        destinations: d.results.map((dest) => {
          return {
            // TODO add more stuff here
            name: dest.name
          }
        }),
      }
    })

    res.send(data)
  })
}

module.exports = {
  get: getNearby,
}
