// Octokit.js
// https://github.com/octokit/core.js#readme
const {Octokit} = require('@octokit/core')
const octokit = new Octokit({
  auth: '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'
})

octokit.request('GET /repos/luodexun/west/releases', {
  owner: 'luodexun',
  repo: 'west'
}).then(res => {
  console.log(1, res.data)
}).catch(err => {
  console.log(2, err.response)
})
