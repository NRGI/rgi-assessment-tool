var auth 		= require('./auth'),
	users 		= require('../controllers/users'),
	answers 	= require('../controllers/answers'),
	questions 	= require('../controllers/questions'),
	assessments = require('../controllers/assessments'),
	mongoose 	= require('mongoose');
	// User 		= mongoose.model('User');

module.exports	= function(app) {
	////////////////////
	///// USERS ////////
	////////////////////
	// get all users
	app.get('/api/users', auth.requiresApiLogin, users.getUsers);
	// post new user to db
	app.post('/api/users', auth.requiresRole('supervisor'), users.createUser);

	// get singele user by id
	app.get('/api/users/:id', auth.requiresRole('supervisor'), users.getUsersByID);
	// get single user by id with limited parameters
	app.get('/api/user-list/:id', users.getUsersListByID);
	// get single user by role
	app.get('/api/user-roles/:role', auth.requiresRole('supervisor'), users.getUsersByRoles);

	// update user
	app.put('/api/users', auth.requiresRole('supervisor'), users.updateUser);
	// delete user
	app.delete('/api/users', auth.requiresRole('supervisor'), users.deleteUser);
	// app.delete('/api/users', auth.requiresRole('supervisor'), users.deleteUser);

	////////////////////////
	///// QUESTIONS ////////
	////////////////////////
	app.get('/api/questions', questions.getQuestions);
	app.get('/api/questions/:id', questions.getQuestionsByID);
	// update question
	app.put('/api/questions', auth.requiresRole('supervisor'), questions.updateQuestion);

	/////////////////////////////////
	///// ASSESSMENT ANSWERS ////////
	/////////////////////////////////
	app.get('/api/answers', auth.requiresApiLogin, answers.getAnswers);
	// app.get('/api/answers/:answer_ID', auth.requiresApiLogin, assessments.getAnswersByID);
	// app.get('/api/answers/:answer_ID', auth.requiresApiLogin, assessments.getAnswersByID);
	
	//////////////////////////////////
	///// ASSESSMENT OVERVIEW ////////
	//////////////////////////////////
	app.get('/api/assessments', auth.requiresApiLogin, assessments.getAssessments);
	app.get('/api/assessments/:assessment_ID', auth.requiresApiLogin, assessments.getAssessmentsByID);

	////////////////////
	///// OTHER ////////
	////////////////////
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