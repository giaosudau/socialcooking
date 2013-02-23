
var ES = require('./email-settings');
var EM = {};
module.exports = EM;

EM.server = require("emailjs/email").server.connect({

	host 	    : ES.host,
	user 	    : ES.user,
	password    : ES.password,
	ssl		    : true

});

EM.dispatchResetPasswordLink = function(account, callback)
{
	EM.server.send({
		from         : ES.sender,
		to           : account.email,
		subject      : 'Password Reset',
		text         : 'something went wrong... :(',
		attachment   : EM.composeEmail(account)
	}, callback );
}

EM.composeEmail = function(o)
{
	var html = "<html><body>";
		html += "Hi "+o.screen_name+",<br><br>";
		html += "Your username is :: <b>"+o.name+"</b><br><br>";
		html += "<b>Here is the code to reset password "+ o.salt+ "</b><br><br>";
		html += "Cheers,<br>";
		html += "<a href='http://twitter.com/sepdau'>sepdau</a><br><br>";
		html += "</body></html>";
	return  [{data:html, alternative:true}];
}