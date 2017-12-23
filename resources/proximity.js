// const fs = require('fs');
// const axios = require('axios');

// const destinationsData = JSON.parse(fs.readFileSync('./destinations.json', 'utf8'));
// const propertiesData = JSON.parse(fs.readFileSync('./properties.json', 'utf8'));

// // days/week at each spot
// const destinationTypes = {
//   groceries: 3,
//   urbanclimb: 4,
//   uni: 1,
//   work: 4,
//   rbwh: 4,
//   tpch: 4,
//   qpac: 4
// }

// function distanceFrom(origins, destinations, transport_method) {
//   return new Promise((resolve, reject) => {
//     const params = [
//       `origins=${origins.reduce((a, b) => `${a}${b}|`, '')}`,
//       `destinations=${destinations.reduce((a, b) => `${a}${b}|`, '')}`,
//       `method=${transport_method}`
//     ]

//     const url = `${BASE_URL}${params.reduce((a, b) => `${a}&${b}`, '')}`

//     axios.get(url).then((response) => {
//       // console.log(JSON.stringify(response.data.rows[0]))
//       const data = response.data
//       const parsed = []
//       data.rows.forEach((row, i) => {
//         const addr = data.origin_addresses[i]
//         row.elements.forEach((e, j) => {
//           const destination = {}

//           destination.name = destinationsData[j].name
//           destination.type = destinationsData[j].type
//           destination.distance = e.distance.value
//           destination.duration = e.duration.value
//           destination.origin_address = addr

//           parsed.push(destination)
//         })
//       })

//       resolve(parsed)
//     })
//   })
// }

// function analyse(data) {
//   const analysis = {}
//   console.log(data)
//   Object.keys(destinationTypes).forEach(t => {
//     console.log(t)
//     const nodes = data.filter(n => n.type == t)
//     const stats = {}
//     stats.closestDuration = nodes.sort((a, b) => a.duration - b.duration)[0]
//     // stats.closestDistance = nodes.sort((a, b) => a.distance - b.distance)[0]
//     analysis[t] = stats
//   })

//   console.log(analysis)
// }


// distanceFrom(
//   propertiesData.map(d => d.address),
//   destinationsData.map(d => d.address),
//   'bicyling'
// ).then(data => analyse(data))

function getProximity(req, res) {
  console.log("GET Proximity")
  res.send("ello world")
}

module.exports = {
  get: getProximity,
}
