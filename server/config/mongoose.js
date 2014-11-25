var mongoose 	= require('mongoose'),
	encrypt		= require('../utilities/encryption');

module.exports 	= function(config) {
	// connect to mongodb
	mongoose.connect(config.db);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console,'connection error...'));
	db.once('open', function callback() {
		console.log('rgi2015 db opened');
	});

	var questionSchema = mongoose.Schema({
		options_num : Number,
		question_text : String,
		row_id_org : Number,
		choice_2_criteria : String,
		choice_3_criteria : String,
		component : String,
		choice_5_criteria : String,
		choice_4_criteria : String,
		choice_1_criteria : String,
		row_id : Number,
		order : Number
	})

	var Question = mongoose.model('Question', questionSchema)

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
			return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
		}
	};
	var User = mongoose.model('User', userSchema);

	User.find({}).exec(function(err, collection) {
		if(collection.length === 0) {
			var salt, hash;
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'jcust');
			User.create({firstName:'Jim',lastName:'Cust',username:'jcust', salt: salt, hashed_pwd: hash, roles: ['supervisor']});
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'cperry');
			User.create({firstName:'Chris',lastName:'Perry',username:'cperry', salt: salt, hashed_pwd: hash, roles: []});
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'apederson');
			User.create({firstName:'Anders',lastName:'Pederson',username:'apederson', salt: salt, hashed_pwd: hash});
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'ahasermann');
			User.create({firstName:'Anna',lastName:'Hasermann',username:'ahasermann', salt: salt, hashed_pwd: hash, roles: ['researcher']});
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'mkauffmann');
			User.create({firstName:'Mayeul',lastName:'Kauffmann',username:'ahasermann', salt: salt, hashed_pwd: hash, roles: ['reviewer']});
		}
	});
}