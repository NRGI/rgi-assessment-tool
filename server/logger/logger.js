'use strict';

if(process.env.NODE_ENV === 'production') {
    module.exports = require('./logger.production');
} else if (process.env.NODE_ENV === 'staging') {
    module.exports = require('./logger.staging');
} else {
    module.exports = require('./logger.development');
}
