'use strict';

var auth = require('./auth'),
    answers = require('../controllers/answers'),
    assessments = require('../controllers/assessments'),
    questions = require('../controllers/questions'),
    users = require('../controllers/users'),
    interviewees = require('../controllers/interviewees'),
    documents = require('../controllers/documents'),
    countries = require('../controllers/countries'),
    resetPasswordTokens = require('../controllers/reset-password-tokens'),
    contact = require('../utilities/contact'),
    multipartMiddleware = require('connect-multiparty')();

module.exports = function (app) {

    /////////////////////////
    ///// USERS CRUD ////////
    /////////////////////////
    // GET
    app.get('/api/users', auth.requiresApiLogin, users.getUsers);
    app.get('/api/users/:id', auth.requiresRole('supervisor'), users.getUsersByID);
    app.get('/api/user-list/:id', auth.requiresApiLogin, users.getUsersListByID);

    // POST
    app.post('/api/users', auth.requiresRole('supervisor'), users.createUser);

    // PUT
    app.put('/api/users', auth.requiresApiLogin, users.updateUser);

    // DELETE
    app.delete('/api/users/:id', auth.requiresRole('supervisor'), users.deleteUser);

    // PASSWORD HANDLING
    app.post('/api/reset-password-token/add', resetPasswordTokens.create);
    app.post('/api/reset-password-token/reset', resetPasswordTokens.reset);

    /////////////////////////////
    ///// QUESTIONS CRUD ////////
    /////////////////////////////
    // GET
    app.get('/api/questions', auth.requiresApiLogin, questions.getQuestions);
    app.get('/api/questions/:id', auth.requiresApiLogin, questions.getQuestionsByID);

    // POST
    app.post('/api/questions', auth.requiresRole('supervisor'), questions.createQuestions);

    // PUT
    app.put('/api/questions', auth.requiresApiLogin, questions.updateQuestion);

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
    app.put('/api/answers/:answer_ID', auth.requiresApiLogin, answers.updateAnswer);

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
    app.get('/api/documents', auth.requiresApiLogin, documents.getDocuments);
    app.get('/api/documents/:id', auth.requiresApiLogin, documents.getDocumentsByID);

    // // POST
    // app.post('/api/documents', auth.requiresApiLogin, documents.createDocuments);

    // PUT
    app.put('/api/documents', auth.requiresApiLogin, documents.updateDocument);


    /////////////////////////
    //// UPLOAD DOCUMENTS ///
    /////////////////////////

    app.post('/file-upload', auth.requiresApiLogin,  multipartMiddleware, documents.fileCheck);

    /////////////////////////
    ///// INTERVIEWEE CRUD ////////
    /////////////////////////
    // GET
    app.get('/api/interviewees', auth.requiresApiLogin, interviewees.getInterviewees);
    app.get('/api/interviewees/:id', auth.requiresApiLogin, interviewees.getIntervieweesByID);

    // POST
    app.post('/api/interviewees', auth.requiresApiLogin, interviewees.createInterviewee);

    // PUT
    app.put('/api/interviewees', auth.requiresApiLogin, interviewees.updateInterviewee);

    // DELETE
    app.delete('/api/interviewees/:id', auth.requiresRole('supervisor'), interviewees.deleteInterviewee);

    ////////////////////
    ///// OTHER ////////
    ////////////////////
    app.get('/partials/*', function (req, res) {
        res.render('../../public/app/' + req.params[0]);
    });
    // GET COUNTRY
    app.get('/api/countries', countries.getCountries);
    app.get('/api/countries/:country_ID', countries.getCountriesByID);

    // Send tech contact
    app.post('/contact_tech', contact.techSend);


    app.post('/login', auth.authenticate, auth.passUser);
    //app.post('/login', auth.authenticate, mendeley.tokenExist, mendeley.validateToken, authMendeley.getToken, mendeley.createToken,
    //    authMendeley.getToken, mendeley.updateToken, auth.passUser);

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
