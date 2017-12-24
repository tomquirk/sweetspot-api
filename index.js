const express = require('express')

const settings = require('./local_settings.js')

const addresses = require('./resources/addresses')

const app = express()

app.get('/v1/addresses', addresses.get)

app.listen(3000, () => console.log('Example app listening on port 3000!'))
