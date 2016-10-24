'use strict';

if(['production'].indexOf(process.env.NODE_ENV) !== -1) {
    module.exports = require('./logger.production');
} else if (['staging'].indexOf(process.env.NODE_ENV) !== -1) {
    module.exports = require('./logger.staging');
} else {
    module.exports = require('./logger.development');
}
