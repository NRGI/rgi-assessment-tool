var auth 		= require('./auth'),
	users 		= require('../controllers/users'),
	answers 	= require('../controllers/answers'),
	questions 	= require('../controllers/questions'),
	assessments = require('../controllers/assessments'),
	mongoose 	= require('mongoose'),
	User 		= mongoose.model('User');

module.exports	= function(app) {
	/////RESTRICT RETURN FIELDS ////////
	app.get('/api/users', auth.requiresApiLogin, users.getUsers);
	app.get('/api/users/:id', auth.requiresRole('supervisor'), users.getUsersByID);
	app.get('/api/user-list/:id', users.getUsersListByID);
	app.get('/api/user-roles/:role', auth.requiresRole('supervisor'), users.getUsersByRoles);
	app.post('/api/users', auth.requiresRole('supervisor'), users.createUser);
	app.put('/api/users', users.updateUser);


	app.get('/api/questions', questions.getQuestions);
	app.get('/api/questions/:id', questions.getQuestionsByID);

	app.get('/api/answers', auth.requiresApiLogin, answers.getAnswers);
	// app.get('/api/answers/:answer_ID', auth.requiresApiLogin, assessments.getAnswersByID);
	// app.get('/api/answers/:answer_ID', auth.requiresApiLogin, assessments.getAnswersByID);

	app.get('/api/assessments', auth.requiresApiLogin, assessments.getAssessments);
	app.get('/api/assessments/:assessment_ID', auth.requiresApiLogin, assessments.getAssessmentsByID);

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
};