'use strict';

var expect = require('chai').expect,
    rewire = require('rewire'),
    sinon = require('sinon');


var utils = require('../utils');

utils.stubModel();
    var countriesModule = rewire(utils.getControllerPath('countries'));
utils.restoreModel();

describe('`countries` module', function() {
    var spies = {},
        initialize = function(methodName, spyName, error, countrySet) {
            spies[spyName] = sinon.spy(function() {
                return {exec: function(callback) {
                    callback(error, countrySet);
                }};
            });

            var AuthLog = {};
            AuthLog[methodName] = spies[spyName];
            utils.setModuleLocalVariable(countriesModule, 'Country', AuthLog);
        };

    beforeEach(function() {
        spies.responseSend = sinon.spy();
    });

    describe('#getCountries', function() {
        var QUERY = 'query';

        it('responds with the error description if an error occurs', function() {
            var ERROR = 'error';
            initialize('find', 'countryFind', ERROR);
            countriesModule.getCountries({query: QUERY}, {send: spies.responseSend});
            expect(spies.responseSend.withArgs({reason: ERROR.toString()}).called).to.equal(true);
        });

        it('responds with a special error description if no countries are found', function() {
            initialize('find', 'countryFind', null, null);
            countriesModule.getCountries({query: QUERY}, {send: spies.responseSend});
            expect(spies.responseSend.withArgs({reason: new Error('No countries found').toString()}).called)
                .to.equal(true);
        });

        it('responds with the countries data if the data  are found', function() {
            var COUNTRIES = 'countries';
            initialize('find', 'countryFind', null, COUNTRIES);
            countriesModule.getCountries({query: QUERY}, {send: spies.responseSend});
            expect(spies.responseSend.withArgs(COUNTRIES).called).to.equal(true);
        });

        afterEach(function() {
            expect(spies.countryFind.withArgs(QUERY).called).to.equal(true);
        });
    });

    describe('#getCountryByID', function() {
        var COUNTRY_ID = 'country id';

        it('responds with the error description if an error occurs', function() {
            var ERROR = 'error';
            initialize('findOne', 'countryFindOne', ERROR);
            countriesModule.getCountryByID({params: {country_ID: COUNTRY_ID}}, {send: spies.responseSend});
            expect(spies.responseSend.withArgs({reason: ERROR.toString()}).called).to.equal(true);
        });

        it('responds with a special error description if no country is found', function() {
            initialize('findOne', 'countryFindOne', null, null);
            countriesModule.getCountryByID({params: {country_ID: COUNTRY_ID}}, {send: spies.responseSend});
            expect(spies.responseSend.withArgs({reason: new Error('No country found').toString()}).called)
                .to.equal(true);
        });

        it('responds with the country data if the data are found', function() {
            var COUNTRY = 'country';
            initialize('findOne', 'countryFindOne', null, COUNTRY);
            countriesModule.getCountryByID({params: {country_ID: COUNTRY_ID}}, {send: spies.responseSend});
            expect(spies.responseSend.withArgs(COUNTRY).called).to.equal(true);
        });

        afterEach(function() {
            expect(spies.countryFindOne.withArgs({country_ID: COUNTRY_ID}).called).to.equal(true);
        });
    });
});
