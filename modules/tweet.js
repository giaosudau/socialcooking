var CommentSchema = new Schema({
	body : {
		type : String,
		required : true
	},
	created_by : {
		type : Schema.ObjectId,
		ref : 'User',
		index : true
	},
	created_at : {
		type : Date,
		default: Date.now
	},
	updated_at : {
		type : Date
	}
});

var TweetSchema = new Schema ({
created_at : { type: Date, default: Date.now }
, created_by: { type: Schema.ObjectId, ref: "User"}
	, title : String
	,	comments : [CommentSchema]
	,	body : String
	,	picture:[String]
});

TweetSchema.statics.createTweet = function(data, callback) {
	console.log(data)
	var tweet = new this();
	tweet.created_by = data.created_by;
	tweet.title = data.title;
	tweet.body = data.body;
	tweet.save(function(err) {
		if (err)
			callback(err);
		// push to timeline
		// mongoose.model('User').getFollowers(data, function(res){
			// mongoose.model('TimeLine').find({})
		// })
		
		
		
		mongoose.model('Tweet').findOne({
			_id : tweet._id
		}).populate('created_by', 'name screen_name avatar').exec(function(err, tweet) {
			if (err)
				callback(err);
			console.log('The creator is %s', tweet.created_by.screen_name)
			callback(tweet);
		});
	});
}

TweetSchema.statics.createComment = function(data, callback) {
	mongoose.model('Tweet').findOne({
		_id : data.tweet_id
	}, function(err, docs) {
		if (err)
			callback(err);
		console.log(docs)
		docs.comments.push({
			"body" : data.body,
			"created_by" : data.created_by
		});

		docs.save(function(err) {
			mongoose.model('Tweet').findOne({
				_id : docs._id
			}).populate('comments.created_by', 'name screen_name avatar').exec(function(err, docs) {
				if (err)
					callback(err);
				console.log('The creator is %s', docs.comments[0].created_by.screen_name)
				callback(docs);
			});

		})
	})
}

TweetSchema.statics.deleteComment = function(data, callback) {
	mongoose.model('Tweet').findOne({
		_id : data.tweet_id
	}, function(err, docs) {
		if (err)
			callback(err);
		console.log(docs)
		if (docs) {
			console.log(data._id)
			docs.comments.id(data._id).remove();
			docs.save(function(err) {
				if (err)
					callback(err);
				console.log('the sub-doc was removed')
				callback("success");
			});
		}
	})
}

mongoose.model('Tweet', TweetSchema);

