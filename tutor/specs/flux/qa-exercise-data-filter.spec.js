import { expect } from 'chai';
import ld from 'underscore';
import ld from 'lodash';

import EXERCISES from '../../api/exercises.json';
import FilterFunc from '../../src/flux/qa-exercise-data-filter';

const EXERCISE = _.first(EXERCISES.items);

const ECOSYSTEMS = require('../../api/ecosystems.json');
const ECOSYSTEM_ID = '1'; // AP BIO

const { EcosystemsActions } = require('../../src/flux/ecosystems');

const BAD_TAG_IDS = [
  'context-cnxmod:185cbf87-c72e-48f5-b51e-f14f21b5eabd',
  'lo:stax-bio:1-1-1',
];

describe('QA Exercise Data Filter', function() {

  beforeEach(function(done) {
    this.exercise = ld.cloneDeep(EXERCISE);
    this.tags = _.clone(this.exercise.tags);

    EcosystemsActions.loaded(ECOSYSTEMS);
    return _.defer(done);
  }); // defer done signal so it fires after exercise load emits

  xit('removes tags unrelated to current book', function() {
    const ex = FilterFunc(this.exercise, { ecosystemId: ECOSYSTEM_ID });
    const tags = _.pluck(ex.tags, 'id');
    const valid = (
      _.reject(
        _.pluck(this.tags, 'id'), id => _.include(BAD_TAG_IDS, id))
    );
    expect(tags).toEqual(valid);
    return undefined;
  });

  return xit('keeps tags for current book', function() {
    const ex = FilterFunc(this.exercise, { ecosystemId: ECOSYSTEM_ID });

    expect(ex.tags).to.include(
      _.findWhere(this.tags, { id: 'lo:stax-apbio:2-2-2' })
    );
    expect(ex.tags).to.include(
      _.findWhere(this.tags, { id: 'context-cnxmod:d52e93f4-8653-4273-86da-3850001c0786' })
    );
    return undefined;
  });
});
