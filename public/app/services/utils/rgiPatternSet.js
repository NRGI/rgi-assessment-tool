'use strict';

angular.module('app')
    .constant('HUMAN_NAME_PATTERN', /^[a-zA-Z]+([\-\s]?[a-zA-Z]+)*$/)
    .constant('PASSWORD_PATTERN', /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,8}$/)
    .constant('VERSION_PATTERN', /^\d+(\.\d+)*$/)
;
