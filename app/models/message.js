import DS from 'ember-data';

export default DS.Model.extend({
  snippet: DS.attr(),
  body: DS.attr(),
  date: DS.attr('date'),
  from: DS.attr(),
  to: DS.attr(),
  subject: DS.attr()
});
