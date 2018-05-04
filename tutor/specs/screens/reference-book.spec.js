import { React, SnapShot } from '../components/helpers/component-testing';
import { Promise } from 'es6-promise';
import Factory, { FactoryBot } from '../factories';

import Book from '../../src/models/reference-book';
import Page from '../../src/models/reference-book/page';

import Router from '../../src/helpers/router';
import ReferenceBook from '../../src/screens/reference-book/reference-book';
import { bootstrapCoursesList } from '../courses-test-data';
import ReferenceBookUX from '../../src/screens/reference-book/ux';
import EnzymeContext from '../components/helpers/enzyme-context';

jest.mock('../../src/helpers/router');

const COURSE_ID = '1';

describe('Reference Book Component', function() {
  let props, ux, course, REFERENCE_BOOK, REFERENCE_BOOK_PAGE_DATA, router;

  beforeEach(function() {
    router = { history: { push: jest.fn() } };
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

  it('renders page html that matches snapshot', function() {
    const book = mount(<ReferenceBook {...props} />, EnzymeContext.build());
    expect(book.html()).toMatchSnapshot();
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
    expect(book).toHaveRendered(`.book-menu [data-section='${ux.page.chapter_section.asString}'] .active`);
  });

});
