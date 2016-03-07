'use strict';
var userSchema, User,
    mongoose        = require('mongoose'),
    mongooseHistory = require('mongoose-history'),
    //options         = {customCollectionName: "user_hst"},
    Schema          = mongoose.Schema,
    validate        = require('mongoose-validate'),
    encrypt         = require('../utilities/encryption'),
    ObjectId        = Schema.Types.ObjectId;

userSchema = new Schema({
    firstName: {
        type: String,
        required: 'first name is required',
        validate: [validate.alpha, 'invalid first name']},
    lastName: {
        type: String,
        required: 'last name is required',
        validate: [validate.alpha, 'invalid last name']},
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
        type: String, required: 'Role is required!',
        default: 'None'},
    assessments: [{
        assessment_ID:  String, // ISO3 Identifier
        country_name:  String // Text name of country
    }],
    documents: [{
        type: ObjectId,
        ref: 'Documents'}],
    interviewees: [{
        type: ObjectId,
        ref: 'Interviewees'}],
    createdBy: {
        type: ObjectId,
        ref: 'User'},
    creationDate: {
        type:  Date,
        default: Date.now},
    address: String,
    external_type: String, //government, country_team,
    salutation: String,
    title: String,
    position: String,
    organization: String,
    phone: String,
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

userSchema.plugin(mongooseHistory);

User = mongoose.model('User', userSchema);

function createDefaultUsers() {
    User.find({}).exec(function (err, collection) {
        var salt, hash;
        if (collection.length === 0 && process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'question_staging') {
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'jcust');
            User.create({
                firstName: 'Jim',
                lastName: 'Cust',
                username: 'jcust',
                email: 'tech-support@resourcegovernance.org',
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
                email: 'tech-support@resourcegovernance.org',
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
                email: 'tech-support@resourcegovernance.org',
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
                email: 'tech-support@resourcegovernance.org',
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
                email: 'tech-support@resourcegovernance.org',
                salt: salt,
                hashed_pwd:  hash,
                role: 'reviewer',
                assessments: [],
                language:  'English'
            });

            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'external');
            User.create({
                firstName: 'external',
                lastName: 'reviewer',
                username: 'external',
                email: 'tech-support@resourcegovernance.org',
                salt: salt,
                hashed_pwd:  hash,
                role: 'ext_reviewer',
                assessments: [],
                language:  'English'
            });

            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'external');
            User.create({
                firstName: 'externaltwo',
                lastName: 'reviewer',
                username: 'externaltwo',
                email: 'tech-support@resourcegovernance.org',
                salt: salt,
                hashed_pwd:  hash,
                role: 'ext_reviewer',
                assessments: [],
                language:  'English'
            });
        } else if (collection.length === 0 && (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'question_staging')) {
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
                role: 'supervisor',
                language:  'English'
            });
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'jmcmann');
            User.create({
                firstName: 'Jason',
                lastName: 'McMann',
                username: 'jmcmann',
                email: 'jmcmann@resourcegovernance.org',
                salt:  salt,
                hashed_pwd:  hash,
                role: 'supervisor',
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
                role: 'supervisor',
                language:  'English'
            });
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'dhartmann');
            User.create({
                firstName: 'Diana',
                lastName: 'Hartmann',
                username: 'dhartmann',
                email: 'dhartmann@resourcegovernance.org',
                salt:  salt,
                hashed_pwd:  hash,
                role: 'supervisor',
                language:  'English'
            });
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'gjacovella');
            User.create({
                firstName: 'Giulia',
                lastName: 'Jacovella',
                username: 'gjacovella',
                email: 'gjacovella@resourcegovernance.org',
                salt:  salt,
                hashed_pwd:  hash,
                role: 'supervisor',
                language:  'English'
            });
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'hpatel');
            User.create({
                firstName: 'Humaira',
                lastName: 'Patel',
                username: 'hpatel',
                email: 'hpatel@resourcegovernance.org',
                salt:  salt,
                hashed_pwd:  hash,
                role: 'supervisor',
                language:  'English'
            });
            salt = encrypt.createSalt();
            hash = encrypt.hashPwd(salt, 'iedwards');
            User.create({
                firstName: 'Isabelle',
                lastName: 'Edwards',
                username: 'iedwards',
                email: 'iedwards@resourcegovernance.org',
                salt:  salt,
                hashed_pwd:  hash,
                role: 'supervisor',
                language:  'English'
            });
        }
    });
}

exports.createDefaultUsers = createDefaultUsers;
