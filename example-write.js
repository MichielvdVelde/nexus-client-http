const Client = require('./lib/Client')
const fs = require('fs')

const client = new Client()
const local = fs.createReadStream('./lib/Client.js')
const remote = client.createWriteStream('/Client.js')

local.pipe(remote)

remote.on('error', err => console.error(err))
remote.on('finish', () => console.log('END'))
