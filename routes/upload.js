// file is automatically saved to /public/uploads, let's just set
exports.uploadFile = function(req, res, next) {
	if (req.files) {
		req.body.url = "http://sepdau.serverjs.jit.su/" + req.files.file.path.split("/").slice(-2).join("/")
		req.body.path = req.files.file.path.split("/").slice(-2).join("/")
	}
	next()
}
// file upload is optional, it could have come before
exports.addPhoto = function(req, res) {
	var eventId = req.param("eventId")
	var e = req.body
	var userId = e.userId ? new ObjectId(e.userId) : undefined
	var photo = new Photo({
		userId : userId,
		eventId : new ObjectId(e.eventId),
		latitude : e.latitude,
		longitude : e.longitude,
		path : e.path,
		url : e.url,
		type : e.type,
		title : e.title,
		description : e.description
	})

	photo.save(function(err) {
		if (err)
			return res.send(err.message, 500)
		res.json("OK")
	})
}