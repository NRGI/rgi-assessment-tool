'use strict';
var userSchema, User,
    mongoose        = require('mongoose'),
    mongooseHistory = require('mongoose-history'),
    options = {customCollectionName: "user_hst"},
    Schema          = mongoose.Schema,
    validate        = require('mongoose-validate'),
    encrypt         = require('../utilities/encryption'),
    ObjectId    = Schema.Types.ObjectId;

userSchema = new Schema({
    firstName: {
        type: String,
        required: 'first name is required',
        validate: [validate.alpha, 'invalid first name']},
    lastName: {
        type: String,
        required: 'last name is required',
        validate: [validate.alpha, 'invalid first name']},
    username: {
        type: String,
        required:  '{PATH} is required',
        validate: [validate.alphanumeric, 'invalid {PATH} (alphanumeric only)'],
        unique: true},
    email: {
        type:  String,
        required: '{PATH} is required',
        validate: [validate.email, 'invalid email address']},
    salt: {
        type: String,
        required: 'Your salt is missing'},
    hashed_pwd: {
        type: String,
        required: 'your hash is missing'},
    role: {
        type: String, required: '{PATH} is required!',
        default: 'None'},
    assessments: [{
        assessment_ID:  String, // ISO3 Identifier
        country_name:  String // Text name of country
    }],
    documents: [ObjectId],
    interviewees: [ObjectId],
    createdBy: ObjectId,
    creationDate: {
        type:  Date,
        default: Date.now},
    address: String,
    language: String
});

userSchema.methods = {
    authenticate:  function (passwordToMatch) {
        return encrypt.hashPwd(this.salt, passwordToMatch) === this.hashed_pwd;
    },
    hasRole:  function (role) {
        return this.role === role;
    },
    setPassword: function (password, callback) {
        this.salt = encrypt.createSalt();
        this.hashed_pwd = encrypt.hashPwd(this.salt, password);
        this.save(callback);
    }
};

userSchema.plugin(mongooseHistory, options);

User = mongoose.model('User', userSchema);

function createDefaultUsers() {
    User.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            var salt, hash;
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'jcust');
            User.create({
                firstName: 'Jim',
                lastName: 'Cust',
                username: 'jcust',
                email: 'jcust@resourcegovernance.org',
                salt:  salt,
                hashed_pwd:  hash,
                role: 'supervisor',
                language:  'English'
            });

            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'cperry');
            User.create({
                firstName: 'Chris',
                lastName: 'Perry',
                username: 'cperry',
                email: 'cperry@resourcegovernance.org',
                salt:  salt,
                hashed_pwd:  hash,
                role: 'researcher',
                assessments: [],
                language:  'English'
            });

            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'apederson');
            User.create({
                firstName: 'Anders',
                lastName: 'Pederson',
                username: 'apederson',
                email: 'apederson@resourcegovernance.org',
                salt:  salt,
                hashed_pwd:  hash,
                role: 'reviewer',
                assessments: [],
                language:  'English'
            });

            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'ahasermann');
            User.create({
                firstName: 'Anna',
                lastName: 'Hasermann',
                username: 'ahasermann',
                email: 'ahasermann@resourcegovernance.org',
                salt:  salt,
                hashed_pwd:  hash,
                role: 'researcher',
                assessments: [],
                language:  'English'
            });

            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'dmihalyi');
            User.create({
                firstName: 'David',
                lastName: 'Mihalyi',
                username: 'dmihalyi',
                email: 'dmihalyi@resourcegovernance.org',
                salt: salt,
                hashed_pwd:  hash,
                role: 'reviewer',
                assessments: [],
                language:  'English'
            });
        }
    });
}

exports.createDefaultUsers = createDefaultUsers;
