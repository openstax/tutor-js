import PropTypes from 'prop-types';
import React from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { filter, isEmpty, extend, forEach, find } from 'lodash';
import { Card } from 'react-bootstrap';

import ChapterSection from './task-plan/chapter-section';
import BrowseTheBook from './buttons/browse-the-book';
import TriStateCheckbox from './tri-state-checkbox';
import classnames from 'classnames';
import Loading from './loading-screen';
import BookModel from '../models/reference-book';
import ChapterModel from '../models/reference-book/chapter';
import PageModel from '../models/reference-book/page';

@observer
class Page extends React.Component {
  static propTypes = {
    page: PropTypes.instanceOf(PageModel).isRequired,
    selections: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  isSelected = () => { return !!this.props.selections[this.props.page.id]; };

  @action.bound toggleSection() {
    this.props.onChange({ [this.props.page.id]: !this.isSelected() });
  }

  render() {
    const { page } = this.props;
    const classNames = classnames('section', { selected: this.isSelected() });
    return (
      <div
        className={classNames}
        data-page-id={page.id}
        onClick={this.toggleSection}
      >
        <span className="section-checkbox">
          <input type="checkbox" readOnly={true} checked={this.isSelected()} />
        </span>
        <ChapterSection section={page.chapter_section.asString} />
        <span className="section-title"> {page.title}</span>
      </div>
    );
  }
}

@observer
class ChapterAccordion extends React.Component {
  static propTypes = {
    book: PropTypes.instanceOf(BookModel).isRequired,
    chapter: PropTypes.instanceOf(ChapterModel).isRequired,
    onChange: PropTypes.func.isRequired,
    selections: PropTypes.object.isRequired,
  };

  @computed get isAnySelected() {
    return !!find(this.props.chapter.children, this.isSectionSelected);
  }

  @observable expanded = this.isAnySelected || '1' === this.props.chapter.chapter_section.asString;

  browseBook = (ev) => { return ev.stopPropagation(); }; // stop click from toggling the accordian

  isSectionSelected = (section) => { return this.props.selections[section.id]; };

  toggleSectionSelections = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    const selected = !this.isAnySelected;
    const newSelections = {};
    this.props.chapter.children.forEach(pg => newSelections[pg.id] = selected);
    this.expanded = true;
    this.props.onChange(newSelections);
  };

  renderHeader = () => {
    const { chapter } = this.props;
    const selected = filter(chapter.children, this.isSectionSelected);

    const checkBoxType = selected.length === chapter.children.length ? 'checked'
      : selected.length ? 'partial' : 'unchecked';

    const classNames = classnames('chapter-heading', { 'empty-chapter': isEmpty(chapter.children) });

    return (
      <div className={classNames} data-chapter-section={chapter.chapter_section.chapter}>
        <span className="chapter-checkbox">
          <TriStateCheckbox type={checkBoxType} onClick={this.toggleSectionSelections} />
        </span>
        <span className="chapter-number">
          Chapter <ChapterSection section={chapter.chapter_section.asString} /> - </span>
        <span className="chapter-title"> {chapter.title} </span>
        <BrowseTheBook
          unstyled
          tag="div"
          onClick={this.browseBook}
          chapterSection={chapter.chapter_section.asString}
          book={this.props.book}
        >
          Browse this Chapter
        </BrowseTheBook>
      </div>
    );
  };

  @action.bound onAccordianToggle() {
    this.expanded = !this.expanded;
  }

  render() {
    const { chapter } = this.props;
    return (
      <div className="accordian"
        onSelect={this.onAccordianToggle}
        activeKey={this.expanded ? chapter.id : ''}
      >
        <Card key={chapter.id} header={this.renderHeader()} eventKey={chapter.id}>
          {chapter.children.map((page) =>
            <Page key={page.cnx_id} {...this.props} page={page} />)}
        </Card>
      </div>
    );
  }
}

export default
@observer
class SectionsChooser extends React.Component {

  static propTypes = {
    book: PropTypes.instanceOf(BookModel).isRequired,
    onSelectionChange: PropTypes.func,
    selectedPageIds: PropTypes.arrayOf(
      PropTypes.string
    ),
  };

  @observable selections = {};

  componentWillMount() {
    this.props.book.ensureLoaded();

    this.copySelectionStateFrom(
      this.props.selectedPageIds ? this.props.selectedPageIds : []
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedPageIds) {
      this.copySelectionStateFrom(nextProps.selectedPageIds);
    }
  }

  @action.bound copySelectionStateFrom = (pageIds) => {
    const selections = {};
    pageIds.forEach(pgId => selections[pgId] = true);
    this.selections = selections;
  }

  getSelectedSectionIds = (selections = this.selections) => {
    const ids = [];
    forEach(selections, (isSelected, id) => {
      if (isSelected) { ids.push(id); }
    });
    return ids;
  }

  @action.bound onSectionSelectionChange(update) {
    this.selections = extend({}, this.selections, update);
    if (this.props.onSelectionChange) {
      this.props.onSelectionChange(this.getSelectedSectionIds(this.selections));
    }
  }

  render() {
    const { book } = this.props;

    if (book.api.isPending) {
      return <Loading />;
    }

    return (
      <div className="sections-chooser">
        {book.children.map((chapter) =>
          <ChapterAccordion
            key={chapter.id}
            {...this.props}
            onChange={this.onSectionSelectionChange}
            selections={this.selections}
            chapter={chapter}
          />)}
      </div>
    );
  }
};
