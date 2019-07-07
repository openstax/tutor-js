import External from '../../../src/screens/assignment-builder/external';
import { C, TimeMock, createUX } from './helpers';

describe('External Plan', function() {
  let props;

  const now = TimeMock.setTo('2015-10-14T12:00:00.000Z');

  beforeEach(() => {
    const ux = createUX({ now, type: 'external' });
    props = { ux };
  });

  it('works on happy path', () => {
    const plan = mount(<C><External {...props} /></C>);
    plan.find('.assignment-name input').simulate('change', {
      target: { value: 'a reading' },
    });
    const value = 'https://tutor.openstax.org/';
    plan.find('input[name="externalUrl"]').simulate('change', {
      target: { value },
    });

    plan.find('SaveButton AsyncButton').simulate('click');

    expect(props.ux.plan.settings.external_url).toEqual(value);
    plan.unmount();
  });

  it('shows url required message URL is missing', () => {
    const plan = mount(<C><External {...props} /></C>);


    plan.find('.assignment-name input').simulate('change', {
      target: { value: 'not a url' },
    });

    expect(plan).toHaveRendered('TutorInput[name="externalUrl"] TutorRequired');

    const value = 'tutor.openstax.org/';
    plan.find('input[name="externalUrl"]').simulate('change', {
      target: { value },
    });

    expect(plan).not.toHaveRendered('TutorInput[name="externalUrl"] TutorRequired');

    plan.unmount();
  });
});
