import { React } from './helpers/component-testing';
import Renderer from 'react-test-renderer';
import COURSE from '../../api/courses/1.json';
import Course from '../../src/models/course';
import CoursePage from '../../src/components/course-page';

describe('Course Page', () => {

  let props;

  beforeEach(function() {
    props = {
      course: new Course(COURSE),
      className: 'test-page',
    };
  });

  const Title = () => <h1>A Big Bad Page</h1>;

  it('renders and matches snapshot', () => {
    expect(Renderer.create(
      <CoursePage
        {...props}
        title={<Title />}
        controls={<button>Click Me</button>}
      >
        <h3>Hello, this is the body</h3>
      </CoursePage>
    ).toJSON()).toMatchSnapshot();
  });
});
