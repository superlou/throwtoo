import Ember from 'ember';
import GmailInitializer from '../../../initializers/gmail';
import { module, test } from 'qunit';

let application;

module('Unit | Initializer | gmail', {
  beforeEach() {
    Ember.run(function() {
      application = Ember.Application.create();
      application.deferReadiness();
    });
  }
});

// Replace this with your real tests.
test('it works', function(assert) {
  GmailInitializer.initialize(application);

  // you would normally confirm the results of the initializer here
  assert.ok(true);
});
