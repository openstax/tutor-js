import { observable, computed, action, observe, when } from 'mobx';
import { first, invoke } from 'lodash';
import WindowSize from '../window-size';
import Book from '../reference-book';
import Courses from '../courses-map';
import Router from '../../helpers/router';
import Scroller from '../../helpers/scroll-to';

// menu width (300) + page width (1000) + 50 px padding
// corresponds to @book-page-width and @book-menu-width in variables.scss
const MENU_VISIBLE_BREAKPOINT = 1350;

export default class BookUX {

  @observable isMenuVisible = window.innerWidth > MENU_VISIBLE_BREAKPOINT;
  @observable pageId;
  @observable ecosystemId;
  @observable courseId;
  @observable book;

  windowSize = new WindowSize({ windowImpl: this.windowImpl });
  scroller = new Scroller({ windowImpl: this.windowImpl });

  constructor({ windowImpl } = {}) {
    this.windowImpl = windowImpl;
    this.disposers = [
      observe(this, 'ecosystemId', this.onEcosystemChange),
      observe(this, 'pageId', this.onPageChange),
    ];
  }

  unmount() {
    this.disposers.forEach(d => d());
    this.disposers = [];
  }

  @action.bound onEcosystemChange({ newValue: ecosystemId }) {
    if (this.book && this.book.id == ecosystemId){ return; }
    if (this.course) {
      this.book = this.course.referenceBook;
    } else {
      this.book =  new Book({ id: ecosystemId });
    }
    this.book.fetch().then(() => {
      if (!this.pageId) {
        this.setCurrentPage();  // will default to first section
      }
    });
  }

  @computed get isFetching() {
    return Boolean(
      (this.book && this.book.api.isPending) || (this.page && this.page.api.isPending)
    );
  }

  @action.bound onMenuSelection(section) {
    this.setCurrentPage(section);
    if (this.isMenuOnTop) { this.isMenuVisible = false; }
    this.scroller.scrollToTop({ deferred: true });
  }

  @action.bound onPageChange({ newValue: section }) {
    if (section && this.page) {
      this.page.ensureLoaded();
    }
  }

  @computed get isMenuOnTop() {
    return this.windowSize.width < MENU_VISIBLE_BREAKPOINT;
  }

  @action.bound toggleTocMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  @action.bound update(props) {
    if (props.ecosystemId) {
      this.ecosystemId = props.ecosystemId;
    } else if (props.courseId) {
      this.courseId = props.courseId;
      // the finding by ecosystem id fallback is
      // a hack in case users access from a old bookmark
      // in that case the id that's present will be the ecosystem
      const course = Courses.get(this.courseId) ||
        Courses.forEcosystemId(this.courseId);
      if (course.id != this.courseId) {
        this.courseId = course.id;
        const pageURL = props.pageId ? `/page/${props.pageId}` : '';
        this.history.push(`/book/${this.courseId}${pageURL}`);
      }
      if (course) {
        this.ecosystemId = course.ecosystem_id;
      }
    }
    if (props.chapterSection) {
      if (this.book) {
        when(() => this.book.pages.byChapterSection.get(props.chapterSection))
          .then(() => {
            const pageId = this.book.pages.byChapterSection.get(props.chapterSection).id;
            this.history.push(`/book/${this.courseId}/page/${pageId}`);
          });
      }
      return;
    }

    this.setCurrentPage(props.pageId);
  }

  @action setCurrentPage(pageId) {
    if (this.book && !pageId) {
      pageId = first(Array.from(this.book.pages.byId.keys()));
    }
    if (this.tours && this.tours.tourRide) {
      // wait for React to re-render, mathjax to run, and the page to reflow
      setTimeout(() => invoke(this, 'tours.tourRide.joyrideRef.calcPlacement'), 10);
    }
    this.pageId = pageId;
  }

  @computed get pages() {
    return this.book.pages;
  }

  @computed get course() {
    if (this.courseId) {
      return Courses.get(this.courseId);
    }
    return this.ecosystemId && Courses.forEcosystemId(this.ecosystemId);
  }

  @computed get page() {
    return this.book && this.pageId && this.book.pages.byId.get(this.pageId);
  }

  @computed get toc() {
    return this.book.children;
  }

  @computed get isCollated() {
    return this.book && this.book.is_collated;
  }

  @computed get bookMenuProps() {
    return {
      book: this.book,
      currentPage: this.page,
      pageLinkProps: this.propsForPage,
      className: this.isMenuVisible ? 'open' : '',
    };
  }

  propsForPage = (page) => {
    return {
      tabIndex: this.isMenuVisible ? 0 : -1,
      to: 'viewReferenceBookPage',
      params: { pageId: page.id, courseId: this.course.id },
      onClick: this.onMenuSelection,
    };
  }

  @computed get courseDataProps() {
    const { course } = this;
    return course ? {
      'data-title': course.name,
      'data-book-title': course.bookName || '',
      'data-appearance': course.appearance_code,
    } : {};
  }

  bookLinkFor(props) {
    let { courseId } = Router.currentParams();
    const { query } = props;

    return Router.makePathname(
      'viewReferenceBook',
      { courseId }, query
    );
  }

  rewriteBookLink(link) {
    link.href = link.href.replace(/\/book\/\d+/, `/book/${this.courseId}`);
  }

  @computed get pagingProps() {
    return {
      onForwardNavigation: this.onNavSetSection,
      onBackwardNavigation: this.onNavSetSection,
      isForwardEnabled: !!this.page.nextPage,
      isBackwardEnabled: !!this.page.prevPage,
      forwardHref: this.sectionHref(this.page.nextPage),
      backwardHref: this.sectionHref(this.page.prevPage),
    };
  }

}
