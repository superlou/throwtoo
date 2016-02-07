import DS from 'ember-data';

export default DS.Adapter.extend({
  gmail: Ember.inject.service('gmail'),

  findRecord: function(store, type, id, snapshot) {
    return this.get('gmail').message(id).then((response) => {
      return {
        id: response.id,
        snippet: response.snippet,
        body: this.buildBody(response),
        date: new Date(0).setUTCSeconds(response.internalDate / 1000)
      }
    });
  },

  query: function(store, type, query, recordArray) {
    return this.get('gmail').messages(query).then((response) => {
      return response.map((message) => {
        return {
          id: message.id,
          snippet: message.snippet,
          body: this.buildBody(message),
          date: new Date(0).setUTCSeconds(message.internalDate / 1000)
        }
      });
    });
  },

  buildBody: function(response) {
    var payload = response.payload;

    if (payload.parts) {
      return payload.parts.map((part) => {
        if (part.body.data) {
          return this.decodeData(part.body.data);
        } else {
          return "";  // probably an attachment?
        }
      });
    } else {
      var data = payload.body.data;
      return this.decodeData(data);
    }
  },

  decodeData: function(data) {
    var decoded_data = atob(data.replace(/-/g, '+').replace(/_/g, '/'))
    decoded_data = decoded_data.replace(/\n/g, '<br>');
    return decoded_data;
  }
});
