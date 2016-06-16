'use strict';

var encrypt = require('../../../server/utilities/encryption');

module.exports = {
    load: function(mongoose, next) {
        console.log('Create `Supervisor` fixture');

        var salt = encrypt.createSalt(),
            hash = encrypt.hashPwd(salt, 'jcust');

        mongoose.model('User').create({
            firstName: 'Jim',
            lastName: 'Cust',
            username: 'jcust',
            email: 'jcust@resourcegovernance.org',
            salt:  salt,
            hashed_pwd:  hash,
            role: 'supervisor',
            assessments: [],
            language:  'English'
        }, function(err) {
            if(err) {
                console.log('The fixture has not been created. The error is');
                console.log(err);
            } else {
                console.log('The fixture has been successfully created');
            }

            next();
        });
    }
};
