'use strict';

angular.module('app')
    .constant('HUMAN_NAME_PATTERN', /^[a-zA-Z]+([\-\s]?[a-zA-Z]+)*$/)
    .constant('NUMERIC_RANGE_PATTERN', /^\d+((\s?\-\s?\d+)|(,\s?\d+))*$/)
    .constant('PASSWORD_PATTERN', /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{8,16}$/)
    .constant('VERSION_PATTERN', /^\d+(\.\d+)*$/)
    .constant('YEAR_PATTERN', /^\d{4}$/)
;
