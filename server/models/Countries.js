'use strict';
/*jslint unparam: true*/

var mongoose = require('mongoose');
var countrySchema = mongoose.Schema({
    country: String,
    iso2: String,
    country_ID: String,
    country_use: {
        type: Boolean,
        default: true}

});

var Country = mongoose.model('Country', countrySchema);

function createDefaultCountries() {
    Country.find({}).exec(function (err, collection) {
        if (collection.length === 0) {
            Country.create({'country': 'Afghanistan', 'country_ID': 'AFG', 'iso2': 'AF'});
            Country.create({'country': 'Aland Islands', 'country_ID': 'ALA', 'iso2': 'AX', country_use: false});
            Country.create({'country': 'Albania', 'country_ID': 'ALB', 'iso2': 'AL'});
            Country.create({'country': 'Algeria', 'country_ID': 'DZA', 'iso2': 'DZ'});
            Country.create({'country': 'American Samoa', 'country_ID': 'ASM', 'iso2': 'AS', country_use: false});
            Country.create({'country': 'Andorra', 'country_ID': 'AND', 'iso2': 'AD', country_use: false});
            Country.create({'country': 'Angola', 'country_ID': 'AGO', 'iso2': 'AO'});
            Country.create({'country': 'Anguilla', 'country_ID': 'AIA', 'iso2': 'AI', country_use: false});
            Country.create({'country': 'Antarctica', 'country_ID': 'ATA', 'iso2': 'AQ', country_use: false});
            Country.create({'country': 'Antigua and Barbuda', 'country_ID': 'ATG', 'iso2': 'AG'});
            Country.create({'country': 'Argentina', 'country_ID': 'ARG', 'iso2': 'AR'});
            Country.create({'country': 'Armenia', 'country_ID': 'ARM', 'iso2': 'AM'});
            Country.create({'country': 'Aruba', 'country_ID': 'ABW', 'iso2': 'AW'});
            Country.create({'country': 'Australia', 'country_ID': 'AUS', 'iso2': 'AU'});
            Country.create({'country': 'Austria', 'country_ID': 'AUT', 'iso2': 'AT'});
            Country.create({'country': 'Azerbaijan', 'country_ID': 'AZE', 'iso2': 'AZ'});
            Country.create({'country': 'Bahamas', 'country_ID': 'BHS', 'iso2': 'BS'});
            Country.create({'country': 'Bahrain', 'country_ID': 'BHR', 'iso2': 'BH'});
            Country.create({'country': 'Bangladesh', 'country_ID': 'BGD', 'iso2': 'BD'});
            Country.create({'country': 'Barbados', 'country_ID': 'BRB', 'iso2': 'BB'});
            Country.create({'country': 'Belarus', 'country_ID': 'BLR', 'iso2': 'BY'});
            Country.create({'country': 'Belgium', 'country_ID': 'BEL', 'iso2': 'BE'});
            Country.create({'country': 'Belize', 'country_ID': 'BLZ', 'iso2': 'BZ'});
            Country.create({'country': 'Benin', 'country_ID': 'BEN', 'iso2': 'BJ'});
            Country.create({'country': 'Bermuda', 'country_ID': 'BMU', 'iso2': 'BM'});
            Country.create({'country': 'Bhutan', 'country_ID': 'BTN', 'iso2': 'BT'});
            Country.create({'country': 'Bolivia, Plurinational State of', 'country_ID': 'BOL', 'iso2': 'BO'});
            Country.create({'country': 'Bonaire, Sint Eustatius and Saba', 'country_ID': 'BES', 'iso2': 'BQ', country_use: false});
            Country.create({'country': 'Bosnia and Herzegovina', 'country_ID': 'BIH', 'iso2': 'BA'});
            Country.create({'country': 'Botswana', 'country_ID': 'BWA', 'iso2': 'BW'});
            Country.create({'country': 'Bouvet Island', 'country_ID': 'BVT', 'iso2': 'BV', country_use: false});
            Country.create({'country': 'Brazil', 'country_ID': 'BRA', 'iso2': 'BR'});
            Country.create({'country': 'British Indian Ocean Territory', 'country_ID': 'IOT', 'iso2': 'IO', country_use: false});
            Country.create({'country': 'Brunei Darussalam', 'country_ID': 'BRN', 'iso2': 'BN'});
            Country.create({'country': 'Bulgaria', 'country_ID': 'BGR', 'iso2': 'BG'});
            Country.create({'country': 'Burkina Faso', 'country_ID': 'BFA', 'iso2': 'BF'});
            Country.create({'country': 'Burundi', 'country_ID': 'BDI', 'iso2': 'BI'});
            Country.create({'country': 'Cambodia', 'country_ID': 'KHM', 'iso2': 'KH'});
            Country.create({'country': 'Cameroon', 'country_ID': 'CMR', 'iso2': 'CM'});
            Country.create({'country': 'Canada', 'country_ID': 'CAN', 'iso2': 'CA'});
            Country.create({'country': 'Cape Verde', 'country_ID': 'CPV', 'iso2': 'CV'});
            Country.create({'country': 'Cayman Islands', 'country_ID': 'CYM', 'iso2': 'KY'});
            Country.create({'country': 'Central African Republic', 'country_ID': 'CAF', 'iso2': 'CF'});
            Country.create({'country': 'Chad', 'country_ID': 'TCD', 'iso2': 'TD'});
            Country.create({'country': 'Chile', 'country_ID': 'CHL', 'iso2': 'CL'});
            Country.create({'country': 'China', 'country_ID': 'CHN', 'iso2': 'CN'});
            Country.create({'country': 'Christmas Island', 'country_ID': 'CXR', 'iso2': 'CX', country_use: false});
            Country.create({'country': 'Cocos (Keeling) Islands', 'country_ID': 'CCK', 'iso2': 'CC', country_use: false});
            Country.create({'country': 'Colombia', 'country_ID': 'COL', 'iso2': 'CO'});
            Country.create({'country': 'Comoros', 'country_ID': 'COM', 'iso2': 'KM'});
            Country.create({'country': 'Congo', 'country_ID': 'COG', 'iso2': 'CG'});
            Country.create({'country': 'Congo, The Democratic Republic of the', 'country_ID': 'COD', 'iso2': 'CD'});
            Country.create({'country': 'Cook Islands', 'country_ID': 'COK', 'iso2': 'CK', country_use: false});
            Country.create({'country': 'Costa Rica', 'country_ID': 'CRI', 'iso2': 'CR'});
            Country.create({'country': 'Cote d\'Ivoire', 'country_ID': 'CIV', 'iso2': 'CI'});
            Country.create({'country': 'Croatia', 'country_ID': 'HRV', 'iso2': 'HR'});
            Country.create({'country': 'Cuba', 'country_ID': 'CUB', 'iso2': 'CU'});
            Country.create({'country': 'Curacao', 'country_ID': 'CUW', 'iso2': 'CW', country_use: false});
            Country.create({'country': 'Cyprus', 'country_ID': 'CYP', 'iso2': 'CY'});
            Country.create({'country': 'Czech Republic', 'country_ID': 'CZE', 'iso2': 'CZ'});
            Country.create({'country': 'Denmark', 'country_ID': 'DNK', 'iso2': 'DK'});
            Country.create({'country': 'Djibouti', 'country_ID': 'DJI', 'iso2': 'DJ'});
            Country.create({'country': 'Dominica', 'country_ID': 'DMA', 'iso2': 'DM'});
            Country.create({'country': 'Dominican Republic', 'country_ID': 'DOM', 'iso2': 'DO'});
            Country.create({'country': 'Ecuador', 'country_ID': 'ECU', 'iso2': 'EC'});
            Country.create({'country': 'Egypt', 'country_ID': 'EGY', 'iso2': 'EG'});
            Country.create({'country': 'El Salvador', 'country_ID': 'SLV', 'iso2': 'SV'});
            Country.create({'country': 'Equatorial Guinea', 'country_ID': 'GNQ', 'iso2': 'GQ'});
            Country.create({'country': 'Eritrea', 'country_ID': 'ERI', 'iso2': 'ER'});
            Country.create({'country': 'Estonia', 'country_ID': 'EST', 'iso2': 'EE'});
            Country.create({'country': 'Ethiopia', 'country_ID': 'ETH', 'iso2': 'ET'});
            Country.create({'country': 'Falkland Islands (Malvinas)', 'country_ID': 'FLK', 'iso2': 'FK', country_use: false});
            Country.create({'country': 'Faroe Islands', 'country_ID': 'FRO', 'iso2': 'FO', country_use: false});
            Country.create({'country': 'Fiji', 'country_ID': 'FJI', 'iso2': 'FJ'});
            Country.create({'country': 'Finland', 'country_ID': 'FIN', 'iso2': 'FI'});
            Country.create({'country': 'France', 'country_ID': 'FRA', 'iso2': 'FR'});
            Country.create({'country': 'French Guiana', 'country_ID': 'GUF', 'iso2': 'GF', country_use: false});
            Country.create({'country': 'French Polynesia', 'country_ID': 'PYF', 'iso2': 'PF', country_use: false});
            Country.create({'country': 'French Southern Territories', 'country_ID': 'ATF', 'iso2': 'TF', country_use: false});
            Country.create({'country': 'Gabon', 'country_ID': 'GAB', 'iso2': 'GA'});
            Country.create({'country': 'Gambia', 'country_ID': 'GMB', 'iso2': 'GM'});
            Country.create({'country': 'Georgia', 'country_ID': 'GEO', 'iso2': 'GE'});
            Country.create({'country': 'Germany', 'country_ID': 'DEU', 'iso2': 'DE'});
            Country.create({'country': 'Ghana', 'country_ID': 'GHA', 'iso2': 'GH'});
            Country.create({'country': 'Gibraltar', 'country_ID': 'GIB', 'iso2': 'GI', country_use: false});
            Country.create({'country': 'Greece', 'country_ID': 'GRC', 'iso2': 'GR'});
            Country.create({'country': 'Greenland', 'country_ID': 'GRL', 'iso2': 'GL'});
            Country.create({'country': 'Grenada', 'country_ID': 'GRD', 'iso2': 'GD'});
            Country.create({'country': 'Guadeloupe', 'country_ID': 'GLP', 'iso2': 'GP', country_use: false});
            Country.create({'country': 'Guam', 'country_ID': 'GUM', 'iso2': 'GU'});
            Country.create({'country': 'Guatemala', 'country_ID': 'GTM', 'iso2': 'GT'});
            Country.create({'country': 'Guernsey', 'country_ID': 'GGY', 'iso2': 'GG', country_use: false});
            Country.create({'country': 'Guinea', 'country_ID': 'GIN', 'iso2': 'GN'});
            Country.create({'country': 'Guinea-Bissau', 'country_ID': 'GNB', 'iso2': 'GW'});
            Country.create({'country': 'Guyana', 'country_ID': 'GUY', 'iso2': 'GY'});
            Country.create({'country': 'Haiti', 'country_ID': 'HTI', 'iso2': 'HT'});
            Country.create({'country': 'Heard Island and McDonald Islands', 'country_ID': 'HMD', 'iso2': 'HM', country_use: false});
            Country.create({'country': 'Holy See (Vatican City State)', 'country_ID': 'VAT', 'iso2': 'VA', country_use: false});
            Country.create({'country': 'Honduras', 'country_ID': 'HND', 'iso2': 'HN'});
            Country.create({'country': 'Hong Kong', 'country_ID': 'HKG', 'iso2': 'HK'});
            Country.create({'country': 'Hungary', 'country_ID': 'HUN', 'iso2': 'HU'});
            Country.create({'country': 'Iceland', 'country_ID': 'ISL', 'iso2': 'IS'});
            Country.create({'country': 'India', 'country_ID': 'IND', 'iso2': 'IN'});
            Country.create({'country': 'Indonesia', 'country_ID': 'IDN', 'iso2': 'ID'});
            Country.create({'country': 'Iran, Islamic Republic of', 'country_ID': 'IRN', 'iso2': 'IR'});
            Country.create({'country': 'Iraq', 'country_ID': 'IRQ', 'iso2': 'IQ'});
            Country.create({'country': 'Ireland', 'country_ID': 'IRL', 'iso2': 'IE'});
            Country.create({'country': 'Isle of Man', 'country_ID': 'IMN', 'iso2': 'IM', country_use: false});
            Country.create({'country': 'Israel', 'country_ID': 'ISR', 'iso2': 'IL'});
            Country.create({'country': 'Italy', 'country_ID': 'ITA', 'iso2': 'IT'});
            Country.create({'country': 'Jamaica', 'country_ID': 'JAM', 'iso2': 'JM'});
            Country.create({'country': 'Japan', 'country_ID': 'JPN', 'iso2': 'JP'});
            Country.create({'country': 'Jersey', 'country_ID': 'JEY', 'iso2': 'JE', country_use: false});
            Country.create({'country': 'Jordan', 'country_ID': 'JOR', 'iso2': 'JO'});
            Country.create({'country': 'Kazakhstan', 'country_ID': 'KAZ', 'iso2': 'KZ'});
            Country.create({'country': 'Kenya', 'country_ID': 'KEN', 'iso2': 'KE'});
            Country.create({'country': 'Kiribati', 'country_ID': 'KIR', 'iso2': 'KI'});
            Country.create({'country': 'DPRK Korea', 'country_ID': 'PRK', 'iso2': 'KP'});
            Country.create({'country': 'Republic of Korea', 'country_ID': 'KOR', 'iso2': 'KR'});
            Country.create({'country': 'Kuwait', 'country_ID': 'KWT', 'iso2': 'KW'});
            Country.create({'country': 'Kyrgyzstan', 'country_ID': 'KGZ', 'iso2': 'KG'});
            Country.create({'country': 'Lao Peoples Democratic Republic', 'country_ID': 'LAO', 'iso2': 'LA'});
            Country.create({'country': 'Latvia', 'country_ID': 'LVA', 'iso2': 'LV'});
            Country.create({'country': 'Lebanon', 'country_ID': 'LBN', 'iso2': 'LB'});
            Country.create({'country': 'Lesotho', 'country_ID': 'LSO', 'iso2': 'LS'});
            Country.create({'country': 'Liberia', 'country_ID': 'LBR', 'iso2': 'LR'});
            Country.create({'country': 'Libya', 'country_ID': 'LBY', 'iso2': 'LY'});
            Country.create({'country': 'Liechtenstein', 'country_ID': 'LIE', 'iso2': 'LI'});
            Country.create({'country': 'Lithuania', 'country_ID': 'LTU', 'iso2': 'LT'});
            Country.create({'country': 'Luxembourg', 'country_ID': 'LUX', 'iso2': 'LU'});
            Country.create({'country': 'Macao', 'country_ID': 'MAC', 'iso2': 'MO', country_use: false});
            Country.create({'country': 'Macedonia, Republic of', 'country_ID': 'MKD', 'iso2': 'MK'});
            Country.create({'country': 'Madagascar', 'country_ID': 'MDG', 'iso2': 'MG'});
            Country.create({'country': 'Malawi', 'country_ID': 'MWI', 'iso2': 'MW'});
            Country.create({'country': 'Malaysia', 'country_ID': 'MYS', 'iso2': 'MY'});
            Country.create({'country': 'Maldives', 'country_ID': 'MDV', 'iso2': 'MV', country_use: false});
            Country.create({'country': 'Mali', 'country_ID': 'MLI', 'iso2': 'ML'});
            Country.create({'country': 'Malta', 'country_ID': 'MLT', 'iso2': 'MT', country_use: false});
            Country.create({'country': 'Marshall Islands', 'country_ID': 'MHL', 'iso2': 'MH', country_use: false});
            Country.create({'country': 'Martinique', 'country_ID': 'MTQ', 'iso2': 'MQ', country_use: false});
            Country.create({'country': 'Mauritania', 'country_ID': 'MRT', 'iso2': 'MR'});
            Country.create({'country': 'Mauritius', 'country_ID': 'MUS', 'iso2': 'MU', country_use: false});
            Country.create({'country': 'Mayotte', 'country_ID': 'MYT', 'iso2': 'YT', country_use: false});
            Country.create({'country': 'Mexico', 'country_ID': 'MEX', 'iso2': 'MX'});
            Country.create({'country': 'Micronesia, Federated States of', 'country_ID': 'FSM', 'iso2': 'FM', country_use: false});
            Country.create({'country': 'Moldova, Republic of', 'country_ID': 'MDA', 'iso2': 'MD'});
            Country.create({'country': 'Monaco', 'country_ID': 'MCO', 'iso2': 'MC', country_use: false});
            Country.create({'country': 'Mongolia', 'country_ID': 'MNG', 'iso2': 'MN'});
            Country.create({'country': 'Montenegro', 'country_ID': 'MNE', 'iso2': 'ME'});
            Country.create({'country': 'Montserrat', 'country_ID': 'MSR', 'iso2': 'MS', country_use: false});
            Country.create({'country': 'Morocco', 'country_ID': 'MAR', 'iso2': 'MA'});
            Country.create({'country': 'Mozambique', 'country_ID': 'MOZ', 'iso2': 'MZ'});
            Country.create({'country': 'Myanmar', 'country_ID': 'MMR', 'iso2': 'MM'});
            Country.create({'country': 'Namibia', 'country_ID': 'NAM', 'iso2': 'NA'});
            Country.create({'country': 'Nauru', 'country_ID': 'NRU', 'iso2': 'NR', country_use: false});
            Country.create({'country': 'Nepal', 'country_ID': 'NPL', 'iso2': 'NP'});
            Country.create({'country': 'Netherlands', 'country_ID': 'NLD', 'iso2': 'NL'});
            Country.create({'country': 'New Caledonia', 'country_ID': 'NCL', 'iso2': 'NC', country_use: false});
            Country.create({'country': 'New Zealand', 'country_ID': 'NZL', 'iso2': 'NZ'});
            Country.create({'country': 'Nicaragua', 'country_ID': 'NIC', 'iso2': 'NI'});
            Country.create({'country': 'Niger', 'country_ID': 'NER', 'iso2': 'NE'});
            Country.create({'country': 'Nigeria', 'country_ID': 'NGA', 'iso2': 'NG'});
            Country.create({'country': 'Niue', 'country_ID': 'NIU', 'iso2': 'NU', country_use: false});
            Country.create({'country': 'Norfolk Island', 'country_ID': 'NFK', 'iso2': 'NF', country_use: false});
            Country.create({'country': 'Northern Mariana Islands', 'country_ID': 'MNP', 'iso2': 'MP', country_use: false});
            Country.create({'country': 'Norway', 'country_ID': 'NOR', 'iso2': 'NO'});
            Country.create({'country': 'Oman', 'country_ID': 'OMN', 'iso2': 'OM'});
            Country.create({'country': 'Pakistan', 'country_ID': 'PAK', 'iso2': 'PK'});
            Country.create({'country': 'Palau', 'country_ID': 'PLW', 'iso2': 'PW', country_use: false});
            Country.create({'country': 'Palestine, State of', 'country_ID': 'PSE', 'iso2': 'PS'});
            Country.create({'country': 'Panama', 'country_ID': 'PAN', 'iso2': 'PA'});
            Country.create({'country': 'Papua New Guinea', 'country_ID': 'PNG', 'iso2': 'PG'});
            Country.create({'country': 'Paraguay', 'country_ID': 'PRY', 'iso2': 'PY'});
            Country.create({'country': 'Peru', 'country_ID': 'PER', 'iso2': 'PE'});
            Country.create({'country': 'Philippines', 'country_ID': 'PHL', 'iso2': 'PH'});
            Country.create({'country': 'Pitcairn', 'country_ID': 'PCN', 'iso2': 'PN', country_use: false});
            Country.create({'country': 'Poland', 'country_ID': 'POL', 'iso2': 'PL'});
            Country.create({'country': 'Portugal', 'country_ID': 'PRT', 'iso2': 'PT'});
            Country.create({'country': 'Puerto Rico', 'country_ID': 'PRI', 'iso2': 'PR'});
            Country.create({'country': 'Qatar', 'country_ID': 'QAT', 'iso2': 'QA'});
            Country.create({'country': 'Reunion', 'country_ID': 'REU', 'iso2': 'RE', country_use: false});
            Country.create({'country': 'Romania', 'country_ID': 'ROU', 'iso2': 'RO'});
            Country.create({'country': 'Russian Federation', 'country_ID': 'RUS', 'iso2': 'RU'});
            Country.create({'country': 'Rwanda', 'country_ID': 'RWA', 'iso2': 'RW'});
            Country.create({'country': 'Saint Barthelemy', 'country_ID': 'BLM', 'iso2': 'BL', country_use: false});
            Country.create({'country': 'Saint Helena, Ascension and Tristan da Cunha', 'country_ID': 'SHN', 'iso2': 'SH', country_use: false});
            Country.create({'country': 'Saint Kitts and Nevis', 'country_ID': 'KNA', 'iso2': 'KN', country_use: false});
            Country.create({'country': 'Saint Lucia', 'country_ID': 'LCA', 'iso2': 'LC', country_use: false});
            Country.create({'country': 'Saint Martin (French part)', 'country_ID': 'MAF', 'iso2': 'MF', country_use: false});
            Country.create({'country': 'Saint Pierre and Miquelon', 'country_ID': 'SPM', 'iso2': 'PM', country_use: false});
            Country.create({'country': 'Saint Vincent and the Grenadines', 'country_ID': 'VCT', 'iso2': 'VC', country_use: false});
            Country.create({'country': 'Samoa', 'country_ID': 'WSM', 'iso2': 'WS', country_use: false});
            Country.create({'country': 'San Marino', 'country_ID': 'SMR', 'iso2': 'SM', country_use: false});
            Country.create({'country': 'Sao Tome and Principe', 'country_ID': 'STP', 'iso2': 'ST'});
            Country.create({'country': 'Saudi Arabia', 'country_ID': 'SAU', 'iso2': 'SA'});
            Country.create({'country': 'Senegal', 'country_ID': 'SEN', 'iso2': 'SN'});
            Country.create({'country': 'Serbia', 'country_ID': 'SRB', 'iso2': 'RS'});
            Country.create({'country': 'Seychelles', 'country_ID': 'SYC', 'iso2': 'SC'});
            Country.create({'country': 'Sierra Leone', 'country_ID': 'SLE', 'iso2': 'SL'});
            Country.create({'country': 'Singapore', 'country_ID': 'SGP', 'iso2': 'SG'});
            Country.create({'country': 'Sint Maarten (Dutch part)', 'country_ID': 'SXM', 'iso2': 'SX', country_use: false});
            Country.create({'country': 'Slovakia', 'country_ID': 'SVK', 'iso2': 'SK'});
            Country.create({'country': 'Slovenia', 'country_ID': 'SVN', 'iso2': 'SI'});
            Country.create({'country': 'Solomon Islands', 'country_ID': 'SLB', 'iso2': 'SB', country_use: false});
            Country.create({'country': 'Somalia', 'country_ID': 'SOM', 'iso2': 'SO'});
            Country.create({'country': 'South Africa', 'country_ID': 'ZAF', 'iso2': 'ZA'});
            Country.create({'country': 'South Georgia and the South Sandwich Islands', 'country_ID': 'SGS', 'iso2': 'GS', country_use: false});
            Country.create({'country': 'Spain', 'country_ID': 'ESP', 'iso2': 'ES'});
            Country.create({'country': 'Sri Lanka', 'country_ID': 'LKA', 'iso2': 'LK'});
            Country.create({'country': 'Sudan', 'country_ID': 'SDN', 'iso2': 'SD'});
            Country.create({'country': 'Suriname', 'country_ID': 'SUR', 'iso2': 'SR'});
            Country.create({'country': 'South Sudan', 'country_ID': 'SSD', 'iso2': 'SS'});
            Country.create({'country': 'Svalbard and Jan Mayen', 'country_ID': 'SJM', 'iso2': 'SJ', country_use: false});
            Country.create({'country': 'Swaziland', 'country_ID': 'SWZ', 'iso2': 'SZ'});
            Country.create({'country': 'Sweden', 'country_ID': 'SWE', 'iso2': 'SE'});
            Country.create({'country': 'Switzerland', 'country_ID': 'CHE', 'iso2': 'CH'});
            Country.create({'country': 'Syrian Arab Republic', 'country_ID': 'SYR', 'iso2': 'SY'});
            Country.create({'country': 'Taiwan, Province of China', 'country_ID': 'TWN', 'iso2': 'TW'});
            Country.create({'country': 'Tajikistan', 'country_ID': 'TJK', 'iso2': 'TJ'});
            Country.create({'country': 'Tanzania, United Republic of', 'country_ID': 'TZA', 'iso2': 'TZ'});
            Country.create({'country': 'Thailand', 'country_ID': 'THA', 'iso2': 'TH'});
            Country.create({'country': 'Timor-Leste', 'country_ID': 'TLS', 'iso2': 'TL'});
            Country.create({'country': 'Togo', 'country_ID': 'TGO', 'iso2': 'TG'});
            Country.create({'country': 'Tokelau', 'country_ID': 'TKL', 'iso2': 'TK', country_use: false});
            Country.create({'country': 'Tonga', 'country_ID': 'TON', 'iso2': 'TO', country_use: false});
            Country.create({'country': 'Trinidad and Tobago', 'country_ID': 'TTO', 'iso2': 'TT'});
            Country.create({'country': 'Tunisia', 'country_ID': 'TUN', 'iso2': 'TN'});
            Country.create({'country': 'Turkey', 'country_ID': 'TUR', 'iso2': 'TR'});
            Country.create({'country': 'Turkmenistan', 'country_ID': 'TKM', 'iso2': 'TM'});
            Country.create({'country': 'Turks and Caicos Islands', 'country_ID': 'TCA', 'iso2': 'TC', country_use: false});
            Country.create({'country': 'Tuvalu', 'country_ID': 'TUV', 'iso2': 'TV', country_use: false});
            Country.create({'country': 'Uganda', 'country_ID': 'UGA', 'iso2': 'UG'});
            Country.create({'country': 'Ukraine', 'country_ID': 'UKR', 'iso2': 'UA'});
            Country.create({'country': 'United Arab Emirates', 'country_ID': 'ARE', 'iso2': 'AE'});
            Country.create({'country': 'United Kingdom', 'country_ID': 'GBR', 'iso2': 'GB'});
            Country.create({'country': 'United States', 'country_ID': 'USA', 'iso2': 'US'});
            Country.create({'country': 'United States Minor Outlying Islands', 'country_ID': 'UMI', 'iso2': 'UM', country_use: false});
            Country.create({'country': 'Uruguay', 'country_ID': 'URY', 'iso2': 'UY'});
            Country.create({'country': 'Uzbekistan', 'country_ID': 'UZB', 'iso2': 'UZ'});
            Country.create({'country': 'Vanuatu', 'country_ID': 'VUT', 'iso2': 'VU', country_use: false});
            Country.create({'country': 'Venezuela, Bolivarian Republic of', 'country_ID': 'VEN', 'iso2': 'VE'});
            Country.create({'country': 'Viet Nam', 'country_ID': 'VNM', 'iso2': 'VN'});
            Country.create({'country': 'Virgin Islands, British', 'country_ID': 'VGB', 'iso2': 'VG', country_use: false});
            Country.create({'country': 'Virgin Islands, U.S.', 'country_ID': 'VIR', 'iso2': 'VI', country_use: false});
            Country.create({'country': 'Wallis and Futuna', 'country_ID': 'WLF', 'iso2': 'WF', country_use: false});
            Country.create({'country': 'Western Sahara', 'country_ID': 'ESH', 'iso2': 'EH', country_use: false});
            Country.create({'country': 'Yemen', 'country_ID': 'YEM', 'iso2': 'YE'});
            Country.create({'country': 'Zambia', 'country_ID': 'ZMB', 'iso2': 'ZM'});
            Country.create({'country': 'Zimbabwe', 'country_ID': 'ZWE', 'iso2': 'ZW'});
        }
    });
}

exports.createDefaultCountries = createDefaultCountries;
