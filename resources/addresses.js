const axios = require('axios')

const settings = require('../local_settings')

const GOOGLE_DISTANEMATRIX_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json'

function massageData(data) {
  // for each origin address, there is a row. For each row, is an element for each dest.
  return data.rows.map((row, i) => {
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
}

function addresses(origins, destinations) {
  return new Promise((resolve) => {
    const params = {
      key: settings.GOOGLE_DISTANCEMATRIX_KEY,
      units: 'metric',
      origins: origins.join('|'),
      destinations: destinations.join('|'),
    }

    axios.get(GOOGLE_DISTANEMATRIX_URL, { params }).then((response) => {
      const parsed = massageData(response.data)
      resolve(parsed)
    })
  })
}

function getAddresses(req, res) {
  addresses(req.query.origins.split('|'), req.query.destinations.split('|')).then(data => res.send(data))
}

module.exports = {
  get: getAddresses,
  _addresses: addresses,
}
