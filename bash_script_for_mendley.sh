echo 'hello'

#     // var oauth2  = require('simple-oauth2');
#     // var token;
#     // var credentials = {
#     //     clientID: 1560,
#     //     clientSecret: 'chBcJvsqMHLoD8mF',
#     //     site: 'https://api.mendeley.com'
#     // };

#     // // Initialize the OAuth2 Library
#     // var oauth = oauth2(credentials);
#     //  // Save the access token
#     // function saveToken(err, res) {
#     //     if (err) { console.log('Access Token Error', err.message); }
#     //     token = oauth.accessToken.create(res);
#     //     req.session.token = token.token;
#     // }
#     // Get the access token object for the client
#     // oauth.client.getToken({}, saveToken);














# rgi_test
# chBcJvsqMHLoD8mF


# upload file

# // authorize
# token=$(curl -X POST -H "Content-Type: application/x-www-form-urlencoded" -u 1560:chBcJvsqMHLoD8mF -d "grant_type=client_credentials&scope=all" https://api.mendeley.com/oauth/token | python -c 'import json,sys;obj=json.load(sys.stdin);print obj["access_token"]')

# // get file hash    
# filename=bolivia-OCR.pdf
# filehash=`openssl dgst -sha1 $filename | sed 's/^.*= //'` 

# // check file exist
# curl -H "Authorization: Bearer "$token "https://api.mendeley.com/catalog?filehash=$filehash"

# // if yes use response data to populate $scope.new_citation

# // if no upload doc and use response data to populate $scope.new_citation
# curl 'https://api.mendeley.com/documents' \
#         -X POST \
#         -H 'Authorization: Bearer '$token 
#         -H 'Content-Type: application/pdf' \
#         -H 'Content-Disposition: attachment; filename=$filename' 
#         --data-binary @$filename

# // use form to authenticate and add data
#  UserDocument {
#         *profile_id (string, optional), "117d57dd-454d-3a22-9af0-f701e7e7ca0f" chris perry profile id
#         *group_id (string, optional), "3ab6eba8-b370-3148-ae58-7d808ad4ac57" NRGI group id
#         *last_modified (string, optional), ***pass from extraction
#         *tags (array[string], optional), ***From keywords
#         ?citation_key (string, optional),
#         *source_type (string, optional), *** from file extension
#         *language (string, optional), ***user generated
#         *short_title (string, optional), ***user generated
#         *country (string, optional),
#         ?translators (array[Person], optional),
#         *series_editor (string, optional),
#         *code (string, optional), Code for legal docs  ***user generated

#         *type (com.mendeley.documents.api.DocumentType) = ['journal' or 'book' or 'generic' or 'book_section' or 'conference_proceedings' or 'working_paper' or 'report' or 'web_page' or 'thesis' or 'magazine_article' or 'statute' or 'patent' or 'newspaper_article' or 'computer_program' or 'hearing' or 'television_broadcast' or 'encyclopedia_article' or 'case' or 'film' or 'bill'],
#         *month (integer, optional), publish month 1-12  ***user generated
#         *year (integer, optional), ***user confirmed from extraction
#         *day (integer, optional), publish dat 1-31  ***user generated
#         *title (string), ***user confirmed from extraction
#         *authors (array[Person], optional), ***user confirmed from extraction
#         *keywords (array[string], optional), ***user confirmed from extraction
#         *pages (string, optional), ***user confirmed from extraction
#         *volume (string, optional), ***user generated
#         *issue (string, optional), ***user generated
#         *websites (array[string], optional), original URL ***user generated
#         *publisher (string, optional), ***user confirmed from extraction
#         *city (string, optional), ***user confirmed from extraction
#         *edition (string, optional), ***user confirmed from extraction
#         *institution (string, optional), ***user confirmed from extraction
#         *series (string, optional), ***user confirmed from extraction
#         *chapter (string, optional), ***user confirmed from extraction
#         *editors (array[Person], optional), ***user confirmed from extraction
#         file_attached (boolean, optional), ***true 
#         *revision (string, optional), ***user confirmed from extraction
#         *created (string, optional), ***pass from extraction
#         *identifiers (Map[com.mendeley.documents.api.IdentifierType,java.lang.String], optional), [arxiv, doi, isbn, issn, pmid (PubMed), scopus and ssrn] ***user generated
#         *abstract (string, optional) ***user generated
#     }

#     // update document
#     curl 'https://api.mendeley.com/documents/'$data_from_form[id] \
#         -X PATCH \
#         -H 'Authorization: Bearer '$token \
#         -H 'Content-Type: application/vnd.mendeley-document.1+json' \
#         --data-binary $data_from_form


