/**
 *  RxJS in action
 *  Chapter #
 *  @author Paul Daniels
 *  @author Luis Atencio
 */
const connect = require('connect');
const serveStatic = require('serve-static');
const http = require('http');

const app = connect();

app.use(serveStatic('.'));

const server = http.createServer(app)

server.listen(3000, () => {
  console.log('Banking in Action! on port:', server.address().port);
});