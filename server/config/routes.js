var auth 		= require('./auth'),
	users 		= require('../controllers/users'),
	answers 	= require('../controllers/answers'),
	questions 	= require('../controllers/questions'),
	assessments = require('../controllers/assessments');
	// mongoose 	= require('mongoose');
	// User 		= mongoose.model('User');

module.exports	= function(app) {
	/////////////////////////
	///// USERS CRUD ////////
	/////////////////////////
	// GET
	app.get('/api/users', auth.requiresApiLogin, users.getUsers);
	app.get('/api/users/:id', auth.requiresRole('supervisor'), users.getUsersByID);
	app.get('/api/user-list/:id', users.getUsersListByID);

	// POST
	app.post('/api/users', auth.requiresApiLogin, auth.requiresRole('supervisor'), users.createUser);

	// PUT
	app.put('/api/users', users.updateUser);

	// DELETE
	app.delete('/api/users/:id', auth.requiresRole('supervisor'), users.deleteUser);

	/////////////////////////////
	///// QUESTIONS CRUD ////////
	/////////////////////////////
	// GET
	app.get('/api/questions', questions.getQuestions);
	app.get('/api/questions/:id', questions.getQuestionsByID);
	app.get('/api/question-text/:id', questions.getQuestionTextByID);
	
	// PUT
	app.put('/api/questions', auth.requiresRole('supervisor'), questions.updateQuestion);

	// DELETE
	app.delete('/api/questions/:id', auth.requiresRole('supervisor'), questions.deleteQuestion);

	//////////////////////////////////////
	///// ASSESSMENT ANSWERS CRUD ////////
	//////////////////////////////////////
	// GET
	app.get('/api/answers', auth.requiresApiLogin, answers.getAnswers);
	app.get('/api/answers/:answer_ID', auth.requiresApiLogin, answers.getAnswersByID);
	
	// POST
	app.post('/api/answers', auth.requiresApiLogin, answers.createAnswers);
	// app.get('/api/answers/:answer_ID', auth.requiresApiLogin, assessments.getAnswersByID);
	// app.get('/api/answers/:answer_ID', auth.requiresApiLogin, assessments.getAnswersByID);
	
	///////////////////////////////////////
	///// ASSESSMENT OVERVIEW CRUD/////////
	///////////////////////////////////////
	// GET
	app.get('/api/assessments', auth.requiresApiLogin, assessments.getAssessments);
	app.get('/api/assessments/:assessment_ID', auth.requiresApiLogin, assessments.getAssessmentsByID);
	
	// PUT
	app.put('/api/assessments/:assessment_ID', auth.requiresApiLogin, assessments.updateAssessment);

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
		res.sendStatus(404);
	});

	app.get('*', function(req, res) {
		res.render('index', {
			bootstrappedUser: req.user
		});
	});
};