'use strict';
var angular;
/*jslint nomen: true unparam: true regexp: true*/

angular.module('app').controller('rgiAssessmentAdminCtrl', function ($scope, ngDialog, rgiAssessmentSrvc, rgiUserListSrvc) {
    // filtering options
    $scope.sortOptions = [
        {value: 'country', text: 'Sort by Country'},
        {value: 'start_date', text: 'Date started'},
        {value: 'status', text: 'Status'},
        {value: 'year', text: 'Year of assessment'},
        {value: 'version', text: 'Version'}
    ];
    $scope.sortOrder = $scope.sortOptions[0].value;

    rgiAssessmentSrvc.query(function (data) {
        // pull assessment list from collection and adds user name to match reviewer id and researcher id
        var assessment;
        $scope.assessments = [];

        data.forEach(function (el, i) {
            assessment = {
                assessment_ID: el.assessment_ID,
                country: el.country,
                researcher_ID: el.researcher_ID,
                reviewer_ID: el.reviewer_ID,
                start_date: el.start_date,
                version: el.version,
                year: el.year,
                status: el.status
            };
            if (el.modified[0] !== undefined) {
                assessment.modified = el.modified;
                assessment.edited_by = rgiUserListSrvc.get({_id: el.modified[el.modified.length - 1].modified_by});
            }
            if (assessment.reviewer_ID !== undefined) {
                assessment.reviewer = rgiUserListSrvc.get({_id: assessment.reviewer_ID});
                assessment.researcher = rgiUserListSrvc.get({_id: assessment.researcher_ID});
            }
            $scope.assessments.push(assessment);
        });
    });

    // Deploy new assessment
    $scope.newAssessmentDialog = function () {
        $scope.value = true;
        ngDialog.open({
            template: 'partials/admin/assessments/new-assessment-dialog',
            controller: 'assessmentDialogCtrl',
            className: 'ngdialog-theme-plain',
            scope: $scope
        });
    };
});

