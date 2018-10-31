import { Testing, expect, sinon, _ } from 'shared/specs/helpers';

import Button from 'components/buttons/close-button';

describe('Close Button Component', function() {
  let props = null;

  beforeEach(() => props = {});

  return it('has proper classes', () =>
    Testing.renderComponent( Button, { props } ).then(function({ dom }) {
      expect(dom.tagName).equal('BUTTON');
      return expect(dom.classList.contains('openstax-close-x')).toBe(true);
    })
  );
});
