import AnnotationWidget from '../../src/components/annotations/annotation';
import Renderer from 'react-test-renderer';
import { bootstrapCoursesList } from '../courses-test-data';
import AnnotationsMap from '../../src/models/annotations';
import User from '../../src/models/user';
import Page from '../../api/pages/be8818d0-2dba-4bf3-859a-737c25fb2c99@20.json';
import ANNOTATIONS from '../../api/annotations.json';

jest.mock('../../src/models/feature_flags', () => ({ is_highlighting_allowed: true }));
jest.mock('../../src/models/user');

describe('Annotations', () => {

  let props, Courses, body, annotations;

  beforeEach(function() {
    Courses = bootstrapCoursesList();
    Courses.get(1).appearance_code = 'college_biology';
    body = window.document.body;
    annotations = new AnnotationsMap();
    User.annotations = annotations;
    annotations.updateAnnotations(
      ANNOTATIONS.rows
    );
    //mockAnnotationsMap.updateAnnotations(
    // from reference_book/page component
    body.innerHTML = '<div id="mount"><div class="book-content">' +
      Page.content_html
      .replace(/^[\s\S]*<body[\s\S]*?>/, '')
      .replace(/<\/body>[\s\S]*$/, '') +
      '</div></div>';
    window.getSelection = jest.fn(() => ({
      removeAllRanges: jest.fn(),
      addRange: jest.fn(),
      getRangeAt: jest.fn(() => ({
        cloneRange: jest.fn(),
        getBoundingClientRect: jest.fn(() => ({
          bottom: 150,
          top: 100,
          left: 100,
          right: 150,
        })),
      })),
    }));
    window.document.createRange = jest.fn(() => ({
      setStart: jest.fn(),
      setEnd: jest.fn(),
      collapse: jest.fn(),
    }));
    props = {
      courseId: '1',
      documentId: 'be8818d0-2dba-4bf3-859a-737c25fb2c99',
      title: Page.title,
      windowImpl: window,
      chapter: Page.chapter_section[0],
      section: Page.chapter_section[1],
    };
  });

  it('sorts in model', () => {
    expect(Object.keys(annotations.byCourseAndPage)).toEqual(['1']);
    expect(Object.keys(annotations.byCourseAndPage[1])).toEqual(['2.1']);
    expect(Object.keys(annotations.byCourseAndPage[1]['2.1'])).toHaveLength(2);
  });

  it('renders and matches snapshot', () => {
    const comp = Renderer.create(<AnnotationWidget {...props} />);
    expect(comp.toJSON()).toMatchSnapshot();
    comp.unmount();
  });
});
