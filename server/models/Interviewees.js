'use strict';

var mongoose = require('mongoose');

var ObjectId = mongoose.Schema.Types.ObjectId;

var modificationSchema = new mongoose.Schema({
    modifiedBy: ObjectId,
    modifiedDate: {type: Date, default: Date.now}
});

var intervieweeSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: '{PATH} is required!'},
    lastName: {
        type: String,
        required: '{PATH} is required!'},
    email: {
        type: String,
        required: '{PATH} is required!',
        unique: true
    },
    phone: String,
    role: {
        type: String,
        required: '{PATH} is required!'}, // gov, industry, CSO, expert or other
    title: String,
    salutation: String,
    organization: String,
    //tool mapping
    assessments: [String],
    questions: [ObjectId],
    answers: [String],
    users: [ObjectId],
    createdBy: ObjectId,
    creationDate: {
        type: Date,
        default: Date.now},
    modified: [modificationSchema]
});

var Interviewee = mongoose.model('Interviewee', intervieweeSchema);

function createDefaultInterviewees() {
    Interviewee.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            Interviewee.create({
                firstName: "Steve",
                lastName: "Jobs",
                email: "sj@gmail.com",
                phone: "666-666-6666",
                role: "government", // gov, industry, CSO, expert or other
                assessments: ["AF-2015-PI"],
                questions: [],
                answers: [],
                users: [],
                creationDate: Date.now()
            });
            Interviewee.create({
                firstName: "Fred",
                lastName: "Flinstone",
                email: "ff@gmail.com",
                phone: "666-666-6666",
                role: "industry", // gov, industry, CSO, expert or other
                assessments: ["AF-2015-PI"],
                questions: [],
                answers: [],
                users: [],
                creationDate: Date.now()
            });
            Interviewee.create({
                firstName: "Jack",
                lastName: "Jill",
                email: "jj@gmail.com",
                phone: "666-666-6666",
                role: "cso", // gov, industry, CSO, expert or other
                assessments: ["AF-2015-PI"],
                questions: [],
                answers: [],
                users: [],
                creationDate: Date.now()
            });
            Interviewee.create({
                firstName: "Foo",
                lastName: "Bar",
                email: "fb@gmail.com",
                phone: "666-666-6666",
                role: "expert", // gov, industry, CSO, expert or other
                assessments: ["AF-2015-PI"],
                questions: [],
                answers: [],
                users: [],
                creationDate: Date.now()
            });
            Interviewee.create({
                firstName: "Seven",
                lastName: "Up",
                email: "su@gmail.com",
                phone: "666-666-6666",
                role: "other", // gov, industry, CSO, expert or other
                assessments: ["AF-2015-PI"],
                questions: [],
                answers: [],
                users: [],
                creationDate: Date.now()
            });
        }
    });
}

exports.createDefaultInterviewees = createDefaultInterviewees;