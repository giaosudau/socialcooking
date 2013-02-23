// generate Token when login
var generateToken = function(name, device, callback) {
	// remove all token in device user use before
	LoginToken.remove({
		name : name,
		device : device
	}, function(err) {
	});
	if (!name) callback('{"error" : "missing name"}');
	else if (!device) callback('{"error" : "missing device"}');
	else
		crypto.randomBytes(48, function(ex, buf) {
			var LoginToken = mongoose.model('LoginToken');
			var token = new LoginToken();
			token.name = name;
			token.device = device;
			var tokenString = buf.toString('hex');
			token.series = tokenString;
			token.expire = new Date(Date.now() + 2 * 604800000);
			token.save();
			callback(token.series);
		});
}
// Main function

exports.createFollowing = function(newData, callback){
	var keys = Object.keys(newData.query);
	console.log(newData.query)
	newData.body = JSON.parse(keys[1]);
	console.log("Create Following", newData.body);
	LoginToken.checkTokenIsExpired(newData.body.name, newData.body.token, newData.body.device, function(info) {
				console.log("Check Token: ", info);
				if (info == "success") {
					console.log("SUCCESS");		
					Accounts.getObjectIdByName(newData.body.name_follow, function(res){
						newData.body.name_follow = res;
						Accounts.createFollowing(newData.body, function(result){
				 		callback.jsonp(result)
				 	})	
					})
							
				} else {
					console.log(info);
				 	
					callback.jsonp(info);
				}
			});
}

exports.getFollowing = function(newData, callback){
	var keys = Object.keys(newData.query);
	console.log(newData.query)
	newData.body = JSON.parse(keys[1]);
	console.log("Create Following", newData.body);
	LoginToken.checkTokenIsExpired(newData.body.name, newData.body.token, newData.body.device, function(info) {
				console.log("Check Token: ", info);
				if (info == "success") {
					console.log("SUCCESS");		
					Accounts.getFollowing(newData.body, function(res){
						callback.jsonp(res);
					})							
				} else {
					console.log(info);
					callback.jsonp(info);
				}
			});
}


exports.getFollowers = function(newData, callback){
	var keys = Object.keys(newData.query);
	console.log(newData.query)
	newData.body = JSON.parse(keys[1]);
	console.log("Get Follower", newData.body);
	LoginToken.checkTokenIsExpired(newData.body.name, newData.body.token, newData.body.device, function(info) {
				console.log("Check Token: ", info);
				if (info == "success") {
					console.log("SUCCESS");		
					Accounts.getFollowers(newData.body, function(res){
						callback.jsonp(res);
					})							
				} else {
					console.log(info);
					callback.jsonp(info);
				}
			});
}


exports.getInfoUser = function(newData, callback){
	var keys = Object.keys(newData.query);
	console.log(newData.query)
	newData.body = JSON.parse(keys[1]);
	LoginToken.checkTokenIsExpired(newData.body.name, newData.body.token, newData.body.device, function(info) {
				console.log("Check Token: ", info);
				if (info == "success") {
					console.log("SUCCESS");		
					Accounts.getInfoUser(newData.body, function(res){
						callback.jsonp(res);
					})							
				} else {
					console.log(info);
					callback.jsonp(info);
				}
			});
}

exports.updateAccount = function(newData, callback) {
	var keys = Object.keys(newData.query);
	newData.body = JSON.parse(keys[1]);
	Accounts.findOne({
		name : newData.body.name
	}, function(err, docs) {
		if (err) {
			callback.jsonp('{"error": ' + String(err) + "}");
		}
		if (!docs) {
			callback.jsonp('{"error": "account-not-found"}');
		} else {
			LoginToken.checkTokenIsExpired(newData.body.name, newData.body.token, newData.body.device, function(info) {
				if (info == "success") {
					console.log("SUCCESS");
					if (newData.body.password) {
						console.log("OK!")
						newData.body.password = Accounts.encodePassword(newData.body.password, docs['salt']);
					}
					Accounts.update({
						'name' : newData.body.name
					}, {
						'hashedPass' : newData.body.password ? newData.body.password : docs['hashedPass'],
						'screen_name' : newData.body.screen_name ? newData.body.screen_name : docs['screen_name'],
						'email' : newData.body.email ? newData.body.email : docs['email'],
						'about' : newData.body.about ? newData.body.about : docs['about'],
						'location' : newData.body.location ? newData.body.location : docs['location'],
					}, function(err, numberAffected, raw) {
						if (err)
							callback.jsonp(err);
						
						callback.jsonp('{"info": "update-info-success"}');
						console.log('The number of updated documents was %d', numberAffected);
						console.log('The raw response from Mongo was ', raw);
					})
				} else {
					console.log(info);
					callback.jsonp(info);
				}
			});

		}

	});
}

