'use strict';

const port = process.env.PORT || 3003;
const app = require('./app');

app.listen(port, function() {
  console.log(`Node.js listening on ${port}`);
});