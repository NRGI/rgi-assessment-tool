var auth           = require('./auth'),
    bodyParser     = require('body-parser'),
    users          = require('../controllers/users'),
    answers        = require('../controllers/answers'),
    questions      = require('../controllers/questions'),
    assessments    = require('../controllers/assessments'),
    mendeleyConfig = require('./oauth-config'),
    cookieParser   = require('cookie-parser');
    // mongoose     = require('mongoose');
    // User         = mongoose.model('User');

module.exports = function (app) {

    /////////////////////////
    //// MENDELEY AUTH //////
    /////////////////////////
    var url = 'http://localhost';
    var accessTokenCookieName = 'accessToken';
    var refreshTokenCookieName = 'refreshToken';
    var oauthPath = '/oauth/token';
    var home = '/';
    var tokenExchangePath = '/oauth/token-exchange';
    app.use(cookieParser());

    function setCookies(res, token) {
        console.log(token);
        res.cookie(accessTokenCookieName, token.access_token, { maxAge: token.expires_in * 1000 });
        res.cookie(refreshTokenCookieName, token.refresh_token, { httpOnly: true });
    }

    app.get('/mendeleyAuth', function (req, res) {
        if (!req.cookies[accessTokenCookieName]) {
            console.log('No cookie defined, redirecting to', tokenExchangePath);
            res.redirect(tokenExchangePath);
        } else {
            console.log('Access token set, redirecting to', home);
            app.set('mendeley', 'got');
            res.redirect('/');
        }
    });

    app.get(tokenExchangePath, function (req, res, next) {
        console.log('Starting token exchange');

        var oauth2  = require('simple-oauth2');
        var token;

        var credentials = {
            clientID: 1560,
            clientSecret: 'chBcJvsqMHLoD8mF',
            site: 'https://api.mendeley.com'
        };

        // Initialize the OAuth2 Library
        var oauth = oauth2(credentials);

        oauth.client.getToken({}, function (error, result) {
            if (error) {
                console.log('Access Token Error', error.message);
            } else {
                token = oauth.accessToken.create(result);
                setCookies(res, token.token);
                console.log(res.cookie);
                res.redirect(home);
            }
        });
    });

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
    // app.get('/api/question-text/:id', questions.getQuestionTextByID);

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
    // app.get('/api/answers/:answer_ID', auth.requiresApiLogin, assessments.getAnswersByID);
    // app.get('/api/answers/:answer_ID', auth.requiresApiLogin, assessments.getAnswersByID);

    // PUT
    app.put('/api/answers/:answer_ID', answers.updateAnswer);

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
    app.get('/partials/*', function (req, res) {
        res.render('../../public/app/' + req.params[0]);
    });

    app.post('/login', auth.authenticate);

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