
var UserSchema = new Schema({
created_at : { type: Date, default: Date.now }
, name : String
,	hashedPass : String
,	salt: String
,	email : Email
,	avatar : {type: String, default: "images/default_profile.png" }
,	statuses_count : Number
,	screen_name : String
,	location : String
,	about : String
, 	followers: [{ type: ObjectId, ref: 'User' }]
, 	following: [{ type: ObjectId, ref: 'User' }]
,	followers_count : Number
,	following_count : Number
, 	isFollow: Boolean
});

UserSchema.statics.makeSalt = function() {
	return Math.round((new Date().valueOf() * Math.random())) + '';
}

UserSchema.statics.encodePassword = function(pass, salt) {
	if ( typeof pass === 'string' && pass.length < 6)
		return ''
	return crypto.createHmac('sha1', salt).update(pass).digest('hex');
}

UserSchema.statics.validatePassword = function(plainPass, hashedPass, salt, callback) {
	var validHash = this.encodePassword(plainPass, salt);
	console.log("Plain: ", plainPass, "Hased: ", hashedPass);
	console.log("valid: ", validHash);
	callback(null, hashedPass === validHash);
}
UserSchema.statics.updatePassword = function(name, password, response) {
	var salt = this.makeSalt();
	this.update({
		'name' : name
	}, {
		"hashedPass" : this.encodePassword(password, salt),
		"salt" : salt
	}, {
		'upsert' : true
	}, function(err, numberAffected, raw) {
		if (err)
			return handleError(err);
		response("OK");
		console.log('The number of updated documents was %d', numberAffected);
		console.log('The raw response from Mongo was ', raw);
	});
}
UserSchema.statics.updateAvartar = function(name, link, callback) {
	this.update({
		'name' : name
	}, {
		"avatar" : "/public/images/avatar/" + link
	}, {
		"upsert" : true
	}, function(err, numberAffected, raw) {
		if (err)
			return handleError(err);
		callback("OK");
		console.log('The number of updated documents was %d', numberAffected);
		console.log('The raw response from Mongo was ', raw);
	});
}

UserSchema.statics.getObjectIdByName = function(name, callback) {
	this.findOne({
		name : name
	}, function(err, docs) {
		if (err)
			callback("error " + err)
		else {
			console.log("Check ", docs)
			callback(docs['_id'])
		}
	})
}




UserSchema.statics.createFollowing = function(data, callback) {
	console.log("data: ", data);
	this.findOne({
		name : data.name
	}, function(err, docs) {
		if (err)
			callback("error " + err)
		else if (docs) {
			
			// add following count 
			docs.following_count+=1;			
			
			// get 
			docs.following.push({"_id" : data.name_follow});				
			docs.save(function(err) {						
							if (err)
								callback(err);
							mongoose.model('User').findOne({
									 _id : data.name_follow
								}, function(err, doc){
									if(err) callback(err);
									if (doc){
										doc.followers_count+=1;
										doc.followers.push({"_id" : docs._id});
									}
									else callback('{"error": "user-not-found"}');
								}).populate('followers', 'name screen_name avatar _id').exec(function(err, docs) {
									if (err)
										callback(err);
									console.log('The followers is %s', docs.followers)
								});	
								
							mongoose.model('User').find({
									 _id : docs._id
								}).populate('following', 'name screen_name avatar _id').exec(function(err, docs) {
									if (err)
										callback(err);
									console.log('The following is %s', docs)
									// callback(docs);
									
								});
								callback('{"info": "success"}')
						});	
		}
	});	
	
}

UserSchema.statics.getFollowing = function(data, callback) {
	console.log("data: ", data);
	this.findOne({
		name : data.name
	} , 'name screen_name email avatar _id following followers_count following_count followers', function(err, docs) {
		if (err)
			callback("error " + err)
		else if (docs) {
			
			mongoose.model('User').findOne({
									 _id : docs._id
								}, 'name screen_name email avatar _id following followers_count following_count followers').populate('following', 'name screen_name avatar _id').exec(function(err, res) {
									if (err)
										callback(err);
									else if (res)
										callback(res.following);					
								});			
			
		}
		else callback('{"error": "user-not-found"}');
	});
}


UserSchema.statics.getFollowers = function(data, callback) {
	console.log("data: ", data);
	this.findOne({
		name : data.name
	} , 'name screen_name email avatar _id following followers_count following_count followers', function(err, docs) {
		if (err)
			callback("error " + err)
		else if (docs) {
			
			mongoose.model('User').findOne({
									 _id : docs._id
								}, 'name screen_name email avatar _id following followers_count following_count followers').populate('following', 'name screen_name avatar _id').exec(function(err, res) {
									if (err)
										callback(err);
									else if (res)
										callback(res.followers);					
								});			
			
		}
		else callback('{"error": "user-not-found"}');
	});
}



UserSchema.statics.getInfoUser = function(data, callback){
	this.findOne({name: data.name_get} , "name isFollow screen_name about location email avatar _id following followers_count following_count followers", function(err, docs){
		if (err) callback(err);
		if (docs){
			mongoose.model('User').getFollowing(data, function(res){
				if (res) {
					console.log("___xxxx__", res.length);
					docs.isFollow = false;
					for(var i=0; i< res.length; i++){
						if (data.name_get == res[i].name)
							docs.isFollow = true;
						console.log("___xxxx__",data.name_get, "=", res[i].name);
					}
					callback(docs)
				}
			})
		}
		else callback('{"error" : "not-found-user"}');
	})
}

mongoose.model('User', UserSchema);



