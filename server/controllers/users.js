'use strict';
/*jslint nomen: true unparam: true*/

var User = require('mongoose').model('User'),
    encrypt = require('../utilities/encryption'),
    mandrill = require('node-mandrill')(process.env.MANDRILL_KEY);


exports.getUsers = function (req, res) {
    var query;
    if (req.user.hasRole('supervisor')) {
        query = User.find(req.query);
    } else {
        query = User.find(req.query).select({ "firstName": 1, "lastName": 1});
    }
    query.exec(function (err, collection) {
        res.send(collection);
    });
};

exports.getUsersByID = function (req, res) {
    User.findOne({_id: req.params.id}).exec(function (err, user) {
        res.send(user);
    });
};

exports.getUsersListByID = function (req, res) {
    var query = User.findOne({_id: req.params.id}).select({ "firstName": 1, "lastName": 1, "email": 1});
    query.exec(function (err, user) {
        res.send(user);
    });
};

exports.createUser = function (req, res, next) {
    var userData = req.body;
    userData.username = userData.username.toLowerCase();
    userData.salt = encrypt.createSalt();
    userData.hashed_pwd = encrypt.hashPwd(userData.salt, userData.password);
    userData.createdBy = req.user._id;

    User.create(userData, function (err, user) {
        if (err) {
            if (err.toString().indexOf('E11000') > -1) {
                err = new Error('Duplicate Username');
            }
            res.status(400);
            return res.send({reason: err.toString()});
        }
    });
    //send an e-mail to jim rubenstein
    mandrill('/messages/send', {
        message: {
            to: [{email: 'byndcivilization@gmail.com', name: 'Chris Perry'}],
            from_email: 'cperry@resourcegovernance.org',
            subject: "Hey, what's up?",
            text: "Hello, I sent this message using mandrill."
        }
    }, function(error, response)
    {
        //uh oh, there was an error
        if (error) console.log( JSON.stringify(error) );

        //everything's good, lets see what mandrill said
        else console.log(response);
    });
    res.send();
};

exports.updateUser = function (req, res) {
    var userUpdates = req.body;

    if (req.user._id != userUpdates._id && !req.user.hasRole('supervisor')) {
        res.status(404);
        return res.end();
    }
    if (userUpdates.password && userUpdates.password.length > 0) {
        userUpdates.salt = encrypt.createSalt();
        userUpdates.hashed_pwd = encrypt.hashPwd(req.user.salt, userUpdates.password);
    }

    User.findOne({_id: req.body._id}).exec(function (err, user) {
        if (err) {
            res.status(400);
            return res.send({ reason: err.toString() });
        }
        user.firstName = userUpdates.firstName;
        user.lastName = userUpdates.lastName;
        user.email = userUpdates.email;
        user.salt = userUpdates.salt;
        user.hashed_pwd = userUpdates.hashed_pwd;
        user.language = userUpdates.language;
        user.assessments = userUpdates.assessments;
        if (user.modified) {
            user.modified.push({modifiedBy: req.user._id});
        } else {
            user.modified = {modifiedBy: req.user._id};
        }
        user.save(function (err) {
            if (err) {
                return res.send({ reason: err.toString() });
            }
        });
    });
    res.send();
};

exports.deleteUser = function (req, res) {

    User.remove({_id: req.params.id}, function (err) {
        if (!err) {
            res.send();
        } else {
            return res.send({ reason: err.toString() });
        }
    });
    res.send();
};