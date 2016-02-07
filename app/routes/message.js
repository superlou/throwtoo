import Ember from 'ember';

export default Ember.Route.extend({
  gmail: Ember.inject.service('gmail'),

  model: function(params) {
    return this.store.find('message', params.message_id);
  },
});
