exports.createTweet = function(request, response) {
	var keys = Object.keys(request.query);
	request.body = JSON.parse(keys[1]);
	LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function(res) {
		if (res) {
			console.log(res);
			if (res == "success") {				
				Accounts.getObjectIdByName(request.body.name, function(result) {
					console.log("++++++++", request.body, "ID ", result)
					request.body.created_by = result;
					Tweet.createTweet(request.body, function(result){
						console.log(request.body)
						response.jsonp(result);
					})
				})
			} else
				response.jsonp(res);
		} else {
			response.jsonp("{error: cant-check-token}")
		}
	})
}

exports.createComment = function(request, response) {
	var keys = Object.keys(request.query);
	request.body = JSON.parse(keys[1]);
	LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function(res) {
		if (res) {
			console.log(res);
			if (res == "success") {				
				Accounts.getObjectIdByName(request.body.name, function(result) {
					console.log("++++++++", request.body, "ID ", result)
					request.body.created_by = result;					
					Tweet.createComment(request.body, function(result){
						console.log(request.body)
						response.jsonp(result);
					})
				})
			} else
				response.jsonp(res);
		} else {
			response.jsonp("{error: cant-check-token}")
		}
	})
}


exports.deleteComment = function(request, response) {
	var keys = Object.keys(request.query);
	console.log("KEYS ", keys[1])
	request.body = JSON.parse(keys[1]);
	LoginToken.checkTokenIsExpired(request.body.name, request.body.token, request.body.device, function(res) {
		if (res) {
			console.log(res);
			if (res == "success") {				
					Tweet.deleteComment(request.body, function(result){
						console.log(request.body)
						response.jsonp(result);
					})
			} else
				response.jsonp(res);
		} else {
			response.jsonp("{error: cant-check-token}")
		}
	})
}


