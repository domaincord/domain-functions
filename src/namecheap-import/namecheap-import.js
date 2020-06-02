/* eslint-disable */
const fetch = require('node-fetch')
const parser = require('xml2json')
const querystring = require('querystring')

exports.handler = async function(event, context) {
  const { username, apiUser, apiKey, ipAddress } = event.body

  const qs = querystring.stringify({
    ApiUser: apiUser,
    ApiKey: apiKey,
    UserName: username,
    Command: 'namecheap.domains.getList',
    ClientIp: ipAddress,
    SortBy: 'NAME',
    PageSize: 100
  })

  try {
    const response = await fetch(`https://api.namecheap.com/xml.response?${qs}`, {
      headers: { Accept: 'application/xml' }
    })
    if (!response.ok) {
      // NOT res.status >= 200 && res.status < 300
      return { statusCode: response.status, body: response.statusText }
    }
    const xml = await response.text()
    console.log(xml)

    const json = parser.toJson(xml)
    console.log(json)

    return {
      statusCode: 200,
      body: JSON.stringify(json)
    }
  } catch (err) {
    console.log(err) // output to netlify function log
    return {
      statusCode: 500,
      body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
    }
  }
}