#     // get file hash
#     // make call to api to see if exists
#     // ////Bash Example
#     // filename=bolivia-OCR.pdf
#     // filehash=`openssl dgst -sha1 $filename | sed 's/^.*= //'` 
#     // curl -H "Authorization: Bearer MSwxNDI1MDU5ODE0NzQzLDI3NTA5OTUzMSwxMDI4LGFsbCwsNzRqcWlHSjN3elhHM2F1UkxaTHhRYzdoZXh3" "https://api.mendeley.com/catalog?filehash=$filehash"

#     // if it exists, pull doc id and insert
#     // EXAMPLE
#     // [
#     //     {
#     //         "id": "0900e5ce-870d-3ce6-b412-f4c54d117e5f",
#     //         "title": "SLUA: Towards Semantic Linking of Users with Actions in Crowdsourcing",
#     //         "type": "conference_proceedings",
#     //         "authors": [
#     //             {
#     //                 "first_name": "Umair",
#     //                 "last_name": "ul Hassan"
#     //             },
#     //             {
#     //                 "first_name": "Sean",
#     //                 "last_name": "O'Riain"
#     //             },
#     //             {
#     //                 "first_name": "Edward",
#     //                 "last_name": "Curry"
#     //             }
#     //         ],
#     //         "year": 2013,
#     //         "source": "International Workshop on Crowdsourcing the Semantic Web",
#     //         "identifiers": {
#     //             "scopus": "2-s2.0-84893588064"
#     //         },
#     //         "keywords": [
#     //             "crowdsourcing",
#     //             "human computation",
#     //             "ontology based information extraction",
#     //             "tasks",
#     //             "users"
#     //         ],
#     //         "link": "http://www.mendeley.com/research/slua-towards-semantic-linking-users-actions-crowdsourcing",
#     //         "abstract": "Recent advances in web technologies allow people to help solve complex problems by performing online tasks in return for money, learning, or fun. At present, human contribution is limited to the tasks defined on individual crowdsourcing platforms. Furthermore, there is a lack of tools and technologies that support matching of tasks with appropriate users, across multiple systems. A more explicit capture of the semantics of crowdsourcing tasks could enable the design and development of matchmaking services between users and tasks. The paper presents the SLUA ontology that aims to model users and tasks in crowdsourcing systems in terms of the relevant actions, capabilities, and rewards. This model describes different types of human tasks that help in solving complex problems using crowds. The paper provides examples of describing users and tasks in some real world systems, with SLUA ontology."
#     //     }
#     // ]

#     If it doesnt exist creat new entry and add it to mendely
#     Post docuemnt
#     curl 'https://api.mendeley.com/documents' \
#         -X POST \
#         -H 'Authorization: Bearer MSwxNDI1MDYzOTE5ODc5LDI3NTA5OTUzMSwxMDI4LGFsbCwsWkdjX3d2alg5LVZBNHhIZUYxTXNhcUV3Qmxr' 
#         -H 'Content-Type: application/pdf' \
#         -H 'Content-Disposition: attachment; filename=$filename' 
#         --data-binary @$filename
#     EXAMPLE Return doc -  use this to pupulate update of record
#     {
#         "id": "e1b446d3-883b-3dab-a9c1-9de5798f421c",
#         "title": "Bolivia Key facts (Territorial, demographic and economic data)",
#         "type": "journal",
#         "keywords":[
#             "Key exports",
#             "gas",
#             "metals",
#             "soya",
#             "sugar",
#             "timber"
#         ],
#         "created": "2015-02-27T18:06:11.000Z",
#         "file_attached": true,
#         "profile_id": "117d57dd-454d-3a22-9af0-f701e7e7ca0f",
#         "last_modified": "2015-02-27T18:06:11.000Z",
#         "abstract": "Population (2010 projection): 10m Territorial area: 1.1m km' (424,164 sq m) Capitals: official — Sucre; administrative -La Paz GDP (Billions of current dollars, 2008): 16 Per capita GDP (2008, in 2000 dollars): 1,173.3 Growth rate of GDP per capita (2008, annual rate of variation): 3.7% Persons living in poverty: 42.4% (2007) and indigence: 16.2% (2007) Income or consumption distribution (Gini Index, 2005-07): 58.2 Real minimum wage (2008; 2000=100): 108.0 Rank in the UNDP Human Development Report index, 2009: 113 (medium human development) Net foreign direct investment (Millions of dollars, 2008): 508"
#     }
#     curl -H "Authorization: Bearer MSwxNDI1MDYzOTE5ODc5LDI3NTA5OTUzMSwxMDI4LGFsbCwsWkdjX3d2alg5LVZBNHhIZUYxTXNhcUV3Qmxr" "https://api.mendeley.com:443/profiles/117d57dd-454d-3a22-9af0-f701e7e7ca0f"
#     {
#         "id": "117d57dd-454d-3a22-9af0-f701e7e7ca0f",
#         "first_name": "Chris",
#         "last_name": "Perry",
#         "display_name": "Chris Perry",
#         "email": "cperry@resourcegovernance.org",
#         "link": "http://www.mendeley.com/profiles/chris-perry7/",
#         "academic_status": "Researcher (at a non-Academic Institution)",
#         "discipline":{"name": "Economics"},
#         "disciplines":[
#             {"name": "Economics"}
#         ],
#         "photo":{
#             "standard": "http://s3.amazonaws.com/mendeley-photos/awaiting.png",
#             "square": "http://s3.amazonaws.com/mendeley-photos/awaiting_square.png"
#         },
#         "photos":[
#             {
#                 "height":120,
#                 "url": "http://s3.amazonaws.com/mendeley-photos/awaiting.png",
#                 "original":false
#             },
#             {
#                 "width":48,
#                 "height":48,
#                 "url": "http://s3.amazonaws.com/mendeley-photos/awaiting_square.png",
#                 "original":false
#             },
#             {
#                 "width":256,
#                 "height":256,
#                 "url": "http://s3.amazonaws.com/mendeley-photos/awaiting_square_256.png",
#                 "original":false
#             }
#         ],
#         "verified":true,
#         "marketing":true,
#         "user_type": "normal",
#         "created": "2015-02-27T16:43:35.000Z"
#     }

