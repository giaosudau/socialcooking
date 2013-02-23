var LoginToken = new Schema ({
created_at : { type: Date, default: Date.now }, name: String,
expire: Date,
series : {type: String, required: true},
device : {type: String, required: true}
});

LoginToken.statics.checkTokenIsExpired = function(name, token, device, res) {
	console.log("INFO: ", name, token, device);
	this.findOne({
		$and : [{
			"name" : name
		}, {
			"series" : token
		}, {
			"device" : device
		}]
	}, function(error, info) {
		if (error) {
			console.log("ERROR");
			res(error);
		} else if (info) {
			var expire = new String(info['expire']);
			var date = new Date(expire);
			if (date >= new Date()) {
				res("success");
			} else {
				console.log("expired");
				res('{"error": "token-has-expired"}');
			}
		} else {
			console.log("ERROR not found ")
			res('{"error": "token-not-found"}');
		}
	});
}

mongoose.model('LoginToken', LoginToken);
