(function(){
  'use strict';

  describe('Home Page', function() {
    beforeEach(function() {
      browser.driver.get('http://localhost:3030/');

      element(by.model('username')).sendKeys('cperry');
      element(by.model('password')).sendKeys('cperry');
      element(by.buttonText('Login')).click();
    });

    it('shows a link to the user profile', function() {
      expect(element(by.css('[href="/profile"]')).getText()).toEqual('Chris Perry');
    });

    it('shows a success notification message', function() {
      expect(element(by.css('.toast.toast-success')).isDisplayed()).toBeTruthy();
      expect(element(by.css('.toast-message')).getText()).toEqual('You have successfully signed in!');
    });

    afterEach(function() {
      element(by.css('[title="Logout"]')).click();
    });
  });
})();
