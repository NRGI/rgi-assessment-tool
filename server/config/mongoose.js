var mongoose 	= require('mongoose'),
	crypto		= require('crypto');

module.exports 	= function(config) {
	// connect to mongodb
	mongoose.connect(config.db);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console,'connection error...'));
	db.once('open', function callback() {
		console.log('rgi2015 db opened');
	});

	var userSchema = mongoose.Schema({
		firstName: String,
		lastName: String,
		username: String,
		salt: String,
		hashed_pwd: String,
		roles: [String]
	});
	userSchema.methods = {
		authenticate: function(passwordToMatch) {
			return hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
		}
	};
	var User = mongoose.model('User', userSchema);

	User.find({}).exec(function(err, collection) {
		if(collection.length === 0) {
			var salt, hash;
			salt = createSalt();
			hash = hashPwd(salt, 'jcust');
			User.create({firstName:'Jim',lastName:'Cust',username:'jcust', salt: salt, hashed_pwd: hash, roles: ['supervisor']});
			salt = createSalt();
			hash = hashPwd(salt, 'cperry');
			User.create({firstName:'Chris',lastName:'Perry',username:'cperry', salt: salt, hashed_pwd: hash, roles: []});
			salt = createSalt();
			hash = hashPwd(salt, 'apederson');
			User.create({firstName:'Anders',lastName:'Pederson',username:'apederson', salt: salt, hashed_pwd: hash});
			salt = createSalt();
			hash = hashPwd(salt, 'ahasermann');
			User.create({firstName:'Anna',lastName:'Hasermann',username:'ahasermann', salt: salt, hashed_pwd: hash, roles: ['researcher']});
			salt = createSalt();
			hash = hashPwd(salt, 'mkauffmann');
			User.create({firstName:'Mayeul',lastName:'Kauffmann',username:'ahasermann', salt: salt, hashed_pwd: hash, roles: ['reviewer']});
		}
	});
}

function createSalt() {
	return crypto.randomBytes(128).toString('base64');
}

function hashPwd(salt, pwd) {
	var hmac = crypto.createHmac('sha1', salt);
	return hmac.update(pwd).digest('hex');
}