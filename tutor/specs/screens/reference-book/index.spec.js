import { React, Factory, R, FakeWindow } from '../../helpers';
import ReferenceBook from '../../../src/screens/reference-book/reference-book';
import ReferenceBookUX from '../../../src/screens/reference-book/ux';
import Router from '../../../src/helpers/router';
import Courses from '../../../src/models/courses-map';

jest.mock('../../../src/models/courses-map');
jest.mock('../../../src/helpers/router');
jest.mock('../../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

describe('Reference Book Component', function() {
  let props, ux, history;
  let course;

  beforeEach(function() {
    history = { push: jest.fn() };
    ux = new ReferenceBookUX(history, null,
      { windowImpl: new FakeWindow() }
    );

    course = Factory.course();
    course.referenceBook.update(Factory.bot.create('Book'));
    course.referenceBook.fetch = jest.fn(() => Promise.resolve());

    Courses.get.mockImplementation(() => course);
    const page = course.referenceBook.pages.byId.keys()[0];
    ux.update({ courseId: course.id, pageId: page.id });

    Router.currentParams.mockReturnValue({
      courseId: course.id,
      pageId: page.id,
    });
    props = {
      ux,
      history: {
        listen: jest.fn(),
      },
    };
  });

  it('renders the section title on the navbar', () => {
    const book = mount(<R><ReferenceBook {...props} /></R>);
    expect(book).toHaveRendered('BookPage');
  });

  it('navigates forward and back between pages', function() {
    Router.makePathname.mockReturnValue('/test/route/3');
    const book = mount(<R><ReferenceBook {...props} /></R>);
    book.find('.paging-control.next').simulate('click');
    expect(history.push).toHaveBeenCalledWith('/test/route/3');
  });


  it('sets the menu item to be active based on the current page', function() {
    const book = mount(<R><ReferenceBook {...props} /></R>);
    expect(book).toHaveRendered(`[data-node-id='${ux.page.pathId}'].active`);
  });

  it('displays a not found message when needed', () => {
    ux.pageId = '9999';
    expect(ux.isFetching).toBe(false);
    const book = mount(<R><ReferenceBook {...props} /></R>);
    expect(book).toHaveRendered('.not-found');
    expect(book.text()).toContain('not found');
  });

});
