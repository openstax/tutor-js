import { React, createUX, TimeMock } from '../helpers';
import Review from '../../../../src/screens/assignment-builder/reading/review-selection';

describe('review reading selection', () => {
  let props;
  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(function() {
    props = { ux: createUX({ now, type: 'reading' }) };
  });

  it('can review selections', () => {
    expect(<Review {...props} />).toMatchSnapshot();
  });

});
