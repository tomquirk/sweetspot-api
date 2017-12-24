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

function getNearby(req, res) {
  geocode(req.query.address).then((geo_resp) => {
    const geoData = geo_resp.data.results[0]
    const originLocation = {
      lat: geoData.geometry.location.lat,
      lng: geoData.geometry.location.lng,
      address: req.query.address,
    }

    const params = {
      key: settings.GOOGLE_PLACES_KEY,
      location: `${originLocation.lat},${originLocation.lng}`,
      keyword: req.query.keyword,
      radius: req.query.radius,
    }

    axios.get(GOOGLE_PLACES_URL, { params }).then((places_resp) => {
      const data = {
        origin_location: originLocation,
        results: places_resp.data.results
      }
      res.send(data)
    })
  })
}

module.exports = {
  get: getNearby,
}
