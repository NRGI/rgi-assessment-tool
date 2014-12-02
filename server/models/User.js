var mongoose 	= require('mongoose'),
	encrypt		= require('../utilities/encryption');

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
	/////// Do we need to deal with multiple roles here ///////////////////
	roles: [{type:String, required:'{PATH} is required!', default:'None'}],
	/////// Rename to assessments ///////////////////
	assessments:[{
		assessment_id: String, // ISO3 Identifier
		country_name: String, // Text name of country
		started: {type: Date, default:Date.now},
		submitted: {value:{type: Boolean, default:false}, date:Date},
		approved: {value:{type: Boolean, default:false}, date:Date}
	}],
	///////////////////Add creation tagging on the add user ctrl///////////////////
	// creation: {
	// 	createdBy: {type: String, required:'{PATH} is required'},
	// 	createdDate: {type: Date, default:Date.now}
	// },
	///////////////////Add modification array on the ser update ctrl///////////////////
	// modified: [{
	// 	modifiedBy: {type: String, required:'{PATH} is required'},
	// 	modifiedDate: {type: Date, default:Date.now}
	// }],
	address: String,
	language: [String]
	// groups: [String]
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
			User.create({firstName:'Chris',lastName:'Perry',username:'cperry',email:'cperry@resourcegovernance.org',salt: salt,hashed_pwd: hash,roles: 'researcher',assessments:[{assessment_id:'NIR', country_name:'Nigeria'}]});
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'apederson');
			User.create({firstName:'Anders',lastName:'Pederson',username:'apederson',email:'apederson@resourcegovernance.org',salt: salt,hashed_pwd: hash,roles: 'reviewer',assessments:[{assessment_id:'NIR', country_name:'Nigeria'}]});
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'ahasermann');
			User.create({firstName:'Anna',lastName:'Hasermann',username:'ahasermann',email:'ahasermann@resourcegovernance.org',salt: salt,hashed_pwd: hash,roles:'researcher',assessments:[{assessment_id:'TAZ', country_name:'Tanzania'},{assessment_id:'MMR', country_name:'Myanmar'}]});
			salt = encrypt.createSalt();
			hash = encrypt.hashPwd(salt, 'mkauffmann');
			User.create({firstName:'Mayeul',lastName:'Kauffmann',username:'mkauffmann',email:'mkauffmann@resourcegovernance.org',salt:salt,hashed_pwd: hash,roles:'reviewer',assessments:[{assessment_id:'TAZ', country_name:'Tanzania'},{assessment_id:'MMR', country_name:'Myanmar'}]});
		}
	})
};


exports.createDefaultUsers = createDefaultUsers;