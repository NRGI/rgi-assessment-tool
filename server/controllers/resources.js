'use strict';
/* global require */

var Resource = require('mongoose').model('Resource');
var generalResponse = require('./general-response');

exports.getResources = function (req, res) {
    Resource.find(req.query).sort('order').exec(function (err, resources) {
        res.send(err ? {reason: err.toString()} : resources);
    });
};

exports.getResourceByID = function (req, res) {
    Resource.findOne({_id: req.params.id}).exec(function (err, resource) {
        res.send(err ? {reason: err.toString()} : resource);
    });
};

exports.createResource = function (req, res) {
    //noinspection JSUnusedLocalSymbols
    Resource.create(req.body, function (err, resource) {
        if (err) {
            if (err.toString().indexOf('E11000') > -1) {
                err = new Error('Duplicate email');
            }

            return generalResponse.respondError(res, err);
        } else {
            res.send();
        }
    });
};

exports.updateResource = function (req, res) {
    if (!req.user.hasRole('supervisor')) {
        return generalResponse.respondStatus(res, 404);
    }

    Resource.findOne({_id: req.body._id}).exec(function (err, resource) {
        if (err) {
            return generalResponse.respondError(res, err);
        }

        ['head', 'body', 'order'].forEach(function(field) {
            resource[field] = req.body[field];
        });

        resource.save(function (err) {
            return err ? generalResponse.respondError(res, err) : res.send();
        });
    });
};

exports.deleteResource = function (req, res) {
    if (!req.user.hasRole('supervisor')) {
        return generalResponse.respondStatus(res, 404);
    }

    Resource.remove({_id: req.params.id}, function (err) {
        res.send(err ? {reason: err.toString()} : undefined);
    });
};
