var mongoose 	= require('mongoose'),
	encrypt		= require('../utilities/encryption');


var userSchema = mongoose.Schema({
	firstName: {type:String, required:'{PATH} is required!'},
	lastName: {type:String, required:'{PATH} is required!'},
	username: {
		type: String,
		required: '{PATH} is required!',
		unique:true
	},
	salt: {type:String, required:'{PATH} is required!'},
	hashed_pwd: {type:String, required:'{PATH} is required!'},
	roles: [String]
});

userSchema.methods = {
	authenticate: function(passwordToMatch) {
			return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
	}
};

var User = mongoose.model('User', userSchema);

function createDefaultUsers() {
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
	})
};

exports.createDefaultUsers = createDefaultUsers;