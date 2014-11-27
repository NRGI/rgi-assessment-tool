var mongoose 	= require('mongoose'),
	encrypt		= require('../utilities/encryption');

// function arrayMin(val) {
// 	return val.length > 0;
// }

var userSchema = mongoose.Schema({
	firstName: {type:String, required:'{PATH} is required!'},
	lastName: {type:String, required:'{PATH} is required!'},
	username: {
		type:String,
		required: '{PATH} is required!',
		unique:true
	},
	email: {type: String, required:'{PATH} is required'},
	salt: {type:String, required:'{PATH} is required!'},
	hashed_pwd: {type:String, required:'{PATH} is required!'},
	// Think about multiple roles here
	roles: [{type:String, required:'{PATH} is required!', default:'None'}],
	countries:[{
		country: String, // ISO3 Identifier
		submitted: {type: Boolean, default:false},
		approved: {type: Boolean, default:false}, 
	}],
	// // Add creation tagging on the add user ctrl
	// creation: {
	// 	createdBy: {type: String, required:'{PATH} is required'},
	// 	createdDate: {type: Date, default:Date.now}
	// },
	// // Add modification array on the ser update ctrl
	// modified: [{
	// 	modifiedBy: {type: String, required:'{PATH} is required'},
	// 	modifiedDate: {type: Date, default:Date.now}
	// }],
	address: String,
	language: [String],
	groups: [String]
});

userSchema.methods = {
	authenticate: function(passwordToMatch) {
			return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
	},
	hasRole: function(role) {
			return this.roles.indexOf(role) > -1;
	}
};

var User = mongoose.model('User', userSchema);

function createDefaultUsers() {
	User.find({}).exec(function(err, collection) {
		if(collection.length === 0) {
			var salt, hash;
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'jcust');
			User.create({firstName:'Jim',lastName:'Cust',username:'jcust',email:'jcust@resourcegovernance.org',salt: salt, hashed_pwd: hash,roles: 'supervisor'});
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'cperry');
			User.create({firstName:'Chris',lastName:'Perry',username:'cperry',email:'cperry@resourcegovernance.org',salt: salt,hashed_pwd: hash,roles: 'researcher',countries:[{country:'NIG'}]});
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'apederson');
			User.create({firstName:'Anders',lastName:'Pederson',username:'apederson',email:'apederson@resourcegovernance.org',salt: salt,hashed_pwd: hash,roles: 'reviewer',countries:[{country:'NIG'}]});
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'ahasermann');
			User.create({firstName:'Anna',lastName:'Hasermann',username:'ahasermann',email:'ahasermann@resourcegovernance.org',salt: salt,hashed_pwd: hash,roles:'researcher',countries:[{country:'NIG'},{country:'TZA'}]});
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'mkauffmann');
			User.create({firstName:'Mayeul',lastName:'Kauffmann',username:'mkauffmann',email:'mkauffmann@resourcegovernance.org',salt:salt,hashed_pwd: hash,roles:'reviewer',countries:[{country:'NIG'},{country:'TZA'}]});
		}
	})
};

exports.createDefaultUsers = createDefaultUsers;