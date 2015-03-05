/* global MendeleySDK */
/* jshint camelcase: false */

'use strict';

var renderDocumentList = function (docs) {
    var i, j, len, jlen, doc, author, $doc,
        $list = $('.documents').find('.list').empty().removeClass('populated'),
        documentTemplate = $('#documentTemplate').html(),
        authorTemplate = $('#authorElement').html();

    for (i = 0, len = docs.length, doc; i < len; i+=1) {
        doc = docs[i];
        $doc = $(documentTemplate);
        $doc.attr('data-pos', i+1);
        $doc.attr('data-id', doc.id);
        $doc.find('.title').html(doc.title);
        if (doc.hasOwnProperty('authors')) {
            for (j = 0, jlen = doc.authors.length;  j < jlen; j += 1) {
                author = doc.authors[j];
                $doc.find('.metadata')
                    .append($(authorTemplate)
                    .html(author.first_name + ' ' + author.last_name + ' '));
            }
        }
        $doc.find('.added').html((new Date(doc.created)).toLocaleString());
        $list.append($doc);
    }
    $list.addClass('populated');
};

var renderFoldersList = function (folders) {
    var i, j, len, jlen, folder, $folder,
        $list = $('.folders').find('.list').empty().removeClass('populated'),
        documentTemplate = $('#foldersTemplate').html(),
        authorTemplate = $('#authorElement').html();

    for (i = 0, len = folders.length, folder; i < len; i+=1) {
        folder = folders[i];
        $folder = $(documentTemplate);
        $folder.attr('data-pos', i+1);
        $folder.attr('data-id', folder.id);
        $folder.find('.title').html(folder.name);
        $folder.find('.added').html((new Date(folder.created)).toLocaleString());
        $list.append($folder);
    }
    $list.addClass('populated');
};

var renderFileList = function (files) {
    var i, len, file, $file, 
        $list = $('.files').find('.list').empty().removeClass('populated'),
        fileTemplate = $('#fileTemplate').html();

    for (i = 0, len = files.length, file; i < len; i+=1) {
        file = files[i];
        $file = $(fileTemplate);
        $file.attr('data-pos', i+1);
        $file.attr('data-id', file.id);
        $file.find('.title').html(file.file_name);
        $file.find('.size').html('Size: ' + file.size);
        $list.append($file);
    }
    $list.addClass('populated');
};

var renderDocument = function (doc) {
    var $doc,
        $list = $('.documents').find('.create'),
        documentTemplate = $('#documentTemplate').html();

    if ($list.find('.empty').length) {
        $list.empty();
    }
    $doc = $(documentTemplate);
    $doc.removeAttr('data-pos');
    $doc.attr('data-id', doc.id);
    $doc.find('.title').html(doc.title);
    $doc.find('.added').html((new Date(doc.created)).toLocaleString());
    $list.append($doc);
    $list.addClass('populated');
};

var errorHandler = function (req, res) {
    var response;

    console.error('Request failed with status code:', res.status);
    if (res && res.responseText) {
        response = JSON.parse(res.responseText);
        if (response.hasOwnProperty('message')) {
            console.error('Response error message:', response.message);
        } else {
            console.info('No response error message received');
        }
    } else {
        console.info('No response body received');
    }
};

var getDocuments = function (event) {
    MendeleySDK.API.documents
        .list({ sort: 'created', order: 'desc' })
        .done(renderDocumentList)
        .fail(errorHandler);
    event.preventDefault();
};

var getFolders = function (event) {
    MendeleySDK.API.folders
        .list()
        .done(renderFoldersList)
        .fail(errorHandler);
    event.preventDefault();
};

var createDocument = function (event) {
    MendeleySDK.API.documents
        .create({
            title: $('.document-title').val() || 'A new document',
            type: $('.document-type').val() || 'journal'
        })
        .done(renderDocument)
        .fail(errorHandler);
    event.preventDefault();
};

var getFiles = function (event) {
    MendeleySDK.API.files
        .list($('.file-id').val())
        .done(renderFileList)
        .fail(errorHandler);
    event.preventDefault();
};

var clearDocuments = function (event) {
    var $list = $('.documents').find('.create'),
        listItemTemplate = $('#listItemTemplate').html();

    if ($list.hasClass('populated')) {
        $list.empty().removeClass('populated').append(listItemTemplate);
    }
    event.preventDefault();
};