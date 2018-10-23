import { Testing, expect, sinon, _ } from 'shared/specs/helpers';

import Button from 'components/buttons/refresh-button';

describe('Refresh Button Component', function() {
  let props = null;

  beforeEach(() =>
    props = {
      beforeText: 'before ',
      buttonText: 'Refresh',
      afterText: ' after',
    }
  );

  return it('can use custom text', () =>
    Testing.renderComponent( Button, { props } ).then(({ dom }) => expect(dom.textContent).equal('before Refresh after'))
  );
});
