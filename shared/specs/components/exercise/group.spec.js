import { Testing, sinon, _ } from 'shared/specs/helpers';

import Group from 'components/exercise/group';

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


  it('renders the label and icon', () =>
    Testing.renderComponent( Group, { props } ).then(function({ dom, wrapper }) {
      expect(dom.textContent).equal('Personalized');
      return expect(dom.querySelector('i.icon-personalized')).not.to.be.null;
    })
  );

  it('renders null label and icon for groups that should not be visible', function() {
    props.group = 'core';
    return Testing.renderComponent( Group, { props } ).then(function({ dom, wrapper }) {
      expect(dom.querySelector('i.icon-personalized')).to.be.null;
      return expect(dom.textContent).equal('');
    });
  });

  return it('renders the exercise uid when passed in', function() {
    props.group = 'spaced practice';
    return Testing.renderComponent( Group, { props } ).then(({ dom, wrapper, root, element }) => expect(dom.textContent).toContain('Spaced Practice'));
  });
});
