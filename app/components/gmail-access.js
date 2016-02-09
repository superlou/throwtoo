import Ember from 'ember';

export default Ember.Component.extend({
  gmail: Ember.inject.service('gmail'),

  actions: {
    handleAuthClick: function() {
      this.get('gmail').authorize();
      this.sendAction('authorized');
    },

    signout: function() {
      this.get('gmail').signout();
      this.sendAction('signedOut');
    }
  }
});
