'use strict';

var Country = require('mongoose').model('Country');

var getCountrySet = function(methodName, criteria, errorMessage, res, next) {
    Country[methodName](criteria).exec(function (err, countrySet) {
        if (err) {
            return next(err);
        }
        if (!countrySet) {
            return next(new Error(errorMessage));
        }
        res.send(countrySet);
    });
};

exports.getCountries = function (req, res, next) {
    getCountrySet('find', req.query, 'No countries found', res, next);
};

exports.getCountryByID = function (req, res, next) {
    getCountrySet('findOne', {country_ID: req.params.country_ID}, 'No country found', res, next);
};
