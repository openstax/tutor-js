import Footer from '../../../src/screens/assignment-builder/footer';
import { TimeMock, createUX } from './helpers';

describe('Task Plan Footer', function() {
  let ux;

  const now = TimeMock.setTo('2018-01-01');

  beforeEach(async () => {
    ux = await createUX({ now });
  });

  it('renders', () => {
    const f = mount(<Footer ux={ux} />);
    expect(f).toHaveRendered('SaveButton');
    f.unmount();
  });

});
