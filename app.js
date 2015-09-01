'use strict';
//var compress = require('koa-compress');
var serve = require('koa-static');
var koa = require('koa');
var path = require('path');
var csrf = require('koa-csrf');
var session = require('koa-session');
var bodyParser = require('koa-body-parser');

var app = module.exports = koa();

// profile
var settings = require('./config/config.' + app.env);
// 临时演示解决方案，使用配置文件维护演示链接
settings['demoLinks'] = require('./config/demo_links.' + app.env);
app.settings = global.settings = settings;

// var dmLogger = require('./middlewares/logger').middleware;
var logger = require('./middlewares/logger').serviceLogger;

// Serve static files
app.use(serve(path.join(__dirname, 'public')));

// session
app.keys = ['session secret'];
app.use(session(app));

// body paser
app.use(bodyParser());

// CSRF
if (global.settings.enable_test ||
   (global.settings.enable_mock && !global.settings.generate_mock_data)) {

  var urlLib = require('url');
  var origin_format = urlLib.format;
  if (global.settings.use_rap) {
    // use rap mock
    urlLib.format = function (d) {
      // d.pathname= 'perf/2014.json';
      d.protocol = global.settings.rap_config.protocol;
      d.pathname = '/' + global.settings.rap_config.path_prefix
        + '/' + global.settings.rap_config.project_id
        + '/' + d.pathname;
      d.port = global.settings.rap_config.port;
      d.hostname = global.settings.rap_config.hostname;
      var rt = origin_format(d);
      return rt;
    }
  }else {
    // use local mock
    urlLib.format = function (d) {
      d.protocol = 'http';
      d.pathname = '/mock/' + d.pathname;
      if (global.settings.enable_test) {
        d.port = 7009; // 测试端口
      } else {
        d.port = global.settings.server_port; // 服务端口
      }
      d.hostname = 'localhost';
      var rt = origin_format(d);
      return rt;
    }
  }

}else {
  csrf(app);
  app.use(csrf.middleware);
}

// router
var routers = require('./routers');
routers.forEach(function (router) {
    app
        .use(router.routes())
        .use(router.allowedMethods());
});

// Compress
//app.use(compress());

if (!module.parent) {
    app.listen(global.settings.server_port);
    logger('info','进程(' + process.pid + ')', '开始监听端口 ' + global.settings.server_port);
}
