var http = require('http')
var createHandler = require('github-webhook-handler')
var handler = createHandler({path: '/webhook', secret: 'newPush'})
const {exec} = require('child_process')

http.createServer(function(req, res) {
	handler(req, res, function(err) {
		res.statusCode = 404
		res.end('no such location')
	})
}).listen(7777, () => {
	console.log('Server running on port 7777')
})

handler.on('error', function(err) {
	console.error('Error:', err.message)
})

handler.on('push', function(event) {
	console.log('Received a push event for %s to %s',
		event.payload.repository.name,
		event.payload.ref)
	exec('cd /www/wwwroot/default/blog && git pull', (err, stdout, stderr) => {
		if (err) {
			console.log(err)
		}
		else {
			console.log('updated success')
		}
	})
})

handler.on('issues', function(event) {
	console.log('Received an issue event for %s action=%s: #%d %s',
		event.payload.repository.name,
		event.payload.action,
		event.payload.issue.number,
		event.payload.issue.title)
})
