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
    var promise = new Promise((resolve, reject) => {
      gapi.auth.authorize({
        client_id: this.get('client_id'),
        scope: this.get('scope'),
        immediate: immediate
      }, (authResult) => {
         if (authResult && !authResult.error) {
          this.set('needsAuth', false);

          gapi.client.load('gmail', 'v1').then((result) => {
            this.set('clientReady', true);
            resolve();
          }, (error) => {
            this.set('clientReady', false);
            reject(error);
          });
         } else {
           this.set('needsAuth', true);
           reject();
         }
      });
    });

    return promise;
  },

  labels: Ember.computed('clientReady', function() {
    if (this.get('clientReady')) {
      var promise = new Promise((resolve, reject) => {
        var request = gapi.client.gmail.users.labels.list({'userId': 'me'});
        request.execute((response) => {
          resolve(response);
        });
      });

      return promise;
    } else {
      return undefined;
    }
  }),

  messagesList: function() {
    return new Promise((resolve, reject) => {
      if (this.get('clientReady')) {
        var request = gapi.client.gmail.users.messages.list({'userId': 'me'});
        request.execute((response) => {
          resolve(response);
        });
      } else {
        reject('Client not ready');
      }
    });
  },

  messagesGet: function(id) {
    return new Promise((resolve, reject) => {
      if (this.get('clientReady')) {
        var request = gapi.client.gmail.users.messages.get({
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
