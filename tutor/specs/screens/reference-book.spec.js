import { C, React, Factory, EnzymeContext } from '../helpers';
import ReferenceBook from '../../src/screens/reference-book/reference-book';
import ReferenceBookUX from '../../src/screens/reference-book/ux';
import Router from '../../src/helpers/router';

jest.mock('../../src/helpers/router');
jest.mock('../../../shared/src/components/html', () => ({ html }) =>
  html ? <div dangerouslySetInnerHTML={{ __html: html }} /> : null
);

const COURSE_ID = '1';

describe('Reference Book Component', function() {
  let props, ux, course, REFERENCE_BOOK, REFERENCE_BOOK_PAGE_DATA, router;

  beforeEach(function() {
    router = { foo: 1, history: { push: jest.fn() } };
    ux = new ReferenceBookUX(router);
    ux.book = Factory.book();
    ux.setChapterSection('2.1');
    props = {
      ux,
    };
    Router.currentParams.mockReturnValue({
      ecosystemId: ux.book.id,
      chapterSection: ux.page.chapter_section.toString,
    });

  });

  it('renders the section title on the navbar', () => {
    const book = mount(<ReferenceBook {...props} />, EnzymeContext.build());
    expect(book).toHaveRendered('BookPage');
  });

  xit('renders page html that matches snapshot', function() {
    expect.snapshot(<C><ReferenceBook {...props} /></C>).toMatchSnapshot();
  });

  it('navigates forward and back between pages', function() {
    expect(ux.page.chapter_section.asString).toEqual('2.1');
    Router.makePathname.mockReturnValue('/test/route/3');
    const book = mount(<ReferenceBook {...props} />, EnzymeContext.build());
    book.find('.paging-control.next').simulate('click');
    expect(router.history.push).toHaveBeenCalledWith('/test/route/3');
  });


  it('sets the menu item to be active based on the current page', function() {
    const book = mount(<ReferenceBook {...props} />, EnzymeContext.build());
    expect(book).toHaveRendered(`.book-menu li[data-section='${ux.page.chapter_section.asString}'] .active`);
  });

  it('displays a not found message when needed', () => {
    ux.chapterSection = '99.99';
    expect(ux.isFetching).toBe(false);
    const book = mount(<ReferenceBook {...props} />, EnzymeContext.build());
    expect(book).toHaveRendered('.not-found');
    expect(book.text()).toContain('Section 99.99 was not found');
  });

});
