import DS from 'ember-data';

export default DS.Adapter.extend({
  gmail: Ember.inject.service('gmail'),

  findRecord: function(store, type, id, snapshot) {
    return this.get('gmail').message(id).then((message) => {
      return {
        id: message.id,
        snippet: message.snippet,
        body: this.buildBody(message),
        date: new Date(0).setUTCSeconds(message.internalDate / 1000),
        from: this.findInHeader(message, 'From'),
        to: this.findInHeader(message, 'To'),
        subject: this.findInHeader(message, 'Subject')
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
          date: new Date(0).setUTCSeconds(message.internalDate / 1000),
          from: this.findInHeader(message, 'From'),
          to: this.findInHeader(message, 'To'),
          subject: this.findInHeader(message, 'Subject')
        }
      });
    });
  },

  findInHeader: function(message, name) {
    var header = message.payload.headers.find((item) => {
      return item.name == name;
    });

    if (header) {
      return header.value;
    } else {
      return undefined;
    }
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
