(function(){
  'use strict';

  describe('Edit Profile Name Validation', function() {
    beforeEach(function() {
      browser.driver.get(browser.baseUrl + '/');

      element(by.model('username')).sendKeys('cperry');
      element(by.model('password')).sendKeys('cperry');
      element(by.buttonText('Login')).click();

      element(by.linkText('Chris Perry')).click();
    });

    var validateName = function(description, fieldName, validatedName, buttonEnabled) {
      it(description, function() {
        var field = element(by.name(fieldName));

        field.clear().then(function() {
          field.sendKeys(validatedName);
          expect(element(by.buttonText('Submit')).isEnabled()).toEqual(buttonEnabled);
        });
      });
    };

    validateName('enables the submit button if the first name is valid', 'first_name', 'Anna', true);
    validateName('disables the submit button if the first name is invalid', 'first_name', '123', false);
    validateName('enables the submit button if the last name is valid', 'last_name', 'Maria', true);
    validateName('disables the submit button if the last name is invalid', 'last_name', '@#$', false);

    afterEach(function() {
      element(by.css('[title="Logout"]')).click();
    });
  });
})();
