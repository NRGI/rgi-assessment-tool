'use strict';

var auth = require('./auth'),
    authMendeley = require('./authMendeley'),
    bodyParser = require('body-parser'),
    users = require('../controllers/users'),
    mendeley = require('../controllers/mendeley.js'),
    answers = require('../controllers/answers'),
    questions = require('../controllers/questions'),
    assessments = require('../controllers/assessments'),
    multipart = require('connect-multiparty'),
    multipartMiddleware = multipart();

module.exports = function (app) {

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

    // POST
    app.post('/api/questions', auth.requiresRole('supervisor'), questions.createQuestions);

    // PUT
    app.put('/api/questions', questions.updateQuestion);

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

    // PUT
    app.put('/api/answers/:answer_ID', answers.updateAnswer);

    ///////////////////////////////////////
    ///// ASSESSMENT OVERVIEW CRUD/////////
    ///////////////////////////////////////
    // GET
    app.get('/api/assessments', auth.requiresApiLogin, assessments.getAssessments);
    app.get('/api/assessments/:assessment_ID', auth.requiresApiLogin, assessments.getAssessmentsByID);

    // POST
    app.post('/api/assessments', auth.requiresRole('supervisor'), assessments.createAssessments);

    // PUT
    app.put('/api/assessments/:assessment_ID', auth.requiresApiLogin, assessments.updateAssessment);

    /////////////////////////
    //// DOCUMNETS  /////////
    /////////////////////////
    // GET
    // POST
    // PUT


    /////////////////////////
    //// UPLOAD DOCUMENTS ///
    /////////////////////////

    app.post('/file-upload', multipartMiddleware, mendeley.fileUpload);

    ////////////////////
    ///// OTHER ////////
    ////////////////////
    app.get('/partials/*', function (req, res) {
        res.render('../../public/app/' + req.params[0]);
    });

    app.post('/login', auth.authenticate, mendeley.tokenExist, mendeley.validateToken, authMendeley.getToken, mendeley.createToken, 
        authMendeley.getToken, mendeley.updateToken, auth.passUser);

    app.post('/logout', function (req, res) {
        req.logout();
        res.end();
    });

    app.all('/api/*', function (req, res) {
        res.sendStatus(404);
    });

    app.get('*', function (req, res) {
        res.render('index', {
            bootstrappedUser: req.user
        });
    });
};