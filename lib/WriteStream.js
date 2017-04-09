const Writable = require('stream').Writable
const http = require('http')

const pkg = require('../package')
const debug = require('debug')('Nexus:WriteStream')

class WriteStream extends Writable {
  constructor (resource, mode, options) {
    super()
    this._resource = resource
    this._mode = mode
    this._request = null
    this._options = this._buildRequestOptions(options)

    this._firstWrite = true
    this._makeRequest()
  }

  _makeRequest () {
    debug('_makeRequest')
    this._request = http.request(this._options)

    this._request.on('finish', () => {
      debug('request ended')
    })

    this.once('finish', () => {
      debug('write stream ended')
      this._request.end()
    })
  }

  _buildRequestOptions (options) {
    return Object.assign({}, options, {
      method: 'POST',
      path: '/upload',
      headers: {
        'Expect': '100-continue',
        'Transfer-Encoding': 'chunked',
        'X-Resource': this._resource,
        'X-Mode': this._mode,
        'X-Client': this._getClientHeader()
      }
    })
  }

  _getClientHeader () {
    return `${pkg.name}(${pkg.version}):${process.release.name || 'node'}(${process.version}):${process.platform}(${process.arch})`
  }

  _write (chunk, encoding, callback) {
    if (this._firstWrite) {
      this._firstWrite = false
      this._request.once('continue', () => {
        debug(`write ${chunk.length} bytes...`)
        this._request.write(chunk)
        callback()
      })
    } else {
      debug(`write ${chunk.length} bytes...`)
      this._request.write(chunk)
      callback()
    }
  }
}

module.exports = exports = WriteStream
