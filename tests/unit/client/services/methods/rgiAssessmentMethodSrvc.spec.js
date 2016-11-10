'use strict';

describe('rgiAssessmentMethodSrvc', function () {
    beforeEach(module('app'));

    var rgiAssessmentMethodSrvc, rgiAssessmentSrvc, rgiResourceProcessorSrvc,
        stubs = {}, spies = {};

    beforeEach(inject(function (_rgiAssessmentMethodSrvc_, _rgiAssessmentSrvc_, _rgiResourceProcessorSrvc_) {
        rgiAssessmentSrvc = _rgiAssessmentSrvc_;
        rgiAssessmentMethodSrvc = _rgiAssessmentMethodSrvc_;
        rgiResourceProcessorSrvc = _rgiResourceProcessorSrvc_;
        stubs = {};
    }));

    describe('#createAssessment', function () {
        var RESULT, ACTION = 'create', ASSESSMENTS_DATA = {data: 'dummy', length: 7};

        beforeEach(function() {
            spies.resourceProcessorProcess = sinon.spy(function() {
                return ACTION;
            });

            stubs.resourceProcessorProcess = sinon.stub(rgiResourceProcessorSrvc, 'process',
                spies.resourceProcessorProcess);

            RESULT = rgiAssessmentMethodSrvc.createAssessment(ASSESSMENTS_DATA);
        });

        it('submits the data to the back end', function() {
            spies.resourceProcessorProcess.called.should.be.equal(true);
        });

        it('submit length of the collection', function() {
            spies.resourceProcessorProcess.args[0][0].length.should.be.equal(ASSESSMENTS_DATA.length);
        });

        it('saves the data', function() {
            spies.resourceProcessorProcess.args[0][1].should.be.equal('$save');
        });

        it('returns result of the processing', function() {
            RESULT.should.be.equal(ACTION);
        });
    });

    describe('#updateAssessment', function () {
        var RESULT, ACTION = 'update', ASSESSMENT = 'assessment';

        beforeEach(function() {
            spies.resourceProcessorProcess = sinon.spy(function() {
                return ACTION;
            });

            stubs.resourceProcessorProcess = sinon.stub(rgiResourceProcessorSrvc, 'process',
                spies.resourceProcessorProcess);

            RESULT = rgiAssessmentMethodSrvc.updateAssessment(ASSESSMENT);
        });

        it('submits the assessment for further processing', function() {
            spies.resourceProcessorProcess.withArgs(ASSESSMENT, '$update').called.should.be.equal(true);
        });

        it('returns result of the processing', function() {
            RESULT.should.be.equal(ACTION);
        });
    });

    describe('#deleteAssessment', function () {
        it('submits the assessment for further processing', function() {
            spies.resourceProcessorDelete = sinon.spy();
            stubs.resourceProcessorDelete = sinon.stub(rgiResourceProcessorSrvc, 'delete',
                spies.resourceProcessorDelete);

            var ID = 'assessment id';
            rgiAssessmentMethodSrvc.deleteAssessment(ID);
            spies.resourceProcessorDelete.withArgs(rgiAssessmentSrvc, ID, 'assessment_ID').called.should.be.equal(true);
        });
    });

    afterEach(function() {
        Object.keys(stubs).forEach(function(stubName) {
            stubs[stubName].restore();
        });
    });
});
