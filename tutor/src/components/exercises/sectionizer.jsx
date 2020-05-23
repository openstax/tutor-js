import PropTypes from 'prop-types';
import React from 'react';
import { computed, observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { first, partial, find, findIndex, isEmpty, sortBy } from 'lodash';
import cn from 'classnames';
import classnames from 'classnames';
import Pagination from 'ultimate-pagination';
import WindowSize from '../../models/window-size';
import ScrollTo from '../../helpers/scroll-to';
import ChapterSection from '../../models/chapter-section';

@observer
class Sectionizer extends React.Component {

  static propTypes = {
    chapter_sections:  PropTypes.arrayOf(
      PropTypes.instanceOf(ChapterSection)
    ).isRequired,
    onScreenElements:  PropTypes.array.isRequired,
    nonAvailableWidth: PropTypes.number.isRequired,
    onSectionClick:    PropTypes.func,
    currentSection:    PropTypes.instanceOf(ChapterSection),
    windowImpl:        PropTypes.object,
    initialScrollTarget: PropTypes.string,
    disableScroll:       PropTypes.bool,
  }

  scroller = new ScrollTo({ windowImpl: this.props.windowImpl });
  windowSize = new WindowSize(this.props.windowImpl);

  @computed get renderCount() {
    return (Math.floor( this.windowSize.width - this.props.nonAvailableWidth) / 42) - 2;
  }

  @observable scrollingTo = first(this.props.chapter_sections);

  // the below properties are read by the ScrollTo mixin
  scrollingTargetDOM = () => { return window.document; };

  getScrollTopOffset = () => { return 160; }; // 70px high control bar and a bit of padding

  componentDidMount() {
    if (this.props.disableScroll != false && this.props.initialScrollTarget) {
      this.scroller.scrollToSelector(this.props.initialScrollTarget);
    }
  }

  @action.bound selectSection(section) {
    if (this.props.onSectionClick) {
      this.props.onSectionClick(section);
    } else {
      this.scroller.scrollToSelector(`[data-section='${section}']`);
    }
  }

  @computed get onScreenSectionString() {
    return isEmpty(this.props.onScreenElements) ? this.props.currentSection : first(this.props.onScreenElements);
  }

  @computed get currentSection() {
    return this.props.currentSection ||
      find(this.sortedSections, { asString: this.onScreenSectionString });
  }

  @computed get scrollIndex() {
    return findIndex(this.sortedSections, { asString: this.onScreenSectionString });
  }

  @action.bound goBack() {
    const index = this.scrollIndex;
    const sections = this.props.chapter_sections;
    this.selectSection(sections[ index > 1 ? index - 1 : 0]);
  }

  @action.bound goNext() {
    const index = this.scrollIndex;
    const sections = this.props.chapter_sections;
    this.selectSection(
      sections[ index < sections.length ? index + 1 : sections.length - 1]
    );
  }

  renderLink(cs, active) {
    return (
      <div
        key={cs.asString}
        onClick={partial(this.selectSection, cs)}
        className={classnames('section', { active })}
      >
        {cs.asString}
      </div>
    );
  }

  renderEllipsis(cs) {
    return (
      <div
        key={cs}
        onClick={partial(this.selectSection, cs)}
        className="section ellipsis"
      >…</div>
    );
  }

  @computed get sortedSections() {
    return sortBy(this.props.chapter_sections, 'asNumber');
  }

  renderCurrentLinks() {
    let i;
    const sections = this.sortedSections;
    const active = this.currentSection;
    const currentPage = findIndex(sections, section => section === active);
    const links = [];
    if (sections.length > this.renderCount) {
      const pages = Pagination.getPaginationModel({ currentPage: currentPage + 1, totalPages: sections.length });
      for (i = 0; i < pages.length; i++) {
        const page = pages[i];
        if (page.type === Pagination.ITEM_TYPES.PAGE) {
          links.push( this.renderLink( sections[page.value - 1], page.isActive ) );

        } else if (page.type === Pagination.ITEM_TYPES.ELLIPSIS) {
          links.push( this.renderEllipsis( sections[page.value - 1] ) );
        }
      }
    } else {
      for (i = 0; i < sections.length; i++) {
        const section = sections[i];
        links.push( this.renderLink( section, i === currentPage) );
      }
    }

    return links;
  }

  render() {
    return (
      <div className="sectionizer">
        <div
          className={cn('prev', { disabled: 0 === this.scrollIndex })}
          onClick={this.goBack}>
          ❮❮
        </div>
        {this.renderCurrentLinks()}
        <div
          className="next"
          className={cn('next', { disabled: (this.props.chapter_sections.length - 1) === this.scrollIndex })}
          onClick={this.goNext}>
          ❯❯
        </div>
      </div>
    );
  }
}


export default Sectionizer;
