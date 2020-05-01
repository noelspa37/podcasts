const routes = require('next-routes');

// Name   Page      Pattern
module.exports = routes() // ----   ----      -----
  .add('index') // about  about     /about
  .add('channel', '/:slug.:id', 'channel') //posta-11111
  .add('podcast', '/:slugChannel.:idChannel/:slug.:id', 'podcast'); //posta-11111
