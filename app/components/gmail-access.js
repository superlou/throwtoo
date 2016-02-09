import Ember from 'ember';

export default Ember.Component.extend({
  gmail: Ember.inject.service('gmail'),

  actions: {
    handleAuthClick: function() {
      this.get('gmail').authorize();
    },

    signout: function() {
      this.get('gmail').signout();
    }
  }
});
