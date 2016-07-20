'use strict';

var Country = require('mongoose').model('Country');
var generalResponse = require('../utilities/general-response');

exports.getCountries = function (req, res) {
    generalResponse.getObjectSet(Country, 'find', req.query, 'No countries found', res);
};

exports.getCountryByID = function (req, res) {
    generalResponse.getObjectSet(Country, 'findOne', {country_ID: req.params.country_ID}, 'No country found', res);
};
