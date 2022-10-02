module.exports = {
  apps : [{
    name   : "www.dlwalt.com",
    script : "./server.js",
    watch: false,
    ignore_watch: ['[\/\\]\./', 'node_modules']
  }]
}
