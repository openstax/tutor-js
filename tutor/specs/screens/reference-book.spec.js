import { React, SnapShot } from '../components/helpers/component-testing';
import { Promise } from 'es6-promise';
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
    REFERENCE_BOOK = require('../../api/ecosystems/1/readings.json');
    REFERENCE_BOOK_PAGE_DATA = require('../../api/pages/17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12.json');
    course = bootstrapCoursesList().get(COURSE_ID);
    router = {
      history: {
        push: jest.fn(),
      },
    };
    course.referenceBook.fetch=jest.fn(function() {
      this.onApiRequestComplete({ data: REFERENCE_BOOK });
      this.pages.values().forEach((pg) => pg.fetch = jest.fn());
      this.pages.get('2.1')
        .onContentFetchComplete({ data: REFERENCE_BOOK_PAGE_DATA });
      return Promise.resolve(this);
    });
    Router.currentParams.mockReturnValue({ courseId: COURSE_ID });
    ux = new ReferenceBookUX(course, router);
    ux.setSection('2.1');
    props = {
      ux,
    };
  });

  it('renders the section title on the navbar', () => {
    const book = mount(<ReferenceBook {...props} />, EnzymeContext.build());
    expect(book).toHaveRendered('BookPage');
  });

  it('renders page html that matches snapshot', function() {
    const book = mount(<ReferenceBook {...props} />, EnzymeContext.build());
    expect(book.html()).toMatchSnapshot();
  });

  xit('toggles menu when navbar control is clicked', function() {
    const book = mount(<ReferenceBook {...props} />, EnzymeContext.build());
    expect(book).not.toHaveRendered('.menu-open');
    ux.isMenuVisible = false;
    expect(book).toHaveRendered('.menu-open');
  });

  it('navigates forward and back between pages', function() {
    expect(ux.activePage.chapter_section.asString).toEqual('2.1');
    Router.makePathname.mockReturnValue('/test/route/3');
    const book = mount(<ReferenceBook {...props} />, EnzymeContext.build());
    book.find('.paging-control.next').simulate('click');
    expect(router.history.push).toHaveBeenCalledWith('/test/route/3');
  });


  it('sets the menu item to be active based on the current page', function() {
    const book = mount(<ReferenceBook {...props} />, EnzymeContext.build());
    expect(book).toHaveRendered(`.book-menu [data-section='${ux.activePage.chapter_section.asString}'] .active`);
  });

  xit('closes TOC when using TOC to nav and window is small', function(done) {
    expect(_.toArray(this.state.div.querySelector('.reference-book').classList))
      .to.contain('menu-open');

    const nextSelection = this.state.div.querySelector(`.menu [data-section='${SECOND_PAGE}'] a`);
    ReferenceBookPageActions.loaded(PAGE, SECOND_PAGE_ID);

    commonActions.click(nextSelection);
    expect(_.toArray(this.state.div.querySelector('.reference-book').classList))
      .to.not.contain('menu-open');
    return done();
  });
});
