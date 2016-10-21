'use strict';
var mongoose        = require('mongoose');
require('mongoose-html-2').loadType(mongoose);

var resourceSchema, Resource,
    logger          = require('../logger/logger'),
    Schema          = mongoose.Schema,
    //ObjectId        = mongoose.Schema.Types.ObjectId,
    Html            = mongoose.Types.Html,
    type_enu = {
        values: 'faq resource'.split(' '),
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
        required: '{PATH} is required'},
    order: {
        type: Number,
        required: '{PATH} is required'}
});

Resource = mongoose.model('Resource', resourceSchema);

function createDefaultResources() {
    Resource.find({}).exec(function (err, resources) {
        if (resources.length === 0) {
            Resource.create({
                type: 'resource',
                head: 'Videos',
                order: 1,
                body: '<p>These videos are part of an online course jointly produced by NRGI, the Columbia Center on Sustainable Investment, the World Bank and the United Nations Sustainable Development Solutions Network. These videos can be accessed via the link provided below.</p>' +
                '<p><b>N.B.</b> These videos are available only for your personal, non-commercial use. IT IS NOT PERMITTED to copy, reference, reproduce, republish, post, distribute, transmit or modify in any way all or any part of these videos.</p>' +
                '<ul>' +
                '<li><a href="https://youtu.be/NgQrB1y-Umo">The Decision Chain of Natural Resource Management (I)</a></li>' +
                '<li><a href="https://youtu.be/GfvFCr7cq4w">The Decision Chain of Natural Resource Management (II)</a></li>' +
                '<li><a href="https://youtu.be/Eg0wEUuHin0">Transparency and Accountability</a></li>' +
                '<li><a href="https://www.youtube.com/watch?v=GyKoXGEvRH4&feature=youtu.be">International Governance Initiatives</a></li>' +
                '<li><a href="https://youtu.be/3EwMmIwiEDg">Legal and Regulatory Frameworks</a></li>' +
                '<li><a href="https://youtu.be/Bwo8Qz_8fiA">Allocation of Rights</a></li>' +
                '<li><a href="https://youtu.be/MSkBgh0Jm88">State-Owned Enterprise</a></li>' +
                '<li><a href="https://youtu.be/XrZzN0brJUw">Resource Economics</a></li>' +
                '<li><a href="https://youtu.be/I-d7wT4vpB8">Fiscal Regime Types</a></li>' +
                '<li><a href="https://youtu.be/K8rjalnRfl0">Challenges of Revenue Management</a></li>' +
                '<li><a href="https://youtu.be/b889pyPxE0k">Policy Responses</a></li>' +
                '<li><a href="https://youtu.be/ReHnLGoyle0">Revenue Sharing and Decentralization</a></li>' +
                '</ul>'
            });
            Resource.create({
                type: 'resource',
                head: 'General readings',
                order: 2,
                body: '<ul>' +
                '<li><a href="http://www.eisourcebook.org/602_Chapters.html">EI Sourcebook</a></li>' +
                '<li><a href="http://www.resourcegovernance.org/analysis-tools/publications/natural-resource-charter-2nd-ed">NRGI, Natural Resource Charter</a></li>' +
                '<li><a href="http://www.resourcegovernance.org/sites/default/files/nrgi_Legal-Framework.pdf">NRGI Reader: Legal Framework</a></li>' +
                '<li><a href="http://www.resourcegovernance.org/sites/default/files/nrgi_NRC-Decision-Chain.pdf">NRGI Reader: The Natural Resource Charter Decision Chain</a></li>' +
                '<li><a href="http://www.resourcegovernance.org/sites/default/files/nrgi_Resource-Curse.pdf">NRGI Reader: The Resource Curse</a></li>' +
                '<li><a href="http://www.resourcegovernance.org/resource-governance-index">NRGI, Resource Governance Index 2013: Report</a></li>' +
                '<li><a href="http://www.lexadin.nl/wlg/legis/nofr/legis.php">The World Law Guide</a></li>' +
                '<li>World Bank Africa Region Working Paper No. 125 (2009), <a href="http://siteresources.worldbank.org/INTOGMC/Resources/ei_for_development_3.pdf"><em>Extractive Industries Value Chain: A Comprehensive Integrated Approach to Developing Extractive Industries</em></a>, pp. 1-22.</li>' +
                '</ul>'
            });
            Resource.create({
                type: 'resource',
                head: 'Precept 2: Accountability and Transparency',
                order: 3,
                body: '<ul>' +
                '<li><a href="http://www.resourcegovernance.org/sites/default/files/RWI-Contracts-Confidential.pdf">NRGI, Contracts Confidential</a></li>' +
                '<li><a href="http://www.resourcegovernance.org/sites/default/files/nrgi_Contract-Transparency.pdf">NRGI Reader: Contract Transparency</a></li>' +
                '<li><a href="http://www.resourcegovernance.org/sites/default/files/nrgi_EITI.pdf">NRGI Reader: The Extractive Industry Transparency Initiative</a></li>' +
                '<li><a href="http://www.resourcegovernance.org/sites/default/files/nrgi_Transparency-Mechanisms.pdf">NRGI Reader: Transparency Mechanisms and Movements</a></li>' +
                '<li><a href="https://opengovdata.org/">The 8 Principles of Open Government Data</a></li>' +
                '</ul>'
            });
            Resource.create({
                type: 'resource',
                head: 'Precept 3: Exploration and license allocation',
                order: 4,
                body: '<ul>' +
                '<li>EI Sourcebook, <a href="http://www.eisourcebook.org/650_55TheAwardofContractsandLicenses.html"><em>Competitive Bidding of Mineral Rights</em></a> and the <a href="http://www.eisourcebook.org/">EI Sourcebook</a></li>' +
                '<li>Girones, Enrique. Alexandra Pigachevsky and Gotthard Walser (2009). <a href="http://www-wds.worldbank.org/external/default/WDSContentServer/WDSP/IB/2009/05/22/000333038_20090522005022/Rendered/PDF/486090NWP0extr10Box338915B01PUBLIC1.pdf"><em>Mineral Rights Cadastre: Promoting Transparent Access to Mineral Resources</em></a>. World Bank, 2009. Available in English, French and Spanish <a href="http://documents.worldbank.org/curated/en/2009/06/10587371/mineral-rights-cadastre-promoting-transparent-access-mineral-resources">here</a></li>' +
                '<li>NRGI, ISLP, VCC & OpenOil (2014), <a href="https://eiti.org/files/mining-contracts-how-to-read-and-understand-them.pdf"><em>Mining contracts: How to read and understand them</em></a></li>' +
                '<li><a href="http://www.resourcegovernance.org/sites/default/files/nrgi_Granting-Rights.pdf">NRGI Reader: Granting Rights to Natural Resources</a></li>' +
                '<li>Tordo, Silvano, David Johnston, and Daniel Johnston (2009). <a href="http://documents.worldbank.org/curated/en/2009/11/11817500/petroleum-exploration-production-rights-allocation-strategies-design-issues"><em>Petroleum Exploration and Production Rights: Allocation Strategies and Design Issues</em></a>. World Bank Working Paper no. 179.</li>' +
                '</ul>'
            });
            Resource.create({
                type: 'resource',
                head: 'Precept 4: Taxation and payments',
                order: 5,
                body: '<ul>' +
                '<li>Bauer, Andrew and Quiroz, Juan Carlos (2013), Chapter 15: Resource Governance, <a href="http://aea-al.org/wp-content/uploads/2014/10/The-Handbook-of-Global-Energy-Policy.pdf"><em>The Handbook of Global Energy Policy</em></a>, Wiley-Blackwell, pp. 244-262</li>' +
                '<li>Calder, Jack (2014), <a href="http://www.agora-parl.org/sites/default/files/administeringfiscalregimesforei.pdf"><em>Administering Fiscal Regimes for Extractive Industries – A Handbook</em></a>. International Monetary Fund</li>' +
                '<li>IMF (2012), <a href="(https://www.imf.org/external/np/pp/eng/2012/081512.pdf"><em>Fiscal Regimes for Extractive Industries: Design and Implementation</em></a>. Edited by Daniel, P., Keen, M., McPherson, C. pp. 242-262</li>' +
                '<li>Land, Bryan (2010), "Resource rent taxes: a re-appraisal”, <a href="https://www.international-arbitration-attorney.com/wp-content/uploads/arbitrationlaw1394930.pdf"><em>The Taxation of Petroleum and Minerals: Principles, Problem and Practice</em></a></li>' +
                '<li><a href="http://www.resourcegovernance.org/sites/default/files/nrgi_Fiscal-Regime-Design.pdf">NRGI Reader: Fiscal Regime Design</a></li>' +
                '<li><a href="http://www.resourcegovernance.org/sites/default/files/nrgi_Fiscal-Rules-and-NRFs.pdf">NRGI Reader: Fiscal Rules and Natural Resource Funds</a></li>' +
                '</ul>'
            });
            Resource.create({
                type: 'resource',
                head: 'Precept 5: Local effects',
                order: 6,
                body: '<ul>' +
                '<li><a href="http://www.ifc.org/wps/wcm/connect/115482804a0255db96fbffd1a5d13d27/PS_English_2012_Full-Document.pdf?MOD=AJPERES">IFC Performance Standards</a></li>' +
                '</ul>'
            });
            Resource.create({
                type: 'resource',
                head: 'Precept 6: Nationally owned resource companies',
                order: 7,
                body: '<ul>' +
                '<li>Heller, P.R.P, Paasha Mahdavi and Johannes Schreuder (2014), <a href="http://www.resourcegovernance.org/sites/default/files/NRGI_9Recs_Web.pdf"><em>Reforming National Oil Companies: Nine Recommendations</em></a>. NRGI</li>' +
                '<li>Marcel, V. (ed.) (2015), <a href="http://www.chathamhouse.org/publication/oil-gas-good-governance-guidelines"><em>Guidelines for Good Governance in Emerging Oil and Gas Producers</em></a>. Chatham House Research Paper</li>' +
                '<li><a href="http://www.resourcegovernance.org/sites/default/files/nrgi_State-Participation-and-SOEs.pdf">NRGI Reader: State Participation and State-Owned Enterprises</a></li>' +
                '</ul>'
            });
            Resource.create({
                type: 'resource',
                head: 'Precept 7: Revenue distribution',
                order: 8,
                body: '<ul>' +
                '<li>Bauer, Andrew (2012), <a href="http://www.resourcegovernance.org/sites/default/files/Sub_Oil_Gas_Mgmt_20151125.pdf"><em>Subnational Oil, Gas and Mineral Revenue Management</em></a>. NRGI</li>' +
                '<li>Calder, Jack (2014), <a href="http://www.agora-parl.org/sites/default/files/administeringfiscalregimesforei.pdf"><em>Administering Fiscal Regimes for Extractive Industries – A Handbook</em></a>. IMF</li>' +
                '<li>IMF (2007), <a href="https://www.imf.org/external/np/pp/2007/eng/101907m.pdf"><em>The Manual on Fiscal Transparency</em></a>. IMF</li>' +
                '<li>Javier Arellano-Yanguas and Andrés Mejía-Acosta (2014), <a href="http://www.unrisd.org/arellano-acosta"><em>Extractive Industries, Revenue Allocation and Local Politics</em></a>. United Nations Research Institute for Social Development Working Paper</li>' +
                '<li>NRGI-CCSI (2014), "Natural Resource Fund Governance: The Essentials", <a href="http://www.resourcegovernance.org/sites/default/files/NRF_Complete_Report_EN.pdf"><em>Managing the public trust: How to make natural resource funds work for citizens</em></a>. NRGI</li>' +
                '<li><a href="http://www.resourcegovernance.org/sites/default/files/nrgi_Subnational-Distribution.pdf">NRGI Reader: Revenue Distribution</a></li>' +
                '<li><a href="http://www.resourcegovernance.org/sites/default/files/nrgi_Revenue-Management.pdf">NRGI Reader: Revenue Management and Distribution</a></li>' +
                '<li><a href="http://www.resourcegovernance.org/sites/default/files/nrgi_Subnational-Revenue-Management.pdf">NRGI Reader: Subnational Revenue Management</a></li>' +
                '</ul>'
            });
            Resource.create({
                type: 'resource',
                head: 'Precept 8: Revenue volatility',
                order: 9,
                body: '<ul>' +
                '<li>Calder, Jack (2014), <a href="http://www.agora-parl.org/sites/default/files/administeringfiscalregimesforei.pdf"><em>Administering Fiscal Regimes for Extractive Industries – A Handbook</em></a>. IMF</li>' +
                '<li>Frankel, Jeffrey (2011), "How Can Commodity Exporters Make Fiscal and Monetary Policy Less Procyclical?", <a href="https://notendur.hi.is/gylfason/Beyond_the_Curse_Arezki_Gylfason_Sy.pdf"><em>Beyond the Curse: Policies to Harness the Power of Natural Resources</em></a>, (eds. Rabah Arezki, Thorvaldur Gylfason and Amadou Sy). IMF. pp. 167-180</li>' +
                '<li>Hamilton, Kirk, and Eduardo Ley (2011) “Sustainable Fiscal Policy for Mineral-Based Economies”, <a href="https://notendur.hi.is/gylfason/Beyond_the_Curse_Arezki_Gylfason_Sy.pdf"><em>Beyond the Curse: Policies to Harness the Power of Natural Resources</em></a>, (eds. Rabah Arezki, Thorvaldur Gylfason and Amadou Sy). IMF. pp. 131-147</li>' +
                '<li>IMF (2012), <a href="http://www.imf.org/external/np/pp/eng/2012/082412.pdf">Macroeconomic Policy Frameworks for Resource-Rich Developing Countries</a>. IMF</li>' +
                '<li>NRGI-CCSI (2014), "Natural Resource Fund Governance: The Essentials", <a href="http://www.resourcegovernance.org/sites/default/files/NRF_Complete_Report_EN.pdf"><em>Managing the public trust: How to make natural resource funds work for citizens</em></a>. NRGI</li>' +
                '</ul>'
            });
            Resource.create({
                type: 'faq',
                head: 'How should I approach a question I do not understand?',
                order: 1,
                body: 'NRGI has prepared a detailed guidance note for each question of the questionnaire. When attempting to answer a question, a second tab entitled “Guidance note” exists behind the question tab. Click on this tab and you will find a detailed explanation of the relevance of a question, including definitions of key terms and an indication of where to look for evidence and how to answer.'
            });
            Resource.create({
                type: 'faq',
                head: 'What if I am unable to find a law in response to a de jure question?',
                order: 2,
                body: 'In order to fully answer a <em>de jure</em> question where no law exists on the topic of the question, begin by providing a step-by-step guide that explains where you have looked for evidence. This includes uploading the relevant selection of laws consulted, and indicating where in these texts no information was found. Additional sources of information, such as interviews, third-party reports and media sources are also welcome, but as secondary sources of information after the relevant laws have already been consulted.'
            });
            Resource.create({
                type: 'faq',
                head: 'What do I do if any aspect of the tool software stops functioning correctly?',
                order: 3,
                body: 'When logging into the online tool, in the upper right hand corner, click on the <b>RGI Assessment Tool</b> dropdown, and then click on <b>Technical Assistance</b>. Please complete the form on the <a href="http://rgi-staging.nrgi-assessment.org/contact">Technical Assistance</a> page to report your issue to the RGI tool software developer.'
            });
            Resource.create({
                type: 'faq',
                head: 'How do I create a PDF?',
                order: 4,
                body: 'The easiest way is to convert a webpage to a pdf document is to print to PDF. To print to PDF, select **File > Print** or press <b>Ctrl+P</b>. Then from the printers available, select <b>Save as PDF</b>, <b>Microsoft Print to PDF</b> or other. Afterwards, click on <b>Print</b> and choose where you would like to save your PDF file.'
            });
            Resource.create({
                type: 'faq',
                head: 'What should I do if I forget my login details or password?',
                order: 5,
                body: 'If you forget your password, go to the RGI Assessment <a href="http://rgi-staging.nrgi-assessment.org/">homepage</a>, click on the button in the top right-hand corner called <b>Forgot Password</b>. This will take you to a <a href="http://rgi-staging.nrgi-assessment.org/recover-password">password recovery page</a> where you simply need to enter your email address and you will be sent an email to recover your password.'
            });
            Resource.create({
                type: 'faq',
                head: 'What do I do if I cannot reach my assigned NRGI staff membercountry coordinator?',
                order: 6,
                body: 'If your country coordinator is away for a long period of time, before leaving they will assign you a different coordinator to guide you through the process whilst they are away. Always pay very close attention to all emails from NRGI, as missing this information may mean the difference between receiving a prompt response to your query, or a delayed response.'
            });
            Resource.create({
                type: 'faq',
                head: 'Can I modify my answer once I have submitted it?',
                order: 7,
                body: 'Once you have submitted your assessment, you cannot return to your answers to edit them. When working on an answer, clicking on <b>Save Answer</b> will save your progress but the question will not be marked as complete and you can return to your work at a later date. By selecting **Mark complete**, your question will be marked as complete on the assessment homepage, but you can still return to your answer if you have not submitted your full assessment. If you are unsure whether your answer is complete, click on <b>Save answer</b> rather than <b>Mark complete</b>.'
            });
            Resource.create({
                type: 'faq',
                head: 'When can I use an interview as a source of evidence?',
                order: 8,
                body: 'Interviews should only be used to inquire about where publicly available information can be found. Where an interviewee provides a consultant with information on where information can be acquired, the consultant should reference the original source of information as the primary source of evidence, with the interview justification as a secondary source of evidence.'
            });
            Resource.create({
                type: 'faq',
                head: 'How do I upload an interview as evidence?',
                order: 9,
                body: 'Interviews can be recorded as a type of reference in the assessment tool. When entering a new interview as a reference, the tool will ask you for basic contact details for your interviewee, which you are required to include but that will not be made public (i.e. all interviewees will remain anonymous). If you fail to include these details, or include incorrect contact details, for example to preserve an interviewee’s identity, your interview will not be included as a reference and you will be required to answer the question again.'
            });
            logger.log('Resources created...');
        }
    });
}

exports.createDefaultResources = createDefaultResources;