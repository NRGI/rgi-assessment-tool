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
        spies.next = sinon.spy();
    });

    describe('#getCountries', function() {
        var QUERY = 'query';

        it('submits the error for further processing if an error occurs', function() {
            var ERROR = 'error';
            initialize('find', 'countryFind', ERROR);
            countriesModule.getCountries({query: QUERY}, undefined, spies.next);
            expect(spies.next.withArgs(ERROR).called).to.equal(true);
        });

        it('submits a special error for further processing if no contries found', function() {
            initialize('find', 'countryFind', null, false);
            countriesModule.getCountries({query: QUERY}, undefined, spies.next);
            expect(spies.next.withArgs(new Error('No countries found')).called).to.equal(true);
        });

        it('submits a special error for further processing if no contries found', function() {
            var COUNTRIES = 'countries';
            initialize('find', 'countryFind', null, COUNTRIES);
            countriesModule.getCountries({query: QUERY}, {send: spies.next});
            expect(spies.next.withArgs(COUNTRIES).called).to.equal(true);
        });

        afterEach(function() {
            expect(spies.countryFind.withArgs(QUERY).called).to.equal(true);
        });
    });

    describe('#getCountriesByID', function() {
        var COUNTRY_ID = 'country id';

        it('submits the error for further processing if an error occurs', function() {
            var ERROR = 'error';
            initialize('findOne', 'countryFindOne', ERROR);
            countriesModule.getCountriesByID({params: {country_ID: COUNTRY_ID}}, undefined, spies.next);
            expect(spies.next.withArgs(ERROR).called).to.equal(true);
        });

        it('submits a special error for further processing if no contries found', function() {
            initialize('findOne', 'countryFindOne', null, false);
            countriesModule.getCountriesByID({params: {country_ID: COUNTRY_ID}}, undefined, spies.next);
            expect(spies.next.withArgs(new Error('No country found')).called).to.equal(true);
        });

        it('submits a special error for further processing if no contries found', function() {
            var COUNTRIES = 'countries';
            initialize('findOne', 'countryFindOne', null, COUNTRIES);
            countriesModule.getCountriesByID({params: {country_ID: COUNTRY_ID}}, {send: spies.next});
            expect(spies.next.withArgs(COUNTRIES).called).to.equal(true);
        });

        afterEach(function() {
            expect(spies.countryFindOne.withArgs({country_ID: COUNTRY_ID}).called).to.equal(true);
        });
    });
});
