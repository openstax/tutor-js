import PreviewAddCourseBtn from '../../../src/components/navbar/preview-add-course-btn';
import { Wrapper, SnapShot } from '../helpers/component-testing';

jest.mock('../../../src/models/courses-map', () => ({
  get: jest.fn(() => ({ is_preview: true }) ),
  tutor: { currentAndFuture: { nonPreview: {
    get isEmpty() { return true; },
  } } },
}));

describe('Preview Add Course Button', () => {
  it('renders and matches snapshot', () => {
    expect(SnapShot.create(
      <Wrapper _wrapped_component={PreviewAddCourseBtn} courseId='1' />).toJSON()
    ).toMatchSnapshot();
  });
});
