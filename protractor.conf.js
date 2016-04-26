exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  seleniumServerJar: './node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar',
  specs: ['tests/e2e/**/*.spec.js'],

  framework: 'jasmine',

  capabilities: {
    'browserName': 'firefox'
  },

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },

  baseUrl: 'http://localhost:3030'
};
