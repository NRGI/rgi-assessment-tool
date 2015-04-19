var MendeleyToken = require('mongoose').model('MendeleyToken');

exports.tokenExist = function(req, res, next) {
    MendeleyToken.findOne({clientId: req.clientId}).exec(function(err, token) {
        if(err) {
            console.log('Error while finding access token: ', err);
        }
        if(token) {
            console.log('Token Exist');
            req.token = token;
            req.mendeleyTokenExist = true;
        }
        else {
            console.log('Token is not exist');
            req.token = null;
            req.mendeleyTokenExist = false;
        }
        
        req.validMendeleyToken = false;

        next();
    });
};

exports.validateToken = function(req, res, next) {
    if(req.mendeleyTokenExist == true && req.validMendeleyToken == false) {
        var created_time = new Date(req.token['creationDate']);
        var cur_time = new Date();
        var passed_time = cur_time.getTime() - created_time.getTime();
        if((Math.floor(passed_time) / 1000) >= req.token['expires_in']) {
            req.validMendeleyToken = false;
        }
        else {
            req.validMendeleyToken = true;
        }
    }

    next();
};

exports.createToken = function(req, res, next) {
    if(req.mendeleyTokenExist == false && req.token != null) {
        var token = {
            'access_token' : req.token.access_token,
            'clientId' : req.clientId,
            'clientSecret' : req.clientSecret,
            'expires_in' : req.token.expires_in
        };

        MendeleyToken.create(token, function(err, token) {
            if(!err) {
                req.token = token;
                req.mendeleyTokenExist = true;
                req.validMendeleyToken = true;
            }
            next();
        });
    }
    else {
        console.log('Token already exist');
        next();
    }
};

exports.updateToken = function(req, res, next) {
    if(req.mendeleyTokenExist == true && req.validMendeleyToken == false) {
        MendeleyToken.findOne({clientId: req.clientId}).exec(function(err, token) {
            if(err) {
                req.validMendeleyToken = false;
            }
            else {
                token.access_token = req.token.access_token;
                token.expires_in = req.token.expires_in;
                token.clientSecret = req.clientSecret;
                token.save(function(err) {
                    if(err) {
                        req.validMendeleyToken = false;
                    }
                    else {
                        req.validMendeleyToken = true;
                    }
                })
            }

            next();
        });
    }
    else {
        next();
    }
};

exports.deleteToken = function(req, res) {
    User.remove({clientId: req.clientId}, function(err) {
        if(!err) {
            res.send();
        }
        else {
            res.status(500);
            return res.send({reason: erro.toString()});
        }
    });
};