// exports.createComment = function(req, res) {
// 	
// }
// > db.tweets.find()
// { "created_by" : ObjectId("511fd85ccc5e4e0d08203647"), "_id" : ObjectId("5120e8a1c1679aae1e000002"), "picture" : [ ], "comments" : [ ], "created_at" : ISODate("2013-02-17T14:26:41.872Z"), "__v" : 0 }
// > db.users.find()
// { "following_count" : 0, "followers_count" : 0, "statuses_count" : 0, "name" : "chanhle11", "password" : "sesHugq90v883fbe7e34c141e547810c0e27c2b9d6", "email" : "11giaosudau@gmail.com", "screen_name" : "Chanh Le", "about" : "Sexy Free and Single", "location" : "Hue", "_id" : ObjectId("511e0973763fb65672000001"), "created_at" : ISODate("2013-02-15T10:09:55.831Z"), "__v" : 0 }
// { "following_count" : 0, "followers_count" : 0, "statuses_count" : 0, "name" : "chanhle", "password" : "dO6MDGLgWtf6c435948d74328f61a328f28487f3d3", "email" : "giaosudau@gmail.com", "screen_name" : "Chanh Le", "about" : "Sexy Free and Single", "location" : "Hue", "_id" : ObjectId("511e0aad69a5d7be74000001"), "created_at" : ISODate("2013-02-15T10:15:09.856Z"), "__v" : 0 }
// { "following_count" : 0, "followers_count" : 0, "statuses_count" : 0, "name" : "chanhle44", "password" : "WArYb6ZmxOf92348077dcdec5c052f7652bc766c67", "email" : "11giaosudau@gmail.com.vn", "screen_name" : "Chanh Le", "about" : "Sexy Free and Single", "location" : "Hue", "_id" : ObjectId("511e14cc8b1a59277c000001"), "created_at" : ISODate("2013-02-15T10:58:20.324Z"), "__v" : 0 }
// { "following_count" : 0, "followers_count" : 0, "statuses_count" : 0, "name" : "chaNHle44", "password" : "q08rKpAr8Bfde9bdaba4944ab34a442d951606161b", "email" : "11giaosudau@gmail.vn", "screen_name" : "Chanh Le", "about" : "Sexy Free and Single", "location" : "Hue", "_id" : ObjectId("511e153e8a48f0087d000001"), "created_at" : ISODate("2013-02-15T11:00:14.789Z"), "__v" : 0 }
// { "following_count" : 0, "followers_count" : 0, "statuses_count" : 0, "name" : "chaNHl4", "password" : "eMUAtjkBuB579988798083bb3ae40ebbe17a0ab56e", "email" : "11giaosudau@gmil.vn", "screen_name" : "Chanh Le", "about" : "Sexy Free and Single", "location" : "Hue", "_id" : ObjectId("511e15eafe21e6487e000001"), "created_at" : ISODate("2013-02-15T11:03:06.045Z"), "__v" : 0 }
// { "following_count" : 0, "followers_count" : 0, "statuses_count" : 0, "name" : "chaN4", "password" : "yrO0vfAu05f0cde512bd3e02484583a7b297544393", "email" : "11giaosudau@gil.vn", "screen_name" : "Chanh Le", "about" : "Sexy Free and Single", "location" : "Hue", "_id" : ObjectId("511e161f6353c2167f000001"), "created_at" : ISODate("2013-02-15T11:03:59.782Z"), "__v" : 0 }
// { "following_count" : 0, "followers_count" : 0, "statuses_count" : 0, "name" : "sepdau1", "password" : "CYCDZ2ZsqB3e0bfb831dbeb404057f410f3dbbe3aa", "email" : "sepdau1@gmail.com", "screen_name" : "Sep Dau", "about" : "Sexy Free and Single", "location" : "Quang Tri", "_id" : ObjectId("511e4aa2e917abc23e000001"), "created_at" : ISODate("2013-02-15T14:48:02.353Z"), "__v" : 0 }
// { "following_count" : 0, "followers_count" : 0, "statuses_count" : 0, "salt" : "620413853127", "name" : "sepdau2", "password" : "627a68f519afe0cdac7cd27951a1aec425803701", "email" : "sepdau12@gmail.com", "screen_name" : "Sep Dau", "about" : "Sexy Free and Single", "location" : "Quang Tri", "_id" : ObjectId("511e5565df0bf91b51000001"), "created_at" : ISODate("2013-02-15T15:33:57.707Z"), "__v" : 0 }
// { "following_count" : 0, "followers_count" : 0, "statuses_count" : 0, "salt" : "523102466372", "name" : "sepdau123", "email" : "sepdau123@gmail.com", "screen_name" : "Sep Dau", "about" : "Sexy Free and Single", "location" : "Quang Tri", "_id" : ObjectId("511e80f79995be8219000001"), "created_at" : ISODate("2013-02-15T18:39:51.854Z"), "__v" : 0 }
// { "following_count" : 0, "followers_count" : 0, "statuses_count" : 0, "salt" : "219863315503", "name" : "sepdau1234", "email" : "sepdau1234@gmail.com", "screen_name" : "Sep Dau", "about" : "Sexy Free and Single", "location" : "Quang Tri", "_id" : ObjectId("511e8219992822331c000001"), "created_at" : ISODate("2013-02-15T18:44:41.528Z"), "__v" : 0 }
// { "__v" : 0, "_id" : ObjectId("511e822eb5e85e7c20000001"), "about" : "Sexy Free and Single", "created_at" : ISODate("2013-02-15T18:45:02.671Z"), "email" : "6999l@gmail.com", "followers_count" : 0, "following_count" : 0, "hashedPass" : "5239cf886eee84931ce2b0128be65dbf6a6b5da7", "location" : "Quang Tri", "name" : "sepdau12345", "salt" : "1283961467093", "screen_name" : "Chanh Leee", "statuses_count" : 0 }
// { "following_count" : 0, "followers_count" : 0, "statuses_count" : 0, "hashedPass" : "43cf1fb511dfbda33f20e57d2b690915f09127bf", "salt" : "878725063489", "name" : "test_user", "email" : "test_user@gmail.com", "screen_name" : "Test User", "about" : "Sexy Free and Single", "location" : "Quang Tri", "_id" : ObjectId("511fb603c4db242e4f000001"), "created_at" : ISODate("2013-02-16T16:38:27.514Z"), "__v" : 0 }
// { "__v" : 0, "_id" : ObjectId("511fbf4eba5ff68f62000001"), "about" : "Sexy Free and Single", "created_at" : ISODate("2013-02-16T17:18:06.717Z"), "email" : "mrletrungchanh@gmail.com", "followers_count" : 0, "following_count" : 0, "hashedPass" : "03ba132d91908fffc70caf1327a27b46ae94fa8e", "location" : "Quang Tri", "name" : "mrchanh", "salt" : "1192398307890", "screen_name" : "Chanh Leee", "statuses_count" : 0 }
// { "_id" : ObjectId("511fd85ccc5e4e0d08203647"), "name" : null, "salt" : "650969880591" }
// { "__v" : 0, "_id" : ObjectId("511e40cc0b5d386d32000001"), "about" : "Sexy Free and Single", "avartar" : "/public/images/avartar/76b50c36b5519c7232256981c947ebe5/IMAG0448.jpg", "created_at" : ISODate("2013-02-15T14:06:04.791Z"), "email" : "sepdau@gmail.com", "followers_count" : 0, "following_count" : 0, "location" : "Quang Tri", "name" : "sepdau", "password" : "M6uFDXwCJkb1e3f1cbf0f99d8068e30bc6c32855dd", "screen_name" : "Sep Dau", "statuses_count" : 0 }
// >
