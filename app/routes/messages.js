import Ember from 'ember';

export default Ember.Route.extend({
  gmail: Ember.inject.service('gmail'),

  queryParams: {
    q: {
      refreshModel: true
    }
  },

  model: function(params) {
    return this.get('gmail').messages(params.q);
  },

  actions: {
    setFilter: function(q) {
      this.transitionTo('messages', {queryParams: {q: q}});
    }
  }
});