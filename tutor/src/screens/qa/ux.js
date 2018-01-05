import { observable, computed, action } from 'mobx';
import { pick, assign, extend } from 'lodash';
import MenuToggle from '../../components/book-menu/toggle';
import EcosystemSelector from './ecosystem-selector';
import Router from '../../helpers/router';
import Ecosystems from '../../models/ecosystems';

// menu width (300) + page width (1000) + 50 px padding
// corresponds to @reference-book-page-width and @reference-book-menu-width in variables.scss
const MENU_VISIBLE_BREAKPOINT = 1350;

export default class QaScreenUX {

  @observable ecosystemId;
  @observable section;
  @observable isMenuVisible = window.innerWidth > MENU_VISIBLE_BREAKPOINT;

  constructor(router) {
    this.router = router;
  }

  update(props) {
    assign(this, pick(props, 'ecosystemId', 'section'));
  }

  @action.bound toggleTocMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  @action.bound onEcosystemSelect(ecosystemId) {
    this.router.history.push(
      Router.makePathname('QADashboard', { ecosystemId }),
    );
  }

  @computed get ecosystem() {
    return Ecosystems.get(this.ecosystemId);
  }

  @computed get toc() {
    return this.ecosystem ? this.ecosystem.referenceBook.children : null;
  }

  @action.bound onMenuSelection(section) {
    this.setSection(section);
    if (this.isMenuOnTop) { this.isMenuVisible = false; }
  }

  routerLinkProps(section) {
    if (!section) { return null; }
    return {
      to: 'QADashboard',
      params: extend(Router.currentParams(), { section: section.chapter_section.asString }),
      query: Router.currentQuery(),
    };
  }

  setNavBar(nav) {
    nav.childProps.set('ux', this);
    nav.left.merge({
      'slide-out-menu-toggle': MenuToggle,
    });
    nav.right.merge({
      ecosystems: EcosystemSelector,
    });
  }

}
