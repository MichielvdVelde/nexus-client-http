const EventEmitter = require('events').EventEmitter

const ReadStream = require('./ReadStream')
const WriteStream = require('./WriteStream')

const debug = require('debug')('Nexus:Client')

const DEFAULT_OPTIONS = {
  secure: false,
  hostname: 'localhost',
  port: 6607
}

class Client extends EventEmitter {
  static get MODES_READ () { return [ 'r' ] }
  static get MODES_WRITE () { return [ 'w', 'a' ] }
  static get MODE_READ () { return 'r' }
  static get MODE_WRITE () { return 'w' }
  static get MODE_APPEND () { return 'a' }

  constructor (options = {}) {
    super()
    this._options = Object.assign({}, DEFAULT_OPTIONS, options)
  }

  createReadStream (resource = null, mode = Client.MODE_READ, options = {}) {
    if (resource === null || typeof resource !== 'string' || resource[0] !== '/') {
      throw new TypeError('resource must be a string starting with a forward slash (/)')
    } else if (Client.MODES_READ.indexOf(mode) === -1) {
      throw new TypeError(`unsupported read mode (${mode})`)
    }
    debug(`createReadStream('${resource}', '${mode}')`)
    return new ReadStream(resource, mode, Object.assign({}, this._options, options))
  }

  createWriteStream (resource = null, mode = Client.MODE_WRITE, options = {}) {
    if (resource === null || typeof resource !== 'string' || resource[0] !== '/') {
      throw new TypeError('resource must be a string starting with a forward slash (/)')
    } else if (Client.MODES_WRITE.indexOf(mode) === -1) {
      throw new TypeError(`unsupported write mode (${mode})`)
    }
    debug(`createWriteStream('${resource}', '${mode}')`)
    return new WriteStream(resource, mode, Object.assign({}, this._options, options))
  }
}

module.exports = exports = Client
