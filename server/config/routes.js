var auth 		= require('./auth'),
	users 		= require('../controllers/users'),
	questions 	= require('../controllers/questions'),
	mongoose 	= require('mongoose'),
	User 		= mongoose.model('User');

module.exports	= function(app) {
	app.get('/api/users', auth.requiresRole('supervisor'), users.getUsers);
	app.post('/api/users', users.createUser);
	app.put('/api/users', users.updateUser);

	app.get('/api/questions', questions.getQuestions);

	app.get('/partials/*', function(req, res) {
		res.render('../../public/app/' + req.params[0]);
	});

	app.post('/login', auth.authenticate);

	app.post('/logout', function(req, res) {
		req.logout();
		res.end();
	});

	app.all('/api/*', function(req, res) {
		res.send(404);
	});

	app.get('*', function(req, res) {
		res.render('index', {
			bootstrappedUser: req.user
		});
	});
}