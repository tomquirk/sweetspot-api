const addresses = require('./resources/addresses')
const nearby = require('./resources/nearby')
const fs = require('fs')

function genReport(filename) {
  const params = JSON.parse(fs.readFileSync(filename).toString())
  let csv = ','
  const origins = params.origins
  const destinations = params.places.addresses.map(a => a.address)
  addresses._addresses(origins, destinations).then((res) => {
    csv += `${destinations.reduce((a, b) => `${a}"${b}",`, '')}\n`
    res.forEach((r) => {
      csv += `"${r.origin_location.address}",${r.destinations.map(d => d.duration).join(',')}\n`
    })

    fs.writeFileSync('./report.csv', csv)
  })
}

genReport('compare.json')
