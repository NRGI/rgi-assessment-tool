'use strict';
/* global require */

var Resource = require('mongoose').model('Resource');

exports.getResources = function (req, res) {
    Resource.find(req.query)
        .sort('order')
        .exec(function (err, resources) {
            res.send(resources);
        });
};

exports.getResourceByID = function (req, res) {
    Resource.findOne({_id: req.params.id}).exec(function (err, resource) {
        res.send(resource);
    });
};

exports.createResource = function (req, res, next) {
    var resource_data = req.body;

    //noinspection JSUnusedLocalSymbols
    Resource.create(resource_data, function (err, resource) {
        if (err) {
            if (err.toString().indexOf('E11000') > -1) {
                err = new Error('Duplicate email');
            }
            res.status(400);
            return res.send({reason: err.toString()});
        } else {
            res.send();
        }
    });
};

//exports.createQuestions = function (req, res, next) {
//    var new_questions = req.body;
//
//    function createNewQuestion (new_question) {
//        Question.create(new_question, function (err, question) {
//            if (err) {
//                res.status(400);
//                return res.send({reason: err.toString()});
//            }
//        });
//    }
//
//    for (var i = 0; i < new_questions.length; i += 1) {
//        createNewQuestion(new_questions[i]);
//    }
//    res.send();
//};


exports.updateResource = function (req, res) {
    var resource_update = req.body;

    if (!req.user.hasRole('supervisor')) {
        res.status(404);
        return res.end();
    }

    Resource.findOne({_id: resource_update._id}).exec(function (err, resource) {
        if (err) {
            res.status(400);
            return res.send({ reason: err.toString() });
        }
        resource.head = resource_update.head;
        resource.body = resource_update.body;
        resource.order = resource_update.order;

        resource.save(function (err) {
            if (err) {
                res.status(400);
                res.send({reason: err.toString()});
            }
        });
    });
    res.send();
};

exports.deleteResource = function (req, res) {
    if (!req.user.hasRole('supervisor')) {
        res.status(404);
        return res.end();
    }
    Resource.remove({_id: req.params.id}, function (err) {
        if (!err) {
            res.send();
        } else {
            return res.send({ reason: err.toString() });
        }
    });
    res.send();
};
