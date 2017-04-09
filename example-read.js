const Client = require('./lib/Client')

const client = new Client()
const resource = client.createReadStream('/Client.js')

resource.setEncoding('utf8')
resource.on('data', data => console.log(data))
resource.on('error', err => console.error(err))
resource.on('end', () => console.log('END'))
