var User 		= require('mongoose').model('User'),
	encrypt 	= require('../utilities/encryption');

exports.getUsers = function(req, res) {
	// console.log(req.query);
	if(req.user.hasRole('supervisor')) {
		var query = User.find(req.query);
	}else{
		var query = User.find(req.query).select({ "firstName": 1,"lastName":1});
	}
	query.exec(function(err, collection) {
		res.send(collection);
	})

};

exports.getUsersByID = function(req, res) {
	User.findOne({_id:req.params.id}).exec(function(err, user) {
		res.send(user);
	});
};

exports.getUsersListByID = function(req, res) {
	var query = User.find({}).select({ "firstName": 1,"lastName":1, "email":1});
	User.findOne({_id:req.params.id}).exec(function(err, user) {
		res.send(user);
	});
};

// exports.getUsersByRoles = function(req, res) {
// 	User.find({roles:{"$in": [req.params.role]}}).exec(function(err, user) {
// 		res.send(user);
// 	});
// };

exports.createUser = function(req, res, next) {
	var userData = req.body;
	userData.username = userData.username.toLowerCase();
	userData.salt = encrypt.createSalt();
	userData.hashed_pwd = encrypt.hashPwd(userData.salt, userData.password);
	userData.createdBy = req.user._id;

	User.create(userData, function(err, user) {
		if(err){
			if(err.toString().indexOf('E11000') > -1) {
				err = new Error('Duplicate Username');
			}
			res.status(400)
			return res.send({reason:err.toString()})
		}
	});
	res.send();
};

exports.updateUser = function(req, res) {
	var userUpdates = req.body;

	if(!req.user.hasRole('supervisor')) {
		res.status(404);
		return res.end();
	}
	if(userUpdates.password && userUpdates.password.length > 0) {
		userUpdates.salt = encrypt.createSalt();
		userUpdates.hashed_pwd = encrypt.hashPwd(req.user.salt, userUpdates.password);
	}

	User.findOne({_id:req.body._id}).exec(function(err, user) {
		if(err) {
			res.status(400);
			return res.send({ reason: err.toString() });
		}
		user.firstName = userUpdates.firstName;
		user.lastName = userUpdates.lastName;
		user.email = userUpdates.email;
		user.salt = userUpdates.salt;
		user.hashed_pwd = userUpdates.hashed_pwd;
		user.language = userUpdates.language;
		user.assessments = userUpdates.assessments;
		if(user.modified) {
			user.modified.push({modifiedBy: req.user._id});
		}else{
			user.modified = {modifiedBy: req.user._id};
		}
		// user.address = userUpdates.address;
		user.save(function(err) {
			if(err)
				return res.send({ reason: err.toString() });
		})
	});
	res.send();
};

exports.deleteUser = function(req, res) {
	// res.send()
	console.log(req.body);
	// User.remove({
	// 	_id: req.body
	// }, function(err, user) {
	// 	if(err)
	// 		return res.send({ reason: err.toString() });
	// 	res.send();
	// });
	// var userData = req.body;

	// return User.remove(userData, function(err, user) {
	// 	if(err) {
	// 		return res.send({reason:err.toString()})
	// 	}
	// });
	
	// userData.username = userData.username.toLowerCase();
	// userData.salt = encrypt.createSalt();
	// userData.hashed_pwd = encrypt.hashPwd(userData.salt, userData.password);
	// User.create(userData, function(err, user) {
	// 	if(err){
	// 		if(err.toString().indexOf('E11000') > -1) {
	// 			err = new Error('Duplicate Username');
	// 		}
	// 		res.status(400)
	// 		return res.send({reason:err.toString()})
	// 	}
	// })
};