(function(){
  'use strict';

  describe('Edit User Form Validation', function() {
    var
        checkButtonEnabled = function(enabled) {
          expect(element(by.buttonText('Submit')).isEnabled()).toEqual(enabled);
        },
        fieldValues = [
          {field: 'firstName', value: 'Chris'},
          {field: 'lastName', value: 'Perry'},
          {field: 'title', value: 'Dr.'},
          {field: 'position', value: 'Developer'},
          {field: 'organization', value: 'NRGI'},
          {field: 'username', value: 'cperry'},
          {field: 'email', value: 'cperry@nrgi.com'}
        ],
        fillForm = function(selectType, skipField) {
          fieldValues.forEach(function(fieldValueMap) {
            if(fieldValueMap.field !== skipField) {
              setFieldContent('new_user_data.' + fieldValueMap.field, fieldValueMap.value);
            }
          });

          if(selectType) {
            selectOption('Supervisor');
          }
        },
        selectOption = function(optionText) {
          element(by.cssContainingText('option', optionText)).click();
        },
        setFieldContent = function(modelName, content) {
          var field = element(by.model(modelName));

          field.clear().then(function() {
            field.sendKeys(content);
          });
        },
        test = function(description, buttonEnabled, selectType, skipField) {
          it(description, function() {
            fillForm(selectType, skipField);
            checkButtonEnabled(buttonEnabled);
          });
        };

    beforeEach(function() {
      browser.driver.get(browser.baseUrl + '/');

      element(by.model('username')).sendKeys('jcust');
      element(by.model('password')).sendKeys('jcust');
      element(by.buttonText('Login')).click();

      element(by.linkText('Admin')).click();
      element(by.linkText('Create User')).click();
    });

    test('enables the submit button if all required fields are set', true, true);
    test('disables the submit button if the user type is not set', false, false);

    fieldValues.forEach(function(data) {
      test('disables the submit button if the `' + data.field + '` field is not set', false, true, data.field);
    });

    afterEach(function() {
      element(by.css('[title="Logout"]')).click();
    });
  });
})();
