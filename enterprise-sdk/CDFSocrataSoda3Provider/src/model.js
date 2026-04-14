const _ = require('lodash')

function Model (koop) {}

Model.prototype.getData = function (req, callback) {
  const { host, id } = req.params

  // 1. Construct the Socrata API request URL
 
  const url = `https://${host}/api/v3/views/${id}/query.geojson`
  const apiKey = "";
  const apiSecret = ""

  const authHeader = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')
  // 2. Make the request to the remote API
    fetch(url, {
    headers: {
      Authorization: authHeader
    }
  }

  ).then(resp => {
    if (!resp.ok) {
      const status = resp.status
      const statusText = resp.statusText

      throw new Error(`Request to ${url} failed; ${status}, ${statusText}.`)

    }
    return resp.json()
  }).then(geojson => {
    // 4. Create Metadata
    const geometryType = _.get(geojson, 'features[0].geometry.type', 'Point')
    geojson.metadata = { geometryType }
    geojson.metadata = { name: 'City Data' }
    // 5. Fire callback
    callback(null, geojson)
  })
  // 6. Handle any errors
    .catch(callback)
}

module.exports = Model