import Ember from 'ember';

export default Ember.Component.extend({
  gmail: Ember.inject.service('gmail'),

  actions: {
    handleAuthClick: function(event) {
      this.get('gmail').authorize(event);
    }
  }
});
