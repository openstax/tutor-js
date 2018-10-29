import DATA from '../../api/annotations.json';
import { keys } from 'lodash';
import Annotations from '../../src/models/annotations';
import FeatureFlags from '../../src/models/featureldflags';
import Hypothesis from '../../src/models/annotations/hypothesis';
jest.mock('../../src/models/feature_flags');
jest.mock('../../src/models/annotations/hypothesis');

describe('Annotations Model', () => {

  beforeEach(() => {
    FeatureFlags.is_highlighting_allowed = false;
  });

  it('does not request info when feature flag is off', () => {
    const annotations = new Annotations();
    expect(annotations.api.isPending).toBe(false);
    expect(Hypothesis.fetchUserInfo).not.toHaveBeenCalled();
  });

  it('sets annotations', () => {
    const annotations = new Annotations();
    annotations.updateAnnotations(DATA.rows);
    expect(annotations.byCourseAndPage).toHaveProperty('1');
    expect(keys(annotations.byCourseAndPage['1'])).toEqual(['2.1']);
  });

});
