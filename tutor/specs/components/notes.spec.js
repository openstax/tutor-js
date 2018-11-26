import NotesWidget from '../../src/components/notes';
import { bootstrapCoursesList } from '../courses-test-data';
import NotesMap from '../../src/models/notes';

import Page from '../../api/pages/be8818d0-2dba-4bf3-859a-737c25fb2c99@20.json';
import NOTES from '../../api/notes.json';
import Router from '../../src/helpers/router';

jest.mock('../../src/models/feature_flags', () => ({ is_highlighting_allowed: true }));
jest.mock('../../src/helpers/router');
jest.mock('../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Notes', () => {

  let props, Courses, body, notes;

  beforeEach(function() {
    Courses = bootstrapCoursesList();
    Router.currentQuery.mockReturnValue({});
    Courses.get(1).appearance_code = 'college_biology';
    body = window.document.body;

    notes = new NotesMap();

    notes.updateNotes(
      NOTES.rows
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
      notes,
      courseId: '1',
      documentId: 'be8818d0-2dba-4bf3-859a-737c25fb2c99',
      title: Page.title,
      windowImpl: window,
      chapter: Page.chapter_section[0],
      section: Page.chapter_section[1],
    };
  });

  it('sorts in model', () => {
    expect(Object.keys(notes.byCourseAndPage)).toEqual(['1']);
    expect(Object.keys(notes.byCourseAndPage[1])).toEqual(['2.1']);
    expect(Object.keys(notes.byCourseAndPage[1]['2.1'])).toHaveLength(2);
  });

  it('renders and matches snapshot', () => {
    notes.ux.isSummaryVisible = true;
    expect.snapshot(
      <NotesWidget {...props} />,
      {
        createNodeMock: e => {
          const parent = document.createElement('div');
          const child = document.createElement(e.type);
          parent.appendChild(child);
          return child;
        },
      },
    ).toMatchSnapshot();
  });

});
