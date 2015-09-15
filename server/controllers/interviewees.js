'use strict';
/* global require */

var Interviewee = require('mongoose').model('Interviewee');

exports.getInterviewees = function (req, res, next) {
    var query = Interviewee.find(req.query);

    query.exec(function (err, interviewees) {
        if (err) { return next(err); }
        if (!interviewees) { return next(new Error('No interviewees found')); }
        res.send(interviewees);
    });
};

exports.getIntervieweesByID = function (req, res, next) {
    var query = Interviewee.findOne({_id: req.params.id});

    query.exec(function (err, interviewee) {
        if (err) { return next(err); }
        if (!interviewee) { return next(new Error('No interviewee found')); }
        res.send(interviewee);
    });
};
//noinspection JSUnusedLocalSymbols
exports.createInterviewee = function (req, res, next) {
    var interviewee_data = req.body;

    interviewee_data.createdBy = req.user._id;

    //noinspection JSUnusedLocalSymbols
    Interviewee.create(interviewee_data, function (err, interviewee) {
        if (err) {
            res.status(400);
            return res.send({reason: err.toString()});
        }
    });
    res.send();
};

exports.updateInterviewee = function (req, res) {
    var interviewee_updates = req.body,
        query = Interviewee.findOne({_id: req.body._id});
    console.log(req.body);

    query.exec(function (err, interviewee) {
        if (err) {
            res.status(400);
            return res.send({reason: err.toString()});
        }
        interviewee.firstName = interviewee_updates.firstName;
        interviewee.lastName = interviewee_updates.lastName;
        interviewee.email = interviewee_updates.email;
        interviewee.phone = interviewee_updates.phone;
        interviewee.role = interviewee_updates.role;
        interviewee.title = interviewee_updates.title;
        interviewee.organization = interviewee_updates.organization;
        interviewee.assessments = interviewee_updates.assessments;
        interviewee.answers = interviewee_updates.answers;
        interviewee.modified.push({modifiedBy: req.user._id});

        interviewee.save(function (err) {
            if (err) {
                return res.send({reason: err.toString()});
            }
        });
    });
    res.send();
};

exports.deleteInterviewee = function (req, res) {

    // Interviewee.remove({_id: req.params.id}, function (err) {
    //     if (!err) {
    //         res.send();
    //     } else {
    //         return res.send({ reason: err.toString() });
    //     }
    // });
    // res.send();
};
