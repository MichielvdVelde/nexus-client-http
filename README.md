# Nexus client for node.js

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

Node.js HTTP client for [Nexus](http://github.com/MichievdVelde/nexus-server), a
simple HTTP file storage server.

The client provides a streams-compatible interface. It's a thin-vailed semantic
wrapper that makes it as simple to work with remote files as it is with local files.

> Nexus is currently **an alpha version**. Use at your own risk.

> Also, it is **not yet available on npm**!

Documentation is sparse at the moment, I will write some more later. In the mean
time take a look at the source code if you're interested.

## Examples

These trivial examples are really as simple as they look!

### Getting a new client

```js
const Client = require('nexus-client-http')

const client = new Client({
  // These options are given to http.request
  hostname: 'localhost', // this is the default host name
  port: 6607 // this is the default port
})
```

### Read example

Loads a remote resource and pipes it to a local file.
Also see [example-read.js](./example-read.js).

```js
const fs = require('fs')

const local = fs.createWriteStream('./resource.json')
const remote = client.createReadStream('/resource.json')

local.on('end', () => {
  console.log('read ended!')
})

// Pipe the remote stream to the local stream
remote.pipe(local)
```

### Write example

Writes the contents of a local file to a remote resource.
Also see [example-write.js](./example-write.js).

```js
const fs = require('fs')

const local = fs.createReadStream('./resource.json')
const remote = client.createWriteStream('/resource.json')

remote.on('end', () => {
  console.log('write ended!')
})

// Pipe the local stream to the remote stream
local.stream(remote)
```

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

### License

Copyright 2017 [Michiel van der Velde](http://www.michielvdvelde.nl).

This software is licensed under the [MIT License](LICENSE).
