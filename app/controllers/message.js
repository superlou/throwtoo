import Ember from 'ember';

export default Ember.Controller.extend({
  body: Ember.computed('model', function() {
    var payload = this.get('model').payload;

    if (payload.parts) {
      return "Unable to parse multipart message.";
    } else {
      var data = payload.body.data;
      return this.decode(data);
    }
  }),

  decode: function(data) {
    var decoded_data = atob(data.replace(/-/g, '+').replace(/_/g, '/'))
    decoded_data = decoded_data.replace(/\n/g, '<br>');
    return decoded_data;
  }
});
