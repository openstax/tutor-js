import React from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { filter, isEmpty, extend, forEach, find } from 'lodash';
import { Accordion, Panel } from 'react-bootstrap';

import ChapterSection from './task-plan/chapter-section';
import BrowseTheBook from './buttons/browse-the-book';
import TriStateCheckbox from './tri-state-checkbox';
import classnames from 'classnames';

import BookModel from '../models/reference-book';
import ChapterModel from '../models/reference-book/chapter';
import PageModel from '../models/reference-book/page';

class Page extends React.Component {
  static propTypes = {
    page: React.PropTypes.instanceOf(PageModel).isRequired,
    selections: React.PropTypes.object.isRequired,
    onChange: React.PropTypes.func.isRequired,
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
    book: React.PropTypes.instanceOf(BookModel).isRequired,
    chapter: React.PropTypes.instanceOf(ChapterModel).isRequired,
    onChange: React.PropTypes.func.isRequired,
    selections: React.PropTypes.object.isRequired,
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
    const {chapter } = this.props;
    const selected = filter(chapter.children, this.isSectionSelected);

    const checkBoxType = selected.length === chapter.children.length ? 'checked'
      : selected.length ? 'partial' : 'unchecked';

    const classNames = classnames('chapter-heading', {'empty-chapter': isEmpty(chapter.children)});

    return (
      <div className={classNames} data-chapter-section={chapter.chapter_section.chapter}>
        <span className="chapter-checkbox">
          <TriStateCheckbox type={checkBoxType} onClick={this.toggleSectionSelections} />
        </span>
        <span className="chapter-number">
          Chapter <ChapterSection section={chapter.chapter_section.asString} /> - </span>
        <span className="chapter-title"> {chapter.title} </span>
        <BrowseTheBook
          ecosystemId={String(this.props.book.id)}
          unstyled={true}
          onClick={this.browseBook}
          className="browse-book"
          section={chapter.chapter_section.asString}
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
      <Accordion
        onSelect={this.onAccordianToggle}
        activeKey={this.expanded ? chapter.id : ''}
      >
        <Panel key={chapter.id} header={this.renderHeader()} eventKey={chapter.id}>
          {chapter.children.map((page) =>
            <Page key={page.cnx_id} {...this.props} page={page} />)}
        </Panel>
      </Accordion>
    );
  }
}

export default class SectionsChooser extends React.Component {

  static propTypes = {
    book: React.PropTypes.instanceOf(BookModel).isRequired,
    onSelectionChange: React.PropTypes.func,
    selectedSectionIds: React.PropTypes.arrayOf(
      React.PropTypes.string
    ),
  };

  @observable selections = {};

  componentWillMount() {
    this.copySelectionStateFrom(
      this.props.selectedSectionIds ? this.props.selectedSectionIds : []
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedSectionIds) {
      this.copySelectionStateFrom(nextProps.selectedSectionIds);
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
    return (
      <div className="sections-chooser">
        {this.props.book.children.map((chapter) =>
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
}
