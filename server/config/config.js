var path 		= require('path');
var rootPath 	= path.normalize(__dirname + '/../../');

module.exports 	= {
	development: {
		db: 'mongodb://localhost/rgi2015_test',
		rootPath: rootPath,
		port: process.env.PORT || 3030
	},
	production: {
		db: 'mongodb://localhost/rgi2015',
		rootPath: rootPath,
		port: process.env.PORT || 80
	}
}