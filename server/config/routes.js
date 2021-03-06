'use strict';

var auth                    = require('./auth'),
    answers                 = require('../controllers/answers'),
    assessments             = require('../controllers/assessments'),
    authLogs                = require('../controllers/auth-logs'),
    contact                 = require('../utilities/contact'),
    countries               = require('../controllers/countries'),
    documents               = require('../controllers/documents'),
    interviewees            = require('../controllers/interviewees'),
    precepts                = require('../controllers/precepts'),
    questions               = require('../controllers/questions'),
    resources               = require('../controllers/resources'),
    response                = require('../utilities/general-response'),
    multipartMiddleware     = require('connect-multiparty')(),
    resetPasswordTokens     = require('../controllers/reset-password-tokens'),
    users                   = require('../controllers/users');

module.exports = function (app) {

    /////////////////////////
    ///// USERS CRUD ////////
    /////////////////////////
    app.get('/api/users', auth.requiresApiLogin, users.getUsers);
    app.get('/api/users/:id', auth.requiresRole('supervisor'), users.getUserByID);
    app.post('/api/users', auth.requiresRole('supervisor'), users.createUser);
    app.put('/api/users', auth.requiresApiLogin, users.updateUser);
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
    app.get('/api/questions', auth.requiresApiLogin, questions.getQuestions);
    app.get('/api/questions/:id', auth.requiresApiLogin, questions.getQuestionByID);
    app.post('/api/questions', auth.requiresRole('supervisor'), questions.createQuestions);
    app.put('/api/questions', auth.requiresApiLogin, questions.updateQuestion);
    app.delete('/api/questions/:id', auth.requiresRole('supervisor'), questions.deleteQuestion);

    //////////////////////////////////////
    ///// ASSESSMENT ANSWERS CRUD ////////
    //////////////////////////////////////
    app.get('/api/answers/final-score/:assessment_ID', answers.setFinalScore);
    app.get('/api/answers', auth.requiresApiLogin, answers.getAnswers);
    app.get('/api/answers/:answer_ID', auth.requiresApiLogin, answers.getAnswersByID);
    app.post('/api/answers', auth.requiresApiLogin, answers.createAnswers);
    app.put('/api/answers/:answer_ID', auth.requiresApiLogin, answers.updateAnswer, assessments.updateModificationDate, response.submit);

    ///////////////////////////////////////
    ///// ASSESSMENT OVERVIEW CRUD/////////
    ///////////////////////////////////////
    app.get('/api/assessments', auth.requiresApiLogin, assessments.getAssessments);
    app.get('/api/assessments/:assessment_ID', auth.requiresApiLogin, assessments.getAssessmentsByID);
    app.post('/api/assessments', auth.requiresRole('supervisor'), assessments.createAssessments);
    app.put('/api/assessments/:assessment_ID', auth.requiresApiLogin, assessments.updateAssessment);
    app.delete('/api/assessments/:assessment_ID', /*auth.requiresRole('supervisor'),*/ assessments.unlinkAssessment);

    /////////////////////////
    //// DOCUMENTS  /////////
    /////////////////////////
    app.get('/api/documents/:limit/:skip', auth.requiresApiLogin, documents.getDocuments);
    app.get('/api/documents/:id', auth.requiresApiLogin, documents.getDocumentsByID);
    app.put('/api/documents', auth.requiresApiLogin, documents.updateDocument);
    app.delete('/api/documents/:id', auth.requiresRole('supervisor'), documents.deleteDocument);
    //UNLINK DOCUMENT
    app.delete('/api/unlink-document/:id', auth.requiresRole('supervisor'), documents.unlinkDocument);

    /////////////////////////
    //// UPLOAD DOCUMENTS ///
    /////////////////////////
    app.post('/file-upload', auth.requiresApiLogin,  multipartMiddleware, documents.fileCheck);
    app.get('/api/remote-file-upload', auth.requiresApiLogin,  documents.uploadRemoteFile);
    app.get('/api/remote-file/upload-progress/:statusId', auth.requiresApiLogin,  documents.getRemoteFileUploadStatus);
    app.get('/api/remote-file/document/:statusId', auth.requiresApiLogin,  documents.getUploadStatusDocument);

    //////////////////////////
    //// CONTENT RESOURCES ///
    //////////////////////////
    app.get('/api/resources', auth.requiresApiLogin, resources.getResources);
    app.get('/api/resources/:id', auth.requiresApiLogin, resources.getResourceByID);
    app.post('/api/resources', auth.requiresRole('supervisor'), resources.createResource);
    app.put('/api/resources', auth.requiresRole('supervisor'), resources.updateResource);
    app.delete('/api/resources/:id', auth.requiresRole('supervisor'), resources.deleteResource);

    //////////////////////////
    ///// INTERVIEWEE CRUD ///
    //////////////////////////
    app.get('/api/interviewees', auth.requiresApiLogin, interviewees.getInterviewees);
    app.get('/api/interviewees/:id', auth.requiresApiLogin, interviewees.getIntervieweeByID);
    app.get('/api/interviewee-answers/:answers', auth.requiresApiLogin, interviewees.parseCriterion, answers.getAnswers);
    app.post('/api/interviewees', auth.requiresApiLogin, interviewees.createInterviewee);
    app.put('/api/interviewees', auth.requiresApiLogin, interviewees.updateInterviewee);
    app.delete('/api/interviewees/:id', auth.requiresRole('supervisor'), interviewees.deleteInterviewee);

    ////////////////////
    ///// OTHER ////////
    ////////////////////
    app.get('/partials/*', function (req, res) {
        res.render('../../public/app/' + req.params[0]);
    });
    // GET COUNTRY
    app.get('/api/countries', countries.getCountries);
    app.get('/api/countries/:country_ID', countries.getCountryByID);

    // PUBLIC API
    app.get('/api/public/assessments', assessments.list);
    app.get('/api/public/answers/:assessment_ID', answers.listPublicData);
    app.get('/api/public/documents/:assessment_ID', documents.listPublicData);
    app.get('/api/public/precepts', precepts.list);

    //GET RAW DATA
    app.get('/api/raw_answers/:limit/:skip/:country', assessments.setNonDeletedAssessmentCriteria, answers.getAnswersPortion, answers.getExportedAnswersData);
    app.get('/api/raw_answers/:limit/:skip', assessments.setNonDeletedAssessmentCriteria, answers.getAnswersPortion, answers.getExportedAnswersData);
    app.get('/api/raw-questions/:limit/:skip', questions.getQuestionsPortion, questions.getExportedQuestionsData);

    // Send tech contact
    app.post('/contact_tech', contact.techSend);

    app.post('/login', auth.authenticate);
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