angular.module('app').controller('assessmentDialogCtrl', function ($scope, ngDialog) {
    $scope.countries = [{'iso2': 'AF', 'country': 'AFGHANISTAN'},{'iso2': 'AX', 'country': 'ÅLAND ISLANDS'},{'iso2': 'AL', 'country': 'ALBANIA'},{'iso2': 'DZ', 'country': 'ALGERIA'},{'iso2': 'AS', 'country': 'AMERICAN SAMOA'},{'iso2': 'AD', 'country': 'ANDORRA'},{'iso2': 'AO', 'country': 'ANGOLA'},{'iso2': 'AI', 'country': 'ANGUILLA'},{'iso2': 'AQ', 'country': 'ANTARCTICA'},{'iso2': 'AG', 'country': 'ANTIGUA AND BARBUDA'},{'iso2': 'AR', 'country': 'ARGENTINA'},{'iso2': 'AM', 'country': 'ARMENIA'},{'iso2': 'AW', 'country': 'ARUBA'},{'iso2': 'AU', 'country': 'AUSTRALIA'},{'iso2': 'AT', 'country': 'AUSTRIA'},{'iso2': 'AZ', 'country': 'AZERBAIJAN'},{'iso2': 'BS', 'country': 'BAHAMAS'},{'iso2': 'BH', 'country': 'BAHRAIN'},{'iso2': 'BD', 'country': 'BANGLADESH'},{'iso2': 'BB', 'country': 'BARBADOS'},{'iso2': 'BY', 'country': 'BELARUS'},{'iso2': 'BE', 'country': 'BELGIUM'},{'iso2': 'BZ', 'country': 'BELIZE'},{'iso2': 'BJ', 'country': 'BENIN'},{'iso2': 'BM', 'country': 'BERMUDA'},{'iso2': 'BT', 'country': 'BHUTAN'},{'iso2': 'BO', 'country': 'BOLIVIA, PLURINATIONAL STATE OF'},{'iso2': 'BQ', 'country': 'BONAIRE, SINT EUSTATIUS AND SABA'},{'iso2': 'BA', 'country': 'BOSNIA AND HERZEGOVINA'},{'iso2': 'BW', 'country': 'BOTSWANA'},{'iso2': 'BV', 'country': 'BOUVET ISLAND'},{'iso2': 'BR', 'country': 'BRAZIL'},{'iso2': 'IO', 'country': 'BRITISH INDIAN OCEAN TERRITORY'},{'iso2': 'BN', 'country': 'BRUNEI DARUSSALAM'},{'iso2': 'BG', 'country': 'BULGARIA'},{'iso2': 'BF', 'country': 'BURKINA FASO'},{'iso2': 'BI', 'country': 'BURUNDI'},{'iso2': 'KH', 'country': 'CAMBODIA'},{'iso2': 'CM', 'country': 'CAMEROON'},{'iso2': 'CA', 'country': 'CANADA'},{'iso2': 'CV', 'country': 'CAPE VERDE'},{'iso2': 'KY', 'country': 'CAYMAN ISLANDS'},{'iso2': 'CF', 'country': 'CENTRAL AFRICAN REPUBLIC'},{'iso2': 'TD', 'country': 'CHAD'},{'iso2': 'CL', 'country': 'CHILE'},{'iso2': 'CN', 'country': 'CHINA'},{'iso2': 'CX', 'country': 'CHRISTMAS ISLAND'},{'iso2': 'CC', 'country': 'COCOS (KEELING) ISLANDS'},{'iso2': 'CO', 'country': 'COLOMBIA'},{'iso2': 'KM', 'country': 'COMOROS'},{'iso2': 'CG', 'country': 'CONGO'},{'iso2': 'CD', 'country': 'CONGO, THE DEMOCRATIC REPUBLIC OF THE'},{'iso2': 'CK', 'country': 'COOK ISLANDS'},{'iso2': 'CR', 'country': 'COSTA RICA'},{'iso2': 'CI', 'country': 'CÔTE D\'IVOIRE'},{'iso2': 'HR', 'country': 'CROATIA'},{'iso2': 'CU', 'country': 'CUBA'},{'iso2': 'CW', 'country': 'CURAÇAO'},{'iso2': 'CY', 'country': 'CYPRUS'},{'iso2': 'CZ', 'country': 'CZECH REPUBLIC'},{'iso2': 'DK', 'country': 'DENMARK'},{'iso2': 'DJ', 'country': 'DJIBOUTI'},{'iso2': 'DM', 'country': 'DOMINICA'},{'iso2': 'DO', 'country': 'DOMINICAN REPUBLIC'},{'iso2': 'EC', 'country': 'ECUADOR'},{'iso2': 'EG', 'country': 'EGYPT'},{'iso2': 'SV', 'country': 'EL SALVADOR'},{'iso2': 'GQ', 'country': 'EQUATORIAL GUINEA'},{'iso2': 'ER', 'country': 'ERITREA'},{'iso2': 'EE', 'country': 'ESTONIA'},{'iso2': 'ET', 'country': 'ETHIOPIA'},{'iso2': 'FK', 'country': 'FALKLAND ISLANDS (MALVINAS)'},{'iso2': 'FO', 'country': 'FAROE ISLANDS'},{'iso2': 'FJ', 'country': 'FIJI'},{'iso2': 'FI', 'country': 'FINLAND'},{'iso2': 'FR', 'country': 'FRANCE'},{'iso2': 'GF', 'country': 'FRENCH GUIANA'},{'iso2': 'PF', 'country': 'FRENCH POLYNESIA'},{'iso2': 'TF', 'country': 'FRENCH SOUTHERN TERRITORIES'},{'iso2': 'GA', 'country': 'GABON'},{'iso2': 'GM', 'country': 'GAMBIA'},{'iso2': 'GE', 'country': 'GEORGIA'},{'iso2': 'DE', 'country': 'GERMANY'},{'iso2': 'GH', 'country': 'GHANA'},{'iso2': 'GI', 'country': 'GIBRALTAR'},{'iso2': 'GR', 'country': 'GREECE'},{'iso2': 'GL', 'country': 'GREENLAND'},{'iso2': 'GD', 'country': 'GRENADA'},{'iso2': 'GP', 'country': 'GUADELOUPE'},{'iso2': 'GU', 'country': 'GUAM'},{'iso2': 'GT', 'country': 'GUATEMALA'},{'iso2': 'GG', 'country': 'GUERNSEY'},{'iso2': 'GN', 'country': 'GUINEA'},{'iso2': 'GW', 'country': 'GUINEA-BISSAU'},{'iso2': 'GY', 'country': 'GUYANA'},{'iso2': 'HT', 'country': 'HAITI'},{'iso2': 'HM', 'country': 'HEARD ISLAND AND MCDONALD ISLANDS'},{'iso2': 'VA', 'country': 'HOLY SEE (VATICAN CITY STATE)'},{'iso2': 'HN', 'country': 'HONDURAS'},{'iso2': 'HK', 'country': 'HONG KONG'},{'iso2': 'HU', 'country': 'HUNGARY'},{'iso2': 'IS', 'country': 'ICELAND'},{'iso2': 'IN', 'country': 'INDIA'},{'iso2': 'ID', 'country': 'INDONESIA'},{'iso2': 'IR', 'country': 'IRAN, ISLAMIC REPUBLIC OF'},{'iso2': 'IQ', 'country': 'IRAQ'},{'iso2': 'IE', 'country': 'IRELAND'},{'iso2': 'IM', 'country': 'ISLE OF MAN'},{'iso2': 'IL', 'country': 'ISRAEL'},{'iso2': 'IT', 'country': 'ITALY'},{'iso2': 'JM', 'country': 'JAMAICA'},{'iso2': 'JP', 'country': 'JAPAN'},{'iso2': 'JE', 'country': 'JERSEY'},{'iso2': 'JO', 'country': 'JORDAN'},{'iso2': 'KZ', 'country': 'KAZAKHSTAN'},{'iso2': 'KE', 'country': 'KENYA'},{'iso2': 'KI', 'country': 'KIRIBATI'},{'iso2': 'KP', 'country': 'KOREA, DEMOCRATIC PEOPLE\'S REPUBLIC OF'},{'iso2': 'KR', 'country': 'KOREA, REPUBLIC OF'},{'iso2': 'KW', 'country': 'KUWAIT'},{'iso2': 'KG', 'country': 'KYRGYZSTAN'},{'iso2': 'LA', 'country': 'LAO PEOPLE\'S DEMOCRATIC REPUBLIC'},{'iso2': 'LV', 'country': 'LATVIA'},{'iso2': 'LB', 'country': 'LEBANON'},{'iso2': 'LS', 'country': 'LESOTHO'},{'iso2': 'LR', 'country': 'LIBERIA'},{'iso2': 'LY', 'country': 'LIBYA'},{'iso2': 'LI', 'country': 'LIECHTENSTEIN'},{'iso2': 'LT', 'country': 'LITHUANIA'},{'iso2': 'LU', 'country': 'LUXEMBOURG'},{'iso2': 'MO', 'country': 'MACAO'},{'iso2': 'MK', 'country': 'MACEDONIA, THE FORMER YUGOSLAV REPUBLIC OF'},{'iso2': 'MG', 'country': 'MADAGASCAR'},{'iso2': 'MW', 'country': 'MALAWI'},{'iso2': 'MY', 'country': 'MALAYSIA'},{'iso2': 'MV', 'country': 'MALDIVES'},{'iso2': 'ML', 'country': 'MALI'},{'iso2': 'MT', 'country': 'MALTA'},{'iso2': 'MH', 'country': 'MARSHALL ISLANDS'},{'iso2': 'MQ', 'country': 'MARTINIQUE'},{'iso2': 'MR', 'country': 'MAURITANIA'},{'iso2': 'MU', 'country': 'MAURITIUS'},{'iso2': 'YT', 'country': 'MAYOTTE'},{'iso2': 'MX', 'country': 'MEXICO'},{'iso2': 'FM', 'country': 'MICRONESIA, FEDERATED STATES OF'},{'iso2': 'MD', 'country': 'MOLDOVA, REPUBLIC OF'},{'iso2': 'MC', 'country': 'MONACO'},{'iso2': 'MN', 'country': 'MONGOLIA'},{'iso2': 'ME', 'country': 'MONTENEGRO'},{'iso2': 'MS', 'country': 'MONTSERRAT'},{'iso2': 'MA', 'country': 'MOROCCO'},{'iso2': 'MZ', 'country': 'MOZAMBIQUE'},{'iso2': 'MM', 'country': 'MYANMAR'},{'iso2': 'NA', 'country': 'NAMIBIA'},{'iso2': 'NR', 'country': 'NAURU'},{'iso2': 'NP', 'country': 'NEPAL'},{'iso2': 'NL', 'country': 'NETHERLANDS'},{'iso2': 'NC', 'country': 'NEW CALEDONIA'},{'iso2': 'NZ', 'country': 'NEW ZEALAND'},{'iso2': 'NI', 'country': 'NICARAGUA'},{'iso2': 'NE', 'country': 'NIGER'},{'iso2': 'NG', 'country': 'NIGERIA'},{'iso2': 'NU', 'country': 'NIUE'},{'iso2': 'NF', 'country': 'NORFOLK ISLAND'},{'iso2': 'MP', 'country': 'NORTHERN MARIANA ISLANDS'},{'iso2': 'NO', 'country': 'NORWAY'},{'iso2': 'OM', 'country': 'OMAN'},{'iso2': 'PK', 'country': 'PAKISTAN'},{'iso2': 'PW', 'country': 'PALAU'},{'iso2': 'PS', 'country': 'PALESTINE, STATE OF'},{'iso2': 'PA', 'country': 'PANAMA'},{'iso2': 'PG', 'country': 'PAPUA NEW GUINEA'},{'iso2': 'PY', 'country': 'PARAGUAY'},{'iso2': 'PE', 'country': 'PERU'},{'iso2': 'PH', 'country': 'PHILIPPINES'},{'iso2': 'PN', 'country': 'PITCAIRN'},{'iso2': 'PL', 'country': 'POLAND'},{'iso2': 'PT', 'country': 'PORTUGAL'},{'iso2': 'PR', 'country': 'PUERTO RICO'},{'iso2': 'QA', 'country': 'QATAR'},{'iso2': 'RE', 'country': 'RÉUNION'},{'iso2': 'RO', 'country': 'ROMANIA'},{'iso2': 'RU', 'country': 'RUSSIAN FEDERATION'},{'iso2': 'RW', 'country': 'RWANDA'},{'iso2': 'BL', 'country': 'SAINT BARTHÉLEMY'},{'iso2': 'SH', 'country': 'SAINT HELENA, ASCENSION AND TRISTAN DA CUNHA'},{'iso2': 'KN', 'country': 'SAINT KITTS AND NEVIS'},{'iso2': 'LC', 'country': 'SAINT LUCIA'},{'iso2': 'MF', 'country': 'SAINT MARTIN (FRENCH PART)'},{'iso2': 'PM', 'country': 'SAINT PIERRE AND MIQUELON'},{'iso2': 'VC', 'country': 'SAINT VINCENT AND THE GRENADINES'},{'iso2': 'WS', 'country': 'SAMOA'},{'iso2': 'SM', 'country': 'SAN MARINO'},{'iso2': 'ST', 'country': 'SAO TOME AND PRINCIPE'},{'iso2': 'SA', 'country': 'SAUDI ARABIA'},{'iso2': 'SN', 'country': 'SENEGAL'},{'iso2': 'RS', 'country': 'SERBIA'},{'iso2': 'SC', 'country': 'SEYCHELLES'},{'iso2': 'SL', 'country': 'SIERRA LEONE'},{'iso2': 'SG', 'country': 'SINGAPORE'},{'iso2': 'SX', 'country': 'SINT MAARTEN (DUTCH PART)'},{'iso2': 'SK', 'country': 'SLOVAKIA'},{'iso2': 'SI', 'country': 'SLOVENIA'},{'iso2': 'SB', 'country': 'SOLOMON ISLANDS'},{'iso2': 'SO', 'country': 'SOMALIA'},{'iso2': 'ZA', 'country': 'SOUTH AFRICA'},{'iso2': 'GS', 'country': 'SOUTH GEORGIA AND THE SOUTH SANDWICH ISLANDS'},{'iso2': 'SS', 'country': 'SOUTH SUDAN'},{'iso2': 'ES', 'country': 'SPAIN'},{'iso2': 'LK', 'country': 'SRI LANKA'},{'iso2': 'SD', 'country': 'SUDAN'},{'iso2': 'SR', 'country': 'SURINAME'},{'iso2': 'SJ', 'country': 'SVALBARD AND JAN MAYEN'},{'iso2': 'SZ', 'country': 'SWAZILAND'},{'iso2': 'SE', 'country': 'SWEDEN'},{'iso2': 'CH', 'country': 'SWITZERLAND'},{'iso2': 'SY', 'country': 'SYRIAN ARAB REPUBLIC'},{'iso2': 'TW', 'country': 'TAIWAN, PROVINCE OF CHINA'},{'iso2': 'TJ', 'country': 'TAJIKISTAN'},{'iso2': 'TZ', 'country': 'TANZANIA, UNITED REPUBLIC OF'},{'iso2': 'TH', 'country': 'THAILAND'},{'iso2': 'TL', 'country': 'TIMOR-LESTE'},{'iso2': 'TG', 'country': 'TOGO'},{'iso2': 'TK', 'country': 'TOKELAU'},{'iso2': 'TO', 'country': 'TONGA'},{'iso2': 'TT', 'country': 'TRINIDAD AND TOBAGO'},{'iso2': 'TN', 'country': 'TUNISIA'},{'iso2': 'TR', 'country': 'TURKEY'},{'iso2': 'TM', 'country': 'TURKMENISTAN'},{'iso2': 'TC', 'country': 'TURKS AND CAICOS ISLANDS'},{'iso2': 'TV', 'country': 'TUVALU'},{'iso2': 'UG', 'country': 'UGANDA'},{'iso2': 'UA', 'country': 'UKRAINE'},{'iso2': 'AE', 'country': 'UNITED ARAB EMIRATES'},{'iso2': 'GB', 'country': 'UNITED KINGDOM'},{'iso2': 'US', 'country': 'UNITED STATES'},{'iso2': 'UM', 'country': 'UNITED STATES MINOR OUTLYING ISLANDS'},{'iso2': 'UY', 'country': 'URUGUAY'},{'iso2': 'UZ', 'country': 'UZBEKISTAN'},{'iso2': 'VU', 'country': 'VANUATU'},{'iso2': 'VE', 'country': 'VENEZUELA, BOLIVARIAN REPUBLIC OF'},{'iso2': 'VN', 'country': 'VIET NAM'},{'iso2': 'VG', 'country': 'VIRGIN ISLANDS, BRITISH'},{'iso2': 'VI', 'country': 'VIRGIN ISLANDS, U.S.'},{'iso2': 'WF', 'country': 'WALLIS AND FUTUNA'},{'iso2': 'EH', 'country': 'WESTERN SAHARA'},{'iso2': 'YE', 'country': 'YEMEN'},{'iso2': 'ZM', 'country': 'ZAMBIA'},{'iso2': 'ZW', 'country': 'ZIMBABWE'}];

    $scope.new_assessment = {
        year: "",
        version: "",
        assessment_countries: [{country: ""}]
    };
    // Assessment.create({assessment_ID: "TZ-2015-PI", ISO3: "TZA", year: "2015", version: "pilot", country: "Tanzania"});
    // $scope.new_question.question_choices = [{order: 1, criteria: "Enter text"}];
    // $scope.dialogModel = {
    //     message : 'message from passed scope'
    // };
    $scope.closeDialog = function () {
        ngDialog.close();
    };

    $scope.countryAdd = function () {
        $scope.new_assessment.assessment_countries.push({country: ""});
    };

    $scope.countryDelete = function (index) {
        console.log(index);
        $scope.new_assessment.assessment_countries.splice(index, 1);
    };
    $scope.assessmentDeploy = function () {
    //     console.log('yes');
    //     // var new_question_data = {
    //         // firstName: $scope.fname,
    //         // lastName: $scope.lname,
    //         // username: $scope.username,
    //         // email: $scope.email,
    //         // password: $scope.password,
    //         // // ADD ROLE IN CREATION EVENT
    //         // role: $scope.roleSelect,
    //         // address: [$scope.address],
    //         // language: [$scope.language]
    //     // };

    // //     rgiUserMethodSrvc.createUser(newUserData).then(function () {
    // //         // rgiMailer.send($scope.email);
    // //         rgiNotifier.notify('User account created!' + $scope.email);
    // //         $location.path('/admin/user-admin');
    // //     }, function (reason) {
    // //         rgiNotifier.error(reason);
    // //     });
    };
});

// Angular capitilaize filter
angular.module('app').filter('capitalize', function () {
    return function (input) {
        return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); }) :  '';
    };
});