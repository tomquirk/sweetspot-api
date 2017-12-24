const fs = require('fs');
const axios = require('axios');

const settings = require('../local_settings')

function getAddresses(req, res) {
  req.query.units = 'metric'
  req.query.key = settings.GOOGLE_API_KEY
  axios.get(settings.GOOGLE_BASE_URL, { params: req.query }).then((response) => {
    const data = response.data

    // for each origin address, there is a row. For each row, is an element for each dest.
    const parsed = data.rows.map((row, i) => {
      return {
        origin_location: {
          address: data.origin_addresses[i],
        },
        destinations: row.elements.map((e, j) => {
          return {
            distance: e.distance.value,
            duration: e.duration.value,
            address: data.destination_addresses[j],
          }
        }),
      }
    })
    res.send(parsed)
    // resolve(parsed)
  })
}

module.exports = {
  get: getAddresses,
}
