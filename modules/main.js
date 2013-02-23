GLOBAL.mongoose = require('mongoose');
mongoose.set('debug', true);

GLOBAL.Schema = mongoose.Schema;
GLOBAL.mongooseTypes = require("mongoose-types");
mongooseTypes.loadTypes(mongoose);

GLOBAL.crypto = require('crypto');



GLOBAL.Email = mongoose.SchemaTypes.Email;
GLOBAL.Url = mongoose.SchemaTypes.Url;
GLOBAL.ObjectId = Schema.ObjectId;


require('./user.js');
require('./tweet.js');
require('./logintoken.js');
require('./email-dispatcher.js');
app.models = mongoose.models;

// connect to mongodb 
// var url = app.config.mongodb_url;
var url = app.config.mongodb_url_deploy
mongoose.connect(url);



mongoose.models.User.count({}, function (err, num) { console.log('users:',num)  });
mongoose.models.LoginToken.count({}, function (err, num) { console.log('token:',num)  });
mongoose.models.Tweet.count({}, function (err, num) { console.log('Tweet:',num)  });
module.exports = mongoose.models;


