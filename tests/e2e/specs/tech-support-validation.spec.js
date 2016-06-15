(function(){
  'use strict';

  describe('Tech Support Form Validation', function() {
    beforeEach(function() {
      browser.driver.get(browser.baseUrl + '/');
      element(by.linkText('RGI Technical assistance')).click();

      setFieldContent('request.first_name', 'Chris');
      setFieldContent('request.last_name', 'Perry');
      setFieldContent('request.email', 'cperry@mail.com');
      setFieldContent('request.issue_description', 'That is my issue description');
    });

    var
        checkButtonEnabled = function(enabled) {
          expect(element(by.buttonText('Send request')).isEnabled()).toEqual(enabled);
        },
        setFieldContent = function(modelName, content) {
          var field = element(by.model(modelName));

          field.clear().then(function() {
            field.sendKeys(content);
          });
        };

    it('activates the submit button if all required fields are set', function() {
      checkButtonEnabled(true);
    });

    it('disables the submit button if the first name is not set', function() {
      setFieldContent('request.first_name', '');
      checkButtonEnabled(false);
    });

    it('disables the submit button if the last name is not set', function() {
      setFieldContent('request.last_name', '');
      checkButtonEnabled(false);
    });

    it('disables the submit button if the email is not set', function() {
      setFieldContent('request.email', '');
      checkButtonEnabled(false);
    });

    it('disables the submit button if the issue description is not set', function() {
      setFieldContent('request.issue_description', '');
      checkButtonEnabled(false);
    });
  });
})();
