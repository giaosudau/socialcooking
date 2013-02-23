var TimeLineSchema = new Schema({
		user_id: { type: ObjectId, ref: 'User' }
	,	tweet_ids: [{ type: ObjectId, ref: 'Tweet' }]
})

TimeLineSchema.statics.getTimeLine = function(req, res){
	
}
TimeLineSchema.statics.getMoreTweet = function(req, res){
	
}
TimeLineSchema.statics.getUserIdTimeLine = function(req, res){
	
}

mongoose.model('User', UserSchema);
