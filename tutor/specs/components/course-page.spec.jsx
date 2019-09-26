import { Factory, R } from '../helpers';
import CoursePage from '../../src/components/course-page';

describe('Course Page', () => {

  let props;

  beforeEach(function() {
    props = {
      course: Factory.course(),
      className: 'test-page',
    };
  });

  const Title = () => <h1>A Big Bad Page</h1>;

  it('renders and matches snapshot', () => {
    expect.snapshot(
      <R>
        <CoursePage {...props}>
          <h3>Hello, this is the body</h3>
        </CoursePage>
      </R>
    ).toMatchSnapshot();
    expect.snapshot(
      <R>
        <CoursePage
          {...props}
          title={<Title />}
          notices={<h1>This is a test notice</h1>}
          subtitle="This is a subtitle"
          controls={<button>Click Me</button>}
        >
          <h3>Hello, this is the body</h3>
        </CoursePage>
      </R>
    ).toMatchSnapshot();
  });
});