#     UserDocument {
#         *profile_id (string, optional), "117d57dd-454d-3a22-9af0-f701e7e7ca0f" chris perry profile id
#         *group_id (string, optional), "3ab6eba8-b370-3148-ae58-7d808ad4ac57" NRGI group id
#         *last_modified (string, optional), ***pass from extraction
#         *tags (array[string], optional), ***From keywords
#         ?citation_key (string, optional),
#         *source_type (string, optional), *** from file extension
#         *language (string, optional), ***user generated
#         *short_title (string, optional), ***user generated
#         *country (string, optional),
#         ?translators (array[Person], optional),
#         *series_editor (string, optional),
#         *code (string, optional), Code for legal docs  ***user generated

#         *type (com.mendeley.documents.api.DocumentType) = ['journal' or 'book' or 'generic' or 'book_section' or 'conference_proceedings' or 'working_paper' or 'report' or 'web_page' or 'thesis' or 'magazine_article' or 'statute' or 'patent' or 'newspaper_article' or 'computer_program' or 'hearing' or 'television_broadcast' or 'encyclopedia_article' or 'case' or 'film' or 'bill'],
#         *month (integer, optional), publish month 1-12  ***user generated
#         *year (integer, optional), ***user confirmed from extraction
#         *day (integer, optional), publish dat 1-31  ***user generated
#         *title (string), ***user confirmed from extraction
#         *authors (array[Person], optional), ***user confirmed from extraction
#         *keywords (array[string], optional), ***user confirmed from extraction
#         *pages (string, optional), ***user confirmed from extraction
#         *volume (string, optional), ***user generated
#         *issue (string, optional), ***user generated
#         *websites (array[string], optional), original URL ***user generated
#         *publisher (string, optional), ***user confirmed from extraction
#         *city (string, optional), ***user confirmed from extraction
#         *edition (string, optional), ***user confirmed from extraction
#         *institution (string, optional), ***user confirmed from extraction
#         *series (string, optional), ***user confirmed from extraction
#         *chapter (string, optional), ***user confirmed from extraction
#         *editors (array[Person], optional), ***user confirmed from extraction
#         file_attached (boolean, optional), ***true 
#         *revision (string, optional), ***user confirmed from extraction
#         *created (string, optional), ***pass from extraction
#         *identifiers (Map[com.mendeley.documents.api.IdentifierType,java.lang.String], optional), [arxiv, doi, isbn, issn, pmid (PubMed), scopus and ssrn] ***user generated
#         *abstract (string, optional) ***user generated
#     }
#     Person {
#         first_name (string, optional),
#         last_name (string)

#         curl 'https://api.mendeley.com/documents/6e456c13-e850-3cf4-9f25-0d8307d36443' \
# -X PATCH \
# -H 'Authorization: Bearer <ACCESS_TOKEN>' \
# -H 'Content-Type: application/vnd.mendeley-document.1+json' \
# --data-binary '{"type": "journal", "title": "How To Build an Awesome Mendeley API"}'
#     