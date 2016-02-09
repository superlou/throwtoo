import Ember from 'ember';

export default Ember.Route.extend({
  gmail: Ember.inject.service('gmail'),

  beforeModel: function() {
    if (this.get('gmail.clientReady')) {
      this.transitionTo('messages');
    }
  }
});
