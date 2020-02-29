import { React, createUX, TimeMock } from '../helpers';
import Review from '../../../../src/screens/assignment-builder/reading/review-selection';

describe('review reading selection', () => {
  let props;
  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(async () => {
    const ux = await createUX({ now, type: 'reading' });
    props = { ux };
  });

  it('can review selections', () => {
    const rs = mount(<Review {...props} />);
    expect(rs.debug()).toMatchSnapshot();
    rs.unmount();
  });

  it('renders html', () => {
    props.ux.selectedPages[0].title = '<i>I am in italics</i>';
    const rv = mount(<Review {...props} />);
    expect(rv.text()).not.toContain('<i>');
    expect(rv.text()).toContain('I am in italics');
    rv.unmount();
  });

});
