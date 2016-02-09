import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['q'],
  q: null,
  qOneWay: Ember.computed.oneWay('q')
});
