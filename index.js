const express = require('express')

const settings = require('./local_settings.js')

const proximity = require('./resources/proximity')

const app = express()

app.get('/v1/proximity', proximity.get)

app.listen(3000, () => console.log('Example app listening on port 3000!'))
