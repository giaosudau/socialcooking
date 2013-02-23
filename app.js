
/**
 * Module dependencies.
 */

var express = require('express')
  // , routes = require('./routes')
  // , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

GLOBAL.app = express();
app.enable("jsonp callback");

app.configure(function(){  
  app.config = JSON.parse( require('fs').readFileSync('./config/development.json', 'utf8') );
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// app.get('/', routes.index);
// app.get('/users', user.list);

require('./modules/main.js');
var routes = require('./routes/index.js');



http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

