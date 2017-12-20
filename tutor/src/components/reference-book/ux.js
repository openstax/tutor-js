import { observable, computed, action } from 'mobx';
import Router from '../../helpers/router';
import { extend, first, last, findIndex } from 'lodash';
import Page from '../reference-book/page';

// menu width (300) + page width (1000) + 50 px padding
// corresponds to @reference-book-page-width and @reference-book-menu-width in variables.scss
const MENU_VISIBLE_BREAKPOINT = 1350;

function findAllPages(section, map) {
  if (section.isPage) {
    const lastPage = last(map.values());
    if (lastPage) { lastPage.linkNextPage(section); }
    map.set(section.chapter_section.asString, section);
  }
  (section.children || []).forEach(child => {
    findAllPages(child, map);
  });
  return map;
}

export default class ReferenceBookUX {

  @observable isMenuVisible = true;
  @observable activeSection = '1';
  @observable lastSection;

  constructor(course) {
    this.course = course;
    this.course.referenceBook.fetch().then(() => {
      if (this.activePage) { this.activePage.ensureLoaded(); }
    });
  }

  @computed get courseDataProps() {
    const { course } = this;
    return {
      'data-title': course.name,
      'data-book-title': course.bookName || '',
      'data-appearance': course.appearance_code,
    };
  }

  @action.bound setSection(section = '1') {
    if (this.activeSection !== section) {
      this.lastSection = this.activeSection;
    }
    this.activeSection = section;
    if (this.activePage) { this.activePage.ensureLoaded(); }
  }

  @computed get activePage() {
    return this.allPagesMap.get(this.activeSection);
  }

  @computed get toc() {
    return this.course.referenceBook.children;
  }

  @computed get allPagesMap() {
    return findAllPages(this.course.referenceBook, observable.map());
  }

  routerLinkProps(section) {
    if (!section) { return null; }
    return {
      to: 'viewReferenceBookSection',
      params: extend(Router.currentParams(), { section: section.chapter_section.asString }),
      query: Router.currentQuery(),
    };
  }

  @action.bound onPrevSection() {
    this.setSection(this.activePage.prevPage.chapter_section.asString);
  }

  @action.bound onNextSection() {
    this.setSection(this.activePage.nextPage.chapter_section.asString);
  }

  @computed get pageProps() {
    return { ux: this };
  }

  @computed get pagingProps() {
    return {
      onForwardNavigation: this.onNextSection,
      onBackwardNavigation: this.onPrevSection,
      isForwardEnabled: !!this.activePage.nextPage,
      isBackwardEnabled: !!this.activePage.prevPage,
      forwardRouterProps: this.routerLinkProps(this.activePage.nextPage),
      backwardRouterProps: this.routerLinkProps(this.activePage.prevPage),
    };
  }

}
