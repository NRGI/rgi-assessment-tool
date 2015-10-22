'use strict';
var mongoose        = require('mongoose'),
    mongooseHistory = require('mongoose-history'),
    Schema          = mongoose.Schema,
    validate    = require('mongoose-validate'),
    encrypt     = require('../utilities/encryption');

var options = {customCollectionName: "user_hst"};

var ObjectId    = Schema.Types.ObjectId;

var modificationSchema = new Schema({
    modifiedBy: String,
    modifiedDate: {
        type:  Date,
        default: Date.now}
});

var userSchema = new Schema({
    firstName: {
        type: String,
        required: '{PATH} is required!'
    },
    lastName: {
        type: String,
        required: '{PATH} is required!'},
    username: {
        type: String,
        required:  '{PATH} is required!',
        unique: true},
    email: {
        type:  String,
        required: true,
        validate: [validate.email, 'invalid email address']},
    salt: {
        type: String,
        required: '{PATH} is required!'},
    hashed_pwd: {
        type: String,
        required: '{PATH} is required!'},
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
    modified: [modificationSchema],
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

questionSchema.plugin(userSchema, options);

var User = mongoose.model('User', userSchema);

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
