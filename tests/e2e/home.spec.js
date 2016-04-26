describe('Home Page', function() {
  it('should contain a particular text', function() {
    browser.driver.get('http://localhost:3030/');
    var body = browser.driver.findElement(by.css('body'));
    expect(body.getText()).toContain('NRGI Resource Governance Index Assessment Tool');
  });
});
