import PropTypes from 'prop-types';
import React from 'react';
import { computed, observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { first, partial, findIndex, isEmpty, sortBy } from 'lodash';
import cn from 'classnames';
import classnames from 'classnames';
import Pagination from 'ultimate-pagination';
import WindowSize from '../../models/window-size';
import ScrollTo from '../../helpers/scroll-to';
import { chapterSectionToNumber } from '../../helpers/content';

@observer
class Sectionizer extends React.Component {

  static propTypes = {
    chapter_sections:  PropTypes.array.isRequired,
    onScreenElements:  PropTypes.array.isRequired,
    nonAvailableWidth: PropTypes.number.isRequired,
    onSectionClick:    PropTypes.func,
    currentSection:    PropTypes.string,
    windowImpl:        PropTypes.object,
    initialScrollTarget: PropTypes.string,
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
    if (this.props.initialScrollTarget) {
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

  @computed get currentSection() {
    return isEmpty(this.props.onScreenElements) ? this.props.currentSection : first(this.props.onScreenElements);
  }

  @computed get scrollIndex() {
    return this.props.chapter_sections.indexOf(this.currentSection);
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
        key={cs}
        onClick={partial(this.selectSection, cs)}
        className={classnames('section', { active })}>
        {cs}
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

  renderCurrentLinks() {
    let i;
    const sections = sortBy(this.props.chapter_sections, chapterSectionToNumber);
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
