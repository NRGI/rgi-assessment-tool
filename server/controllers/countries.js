'use strict';
/*jslint nomen: true unparam: true*/

var Country = require('mongoose').model('Country');

exports.getCountries = function (req, res, next) {
    var query = Country.find(req.query);

    query.exec(function (err, countries) {
        if (err) {
            return next(err);
        }
        if (!countries) {
            return next(new Error('No countries found'));
        }
        res.send(countries);
    });
};


exports.getCountriesByID = function (req, res, next) {
    var query = Country.findOne({country_ID: req.params.country_ID});

    query.exec(function (err, country) {
        if (err) {
            return next(err);
        }
        if (!country) {
            return next(new Error('No country found'));
        }
        res.send(country);
    });
};
