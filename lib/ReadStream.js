const Readable = require('stream').Readable
const http = require('http')
const https = require('https')

const pkg = require('../package')

class ReadStream extends Readable {
  constructor (resource, mode, options) {
    super()
    this._resource = resource
    this._mode = mode
    this._response = null
    this._options = this._buildRequestOptions(options)

    this._makeRequest()
  }

  _makeRequest () {
    const request = this._options.secure
      ? https.get(this._options)
      : http.get(this._options)

    request.once('response', response => {
      if (!this._validResponse(response.statusCode)) {
        const error = new Error(`Non-2xx status code received (${response.statusCode})`)
        error.statusCode = response.statusCode
        error.resource = this._resource
        error.mode = this._mode
        error.text = ''

        response.setEncoding('utf8')
        response.on('data', data => { error.text += data })
        response.on('end', () => this.emit('error', error))
      } else {
        this._response = response
        this._response.on('data', data => {
          if (!this.push(data)) {
            response.pause()
          }
        })
        this._response.on('end', () => {
          this._response = null
          this.push(null)
        })
      }
    })

    request.once('error', error => {
      this.emit('error', error)
    })
  }

  _buildRequestOptions (options) {
    return Object.assign({}, options, {
      method: 'GET',
      path: this._resource,
      headers: {
        'X-Mode': this._mode,
        'X-Client': this._getClientHeader()
      }
    })
  }

  _validResponse (statusCode) {
    return statusCode >= 200 && statusCode <= 299
  }

  _getClientHeader () {
    return `${pkg.name}(${pkg.version}):${process.release.name || 'node'}(${process.version}):${process.platform}(${process.arch})`
  }

  _read (size) {
    if (this._response !== null) {
      this._response.resume()
    }
  }
}

module.exports = exports = ReadStream
