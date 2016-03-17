'use strict';

var auth                    = require('./auth'),
    answers                 = require('../controllers/answers'),
    assessments             = require('../controllers/assessments'),
    authLogs                = require('../controllers/auth-logs'),
    contact                 = require('../utilities/contact'),
    countries               = require('../controllers/countries'),
    documents               = require('../controllers/documents'),
    interviewees            = require('../controllers/interviewees'),
    questions               = require('../controllers/questions'),
    resources               = require('../controllers/resources'),
    response                = require('../controllers/general-response'),
    multipartMiddleware     = require('connect-multiparty')(),
    resetPasswordTokens     = require('../controllers/reset-password-tokens'),
    users                   = require('../controllers/users');

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

    // USER AUTH LOGS
    app.get('/api/auth-logs/number/:user', auth.requiresRole('supervisor'),  authLogs.getNumber);
    app.get('/api/auth-logs/recent/:user/:action', auth.requiresRole('supervisor'), authLogs.getMostRecent);
    app.get('/api/auth-logs/list/:user/:itemsPerPage/:page', auth.requiresRole('supervisor'),  authLogs.list);

    // PASSWORD TOKEN HANDLING
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
    app.put('/api/answers/:answer_ID', auth.requiresApiLogin, answers.updateAnswer, assessments.updateModificationDate, response.submit);

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
    //// DOCUMENTS  /////////
    /////////////////////////
    // GET
    app.get('/api/documents', auth.requiresApiLogin, documents.getDocuments);
    app.get('/api/documents/:id', auth.requiresApiLogin, documents.getDocumentsByID);

    // // POST
    // app.post('/api/documents', auth.requiresApiLogin, documents.createDocuments);

    // PUT
    app.put('/api/documents', auth.requiresApiLogin, documents.updateDocument);

    //////////////////////////
    //// CONTENT RESOURCES ///
    //////////////////////////
    // GET
    app.get('/api/resources', auth.requiresApiLogin, resources.getResources);
    app.get('/api/resources/:id', auth.requiresApiLogin, resources.getResourcesByID);

    // POST
    app.post('/api/resources', auth.requiresRole('supervisor'), resources.createResource);

    // PUT
    app.put('/api/resources', auth.requiresRole('supervisor'), resources.updateResource);

    // DELETE
    app.delete('/api/resources/:id', auth.requiresRole('supervisor'), resources.deleteResource);

    /////////////////////////
    //// UPLOAD DOCUMENTS ///
    /////////////////////////

    app.post('/file-upload', auth.requiresApiLogin,  multipartMiddleware, documents.fileCheck);
    app.get('/api/snapshot-upload', auth.requiresApiLogin,  documents.uploadUrlSnapshot);
    app.get('/api/remote-file-upload', auth.requiresApiLogin,  documents.uploadRemoteFile);
    app.get('/api/remote-file/upload-progress/:statusId', auth.requiresApiLogin,  documents.getRemoteFileUploadStatus);
    app.get('/api/remote-file/document/:statusId', auth.requiresApiLogin,  documents.getUploadStatusDocument);

    //////////////////////////
    ///// INTERVIEWEE CRUD ///
    //////////////////////////
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

    app.post('/logout', auth.logout);

    app.all('/api/*', function (req, res) {
        res.sendStatus(404);
    });

    app.get('*', function (req, res) {
        res.render('index', {
            bootstrappedUser: req.user
        });
    });
};
