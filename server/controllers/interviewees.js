'use strict';
/* global require */

var Interviewee = require('mongoose').model('Interviewee');
var generalResponse = require('./general-response');

var getIntervieweeSet = function(method, criteria, errorMessage, res) {
    Interviewee[method](criteria).exec(function (err, interviewees) {
        if (!err && !interviewees) {
            err = new Error(errorMessage);
        }

        res.send(err ? {reason: err.toString()} : interviewees);
    });
};

exports.getInterviewees = function (req, res) {
    getIntervieweeSet('find', req.query, 'No interviewees found', res);
};

exports.getIntervieweeByID = function (req, res) {
    getIntervieweeSet('findOne', {_id: req.params.id}, 'No interviewee found', res);
};
//noinspection JSUnusedLocalSymbols
exports.createInterviewee = function (req, res, next) {
    var interviewee_data = req.body;

    interviewee_data.createdBy = req.user._id;

    //noinspection JSUnusedLocalSymbols
    Interviewee.create(interviewee_data, function (err, interviewee) {
        if (err) {
            if (err.toString().indexOf('E11000') > -1) {
                err = new Error('Duplicate email and phone number combination');
            }

            return generalResponse.respondError(res, err);
        } else {
            res.send(interviewee);
        }
    });
};

exports.updateInterviewee = function (req, res) {
    Interviewee.findOne({_id: req.body._id}).exec(function (err, interviewee) {
        if (err) {
            return generalResponse.respondError(res, err);
        }

        ['firstName', 'lastName', 'email', 'phone', 'role', 'title', 'salutation', 'answers', 'users', 'questions',
            'organization', 'assessments'].forEach(function(field) {
            interviewee[field] = req.body[field];
        });

        interviewee.modified.push({modifiedBy: req.user._id});

        interviewee.save(function (err) {
            res.send(err ? {reason: err.toString()} : undefined);
        });
    });
};

exports.deleteInterviewee = function (req, res) {
    Interviewee.remove({_id: req.params.id}, function (err) {
        res.send(err ? {reason: err.toString()} : {});
    });
};

exports.parseCriterion = function(req, res, next) {
    req.query.answer_ID = {$in: req.params.answers.split(',')};
    next();
};
