var path 		= require('path');
var rootPath 	= path.normalize(__dirname + '/../../');

module.exports 	= {
	development: {
		rootPath: rootPath
	},
	production: {
		rootPath: rootPath
	}
}