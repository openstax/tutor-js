import AnnotationWidget from '../../src/components/annotations/annotation';
import Renderer from 'react-test-renderer';
import { bootstrapCoursesList } from '../courses-test-data';
import AnnotationsMap from '../../src/models/annotations';
import Highlighter from '@openstax/highlighter';

import Page from '../../api/pages/be8818d0-2dba-4bf3-859a-737c25fb2c99@20.json';
import ANNOTATIONS from '../../api/annotations.json';
import Router from '../../src/helpers/router';

const mockHighlighter = {
  highlight: jest.fn(),
  unmount: () => {},
};
jest.mock('@openstax/highlighter', () => ({
  __esModule: true,
  ...require.requireActual('@openstax/highlighter'),
  SerializedHighlight: (...args) => {
    const actualClass = require.requireActual('@openstax/highlighter').SerializedHighlight;
    const actual = new actualClass(...args);
    actual.isLoadable = () => true;
    return actual;
  },
  default: () => mockHighlighter
}));

jest.mock('react-addons-css-transition-group', () => ({children, component = 'div'}) => {
  const { createElement } = require('react');
  return createElement(component, null, children)
});
jest.mock('../../src/models/feature_flags', () => ({ is_highlighting_allowed: true }));
jest.mock('../../src/helpers/router');
jest.mock('../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

const getWidget = props => {
  const widget = mount(<AnnotationWidget {...props} />);
  widget.instance().waitForPageReady = () => Promise.resolve();
  widget.instance().getReferenceElements = () => ([{}, {}]);
  widget.instance().getBookContentRef = () => ({});
  return widget.instance().initializePage().then(() => widget);
};

describe('Annotations', () => {

  let props, Courses, body, annotations;

  beforeEach(function() {
    mockHighlighter.highlight.mockClear();
    Courses = bootstrapCoursesList();
    Router.currentQuery.mockReturnValue({});
    Courses.get(1).appearance_code = 'college_biology';
    body = window.document.body;

    annotations = new AnnotationsMap();

    annotations.updateAnnotations(
      ANNOTATIONS.rows
    );
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
      annotations,
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

  it('highlights annotations', async () => {
    const widget = await getWidget(props);

    for (const {id} of ANNOTATIONS.rows) {
      expect(mockHighlighter.highlight).toHaveBeenCalledWith(expect.objectContaining({id}));
    }

    widget.unmount();
  });

  it.skip('scrolls to linked annotation', async () => {
    const annotation = annotations.keys()[0];
    annotation.highlight.scrollTo = jest.fn();

    Router.currentQuery.mockReturnValue({ highlight: annotation });

    const widget = await getWidget(props);

    expect(annotation.highlight.scrollTo).toHaveBeenCalled();

    widget.unmount();
  });

  it('renders and matches snapshot', () => {
    annotations.ux.isSummaryVisible = true;
    const comp = Renderer.create(<AnnotationWidget {...props} />, {
      createNodeMock: e => {
        const parent = document.createElement('div');
        const child = document.createElement(e.type);
        parent.appendChild(child);
        return child;
      }
    });
    expect(comp.toJSON()).toMatchSnapshot();
    comp.unmount();
  });
});
