'use strict';

var Country = require('mongoose').model('Country');

var getCountrySet = function(methodName, criteria, errorMessage, res) {
    Country[methodName](criteria).exec(function (err, countrySet) {
        if (!err && !countrySet) {
            err = new Error(errorMessage);
        }

        res.send(err ? {reason: err.toString()} : countrySet);
    });
};

exports.getCountries = function (req, res) {
    getCountrySet('find', req.query, 'No countries found', res);
};

exports.getCountryByID = function (req, res) {
    getCountrySet('findOne', {country_ID: req.params.country_ID}, 'No country found', res);
};
