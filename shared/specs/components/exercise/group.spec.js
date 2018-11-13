import Group from '../../../src/components/exercise/group';

describe('Exercise Group Component', function() {
  let props = null;

  beforeEach(() =>
    props = {
      project: 'tutor',
      group: 'personalized',

      related_content: [
        { title: 'Test', chapter_section: [1, 2] },
      ],
    });


  it('renders the label and icon', () => {
    const group = mount(<Group {...props} />);
    expect(group.text()).toMatch('Personalized');
    group.unmount();
  });

  it('renders null label and icon for groups that should not be visible', () => {
    props.group = 'core';
    const group = mount(<Group {...props} />);
    expect(group.text()).toBe('');
    group.unmount();
  });

  it('renders the exercise uid when passed in', function() {
    props.group = 'spaced practice';
    const group = mount(<Group {...props} />);
    expect(group.text()).toBe('Spaced Practice');
    group.unmount();
  });
});
