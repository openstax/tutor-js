import { FakeWindow } from '../helpers';
import Responsive from '../../src/components/responsive'

jest.mock('lodash/debounce', () => jest.fn(fn => fn));

const Mobile = () => <p>MOBILE</p> 
const Tablet = () => <p>TABLET</p> 
const Desktop = () => <p>DESKTOP</p>


describe('Responsive Rendering', () => {
  let props;
  jest.useFakeTimers();
  
  beforeEach(() => {
    props = {
      windowImpl: new FakeWindow(),
      mobile: <Mobile />,
      tablet: <Tablet />,
      desktop: <Desktop />,
    };
  });

  it('switches view depending on window width', () => {
    const { windowImpl } = props;
    windowImpl.innerWidth = 1024
    const c = mount(<Responsive {...props} />)
    expect(c).toHaveRendered(Desktop)
    windowImpl.innerWidth = 780
    windowImpl.addEventListener.mock.calls[0][1]()
    jest.runAllTimers();

    expect(c).toHaveRendered(Tablet)

    windowImpl.innerWidth = 650
    windowImpl.addEventListener.mock.calls[0][1]()
    expect(c).toHaveRendered(Mobile)
  })

  it ('renders desktop if tablet is ommited', () => {
    props.windowImpl.innerWidth = 780 // tablet size, but no tablet view given
    props.tablet = undefined
    const c = mount(<Responsive {...props} />)
    expect(c).toHaveRendered(Desktop)
  })

  it('can use custom breakpoints', () => {
    props.windowImpl.innerWidth = 980
    props.breakpoints={
      tablet: 900,
    }
    const c = mount(<Responsive {...props} />)
    expect(c).toHaveRendered(Tablet)
    props.windowImpl.innerWidth = 1000
    props.windowImpl.addEventListener.mock.calls[0][1]()
    expect(c).toHaveRendered(Desktop)
  })

})
