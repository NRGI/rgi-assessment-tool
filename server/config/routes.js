var auth 		= require('./auth'),
	users 	= require('../controllers/users'),
	mongoose 	= require('mongoose'),
	User 		= mongoose.model('User');

module.exports	= function(app) {
	app.get('/api/users', auth.requiresRole('supervisor'), users.getUsers);
	app.post('/api/users', users.createUser);

	app.get('/api/questions', function(req, res) {
		Question.find({}).exec(function(err, question) {
			res.send(question)
		})
	});

	app.get('/partials/*', function(req, res) {
		res.render('../../public/app/' + req.params[0]);
	});

	app.post('/login', auth.authenticate);

	app.post('/logout', function(req, res) {
		req.logout();
		res.end();
	});

	app.get('*', function(req, res) {
		res.render('index', {
			bootstrappedUser: req.user
		});
	});
}