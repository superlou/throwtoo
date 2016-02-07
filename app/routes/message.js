import Ember from 'ember';

export default Ember.Route.extend({
  gmail: Ember.inject.service('gmail'),

  model: function(params) {
    return this.get('gmail').message(params.message_id);
  },
});