exports.autoLogin = function(request, response) {
	var keys = Object.keys(request.query);
	request.body = JSON.parse(keys[1]);
	Accounts.findOne({
		name : request.body.name
	}, function(err, docs) {
		if (err) {
			response.jsonp('{"error": "' + err + '"}');
		}
		if (!request.body.token) {
			response.jsonp('{"error": "token-not-found"}');
		} else if (!docs) {
			response.jsonp('{"error": "user-not-found"}');
		} else {
			console.log("info: ", docs);
			LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function(res) {
				if (res) {
					response.jsonp(res);
				} else {
					response.jsonp('{"error" : "cant-check-token"}')
				}
			})
		}
	})
}

exports.login = function(request, response) {
	var keys = Object.keys(request.query);
	request.body = JSON.parse(keys[1]);
	Accounts.findOne({
		name : request.body.name
	}, function(err, docs) {
		if (!docs) {
			response.jsonp('{"error": "user-not-found"}');
		} else {
			console.log("docs: ", docs);
			Accounts.validatePassword(request.body.password, docs['hashedPass'], docs['salt'], function(error, res) {
				if (error) {
					response.jsonp(error);
				}
				if (res) {
					// if (!request.body.device){
						// response.jsonp('{"error": "No Device Name"}');
					// }
					// else
						generateToken(request.body.name, request.body.device, function(res) {
							if (res) {
								Accounts.getObjectIdByName(request.body.name, function(result) {
								})
								response.jsonp('{"token": "' + res + '", "device" : "' + request.body.device + '"}');
							} else {
								response.jsonp('{"error": "cant-create-token"}');
							}
						});
				} else {
					response.jsonp('{"error": "invalid-password"}');
				}
			});

		}
	})
}

exports.register = function(newData, callback) {
	var keys = Object.keys(newData.query);
	newData.body = JSON.parse(keys[1]);
	Accounts.findOne({
		name : newData.body.name
	}, function(err, docs) {
		console.log('err:', err)
		console.log('docs:', docs)
		if (err) {
			throw err;
		} else if (docs) {
			callback.jsonp('{"error": "username-taken"}');
		} else {
			Accounts.findOne({
				email : newData.body.email
			}, function(err, docs) {
				if (docs) {
					callback.jsonp('{"error": "email-taken"}');
				} else {
					var account = new Accounts(newData.body);
					account.salt = Accounts.makeSalt();
					account.hashedPass = Accounts.encodePassword(newData.body.password, account.salt);
					account.statuses_count = 0;
					// account.avartar = "images/default_profile.png";
					account.followers = []
					account.following = []
					account.followers_count = 0;
					account.following_count = 0;
					account.save();
					callback.jsonp('{"info": "success"}');

				}
			});
		}
	});
}
exports.validateCode = function(newData, callback) {
	var keys = Object.keys(newData.query);
	newData.body = JSON.parse(keys[1]);
	Accounts.findOne({
		// email : newData.body.email,
		salt : newData.body.salt
	}, function(err, docs) {
		if (err) {
			throw err;
		} else if (docs) {
			generateToken(docs['name'], newData.body.device, function(res) {
				if (res) {
					callback.jsonp('{"info": "success", "token" :"' + res + '", "name": "' + docs["name"] + '"}');
				} else {
					callback.jsonp('{"error": "cant-create-token"}');
				}
			});
		} else
			callback.jsonp('{"error": "email-or-validate-code-are-not-correct"}');
	})
}

exports.resetPassword = function(data, callback) {
	var keys = Object.keys(data.query);
	data.body = JSON.parse(keys[1]);
	console.log("XXXXXXXXXXXXXX \n", data.body);
	LoginToken.checkTokenIsExpired(data.body.name, data.body.token, data.body.device, function(res) {
		if (res) {
			console.log("RES ", res);
			if (res == "success") {
				console.log("SUCCESS");
				Accounts.updatePassword(data.body.name, data.body.password, function(result) {
					console.log("Update Password SUCCESS");
					LoginToken.remove({
						name : data.body.name
					}, function(err) {
						console.log("Remove SUCCESS");
						callback.jsonp('{"info": "change-pass-success"}');
					});
					

				})
			} else
				callback.jsonp(res);
		} else {
			callback.jsonp('{"error": "cant-check-token"}')
		}
	})
}

exports.lostPassword = function(data, callback) {
	var keys = Object.keys(data.query);
	data.body = JSON.parse(keys[1]);
	Accounts.findOne({
		email : data.body.email
	}, function(err, docs) {
		if (err) {
			throw err;
		} else if (docs) {
			EM.dispatchResetPasswordLink(docs, function(res) {
				// this callback takes a moment to return //
				// should add an ajax loader to give user feedback //
				if (!res) {
					callback.jsonp('{"info": "email-sent"}');
				} else {
					callback.jsonp('{"error": "mail-server-error"}');
				}
			})
		} else
			callback.jsonp('{"error": "email-not-found"}');
	})
}
