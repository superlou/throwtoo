import Ember from 'ember';

export default Ember.Route.extend({
  gmail: Ember.inject.service('gmail'),

  beforeModel: function() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      window.checkAuth = () => {
        Ember.run(() => {
          this.get('gmail').checkAuth().then(() => {
            resolve();
          }).catch((error) => {
            resolve();
            this.transitionTo('authorize');
          });
        });
      };

      Ember.$.getScript("https://apis.google.com/js/client.js?onload=checkAuth");
    });
  }
});
