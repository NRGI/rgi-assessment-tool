'use strict';
var mongoose        = require('mongoose');
require('mongoose-html-2').loadType(mongoose);

var resourceSchema, Resource,
    Schema          = mongoose.Schema,
    //ObjectId        = mongoose.Schema.Types.ObjectId,
    Html            = mongoose.Types.Html,
    type_enu = {
        values: 'faq resources'.split(' '),
        message: 'Validator failed for `{PATH}` with value `{VALUE}`. Please select scored, context, or shadow.'
    },
    htmlSettings    = {
        type: Html,
        setting: {
            allowedTags: ['p', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li', 'del'],
            allowedAttributes: {
                'a': ['href']
            }
        }
    };

resourceSchema = new Schema({
    type: {
        type: String,
        enum: type_enu,
        required: '{PATH} is required'},
    head: {
        type: String,
        required: '{PATH} is required'},
    body: {
        type: String,
        required: '{PATH} is required'}
});

Resource = mongoose.model('Resource', resourceSchema);

function createDefaultResources() {
    Resource.find({}).exec(function (err, resources) {
        if (resources.length === 0) {
            Resource.create({
                type: 'faq',
                head: 'FAQ CONTENT 1',
                body: 'CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT '
            });
            Resource.create({
                type: 'faq',
                head: 'FAQ CONTENT 2',
                body: 'CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT '
            });
            Resource.create({
                type: 'faq',
                head: 'FAQ CONTENT 3',
                body: 'CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT '
            });
            Resource.create({
                type: 'resource',
                head: 'RESOURCE CONTENT 1',
                body: 'CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT '
            });
            Resource.create({
                type: 'resource',
                head: 'RESOURCE CONTENT 2',
                body: 'CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT '
            });
            Resource.create({
                type: 'resource',
                head: 'RESOURCE CONTENT 3',
                body: 'CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT CONENT '
            });
        }
    });
}

exports.createDefaultResources = createDefaultResources;
