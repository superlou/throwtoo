// Wrap 3rd party API callback functions in ember-run-callback
import Ember from 'ember';

export default Ember.Service.extend({
  client_id: '1078485083966-743346spqbm0uippp56pq404rsd9kood.apps.googleusercontent.com',
  scope: 'https://www.googleapis.com/auth/gmail.readonly',
  clientReady: false,
  needsAuth: true,

  checkAuth: function() {
    return this.authorize(true);
  },

  authorize: function(immediate=false) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      window.gapi.auth.authorize({
        client_id: this.get('client_id'),
        scope: this.get('scope'),
        immediate: immediate
      }, (authResult) => {
        if(!authResult || authResult.error) {
          Ember.run(null, reject);
        } else {
          Ember.run(null, resolve);
        }
      });
    }).then(() => {
      this.set('needsAuth', false);
      return this.loadGmailClient();
    }).catch(() => {
      this.set('needsAuth', true);
    });
  },

  loadGmailClient: function() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      window.gapi.client.load('gmail', 'v1').then((result) => {
        Ember.run(null, resolve, result);
      }, (error) => {
        Ember.run(null, reject, error);
      });
    }).then((result) => {
      this.set('clientReady', true);
      return Ember.RSVP.resolve();
    }).catch((error) => {
      this.set('clientReady', false);
      return Ember.RSVP.reject(error);
    });
  },

  labels: Ember.computed('clientReady', function() {
    if (this.get('clientReady')) {
      return new Ember.RSVP.Promise((resolve, reject) => {
        var request = window.gapi.client.gmail.users.labels.list({'userId': 'me'});
        request.execute((response) => {
          resolve(response);
        });
      });
    } else {
      return undefined;
    }
  }),

  messagesList: function() {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (this.get('clientReady')) {
        var request = window.gapi.client.gmail.users.messages.list({'userId': 'me'});
        request.execute((response) => {
          resolve(response);
        });
      } else {
        reject('Client not ready');
      }
    });
  },

  messagesGet: function(id) {
    return new Ember.RSVP.Promise((resolve, reject) => {
      if (this.get('clientReady')) {
        var request = window.gapi.client.gmail.users.messages.get({
          'userId': 'me',
          'id': id
        });
        request.execute((response) => {
          resolve(response);
        });
      } else {
        reject('Client not ready');
      }
    });
  },

  messages: function() {
    return this.messagesList().then((result) => {
      return Ember.RSVP.all(result.messages.map((item) => {
        return this.messagesGet(item.id);
      }));
    });
  }
});
