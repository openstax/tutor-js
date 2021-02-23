import PropTypes from 'prop-types';
import React from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Collapse } from 'react-bootstrap';
import { filter, extend, forEach, find } from 'lodash';
import styled from 'styled-components';
import ChapterSection from '../../components/chapter-section';
import BrowseTheBook from '../../components/buttons/browse-the-book';
import TriStateCheckbox from '../../components/tri-state-checkbox';
import cn from 'classnames';
import Loading from 'shared/components/loading-animation';
import BookModel from '../../models/reference-book';
import CourseModel from '../../models/course';
import Node from '../../models/reference-book/node';
import BookPartTitle from '../../components/book-part-title';

const SectionWrapper = styled.div`
  display: flex;
  height: 2.5rem;
  align-items: center;
  margin-left: 0.5rem;
  cursor: pointer;
  font-size: 1.5rem;
  > * { margin-left: 1rem; }
  input { font-size: 1.7rem; margin-left: 1.2rem; }
  border-bottom: ${props => props.theme.borders.box};
`;

@observer
class Section extends React.Component {
  static propTypes = {
    section: PropTypes.instanceOf(Node).isRequired,
    selections: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
  };

  isSelected = () => { return !!this.props.selections[this.props.section.id]; };

  @action.bound toggleSection() {
    this.props.onChange({ [this.props.section.id]: !this.isSelected() });
  }

  render() {
    const { section } = this.props;
    const classNames = cn('section', { selected: this.isSelected() });
    return (
      <SectionWrapper
        className={classNames}
        data-section-id={section.id}
        onClick={this.toggleSection}
      >
        <span className="section-checkbox">
          <input type="checkbox" readOnly={true} checked={this.isSelected()} />
        </span>
        <BookPartTitle className="section-title" part={section} displayChapterSection={section.isChapterSectionDisplayed} />
      </SectionWrapper>
    );
  }
}

const ChapterHeading = styled.div`
  display: flex;
  height: 3.5rem;
  align-items: center;
  cursor: pointer;
  font-size: 1.7rem;
  border-bottom: ${props => props.theme.borders.box};
  > * {
  margin-left: 1rem;
  }
  .chapter-title {
    flex: 1;
  }
`;

const ChapterWrapper = styled.div`
  .browse-the-book {
  font-size: 1.4rem;
  margin-right: 2rem;
  }
`;

@observer
class ChapterAccordion extends React.Component {
  static propTypes = {
    book: PropTypes.instanceOf(BookModel).isRequired,
    chapter: PropTypes.instanceOf(Node).isRequired,
    course: PropTypes.instanceOf(CourseModel),
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
    this.props.chapter.children.assignable.forEach(pg => newSelections[pg.id] = selected);
    this.expanded = true;
    this.props.onChange(newSelections);
  };

  @action.bound onAccordianToggle() {
    this.expanded = !this.expanded;
  }

  render() {
    const { chapter, course } = this.props;
    const selected = filter(chapter.children, this.isSectionSelected);

    const checkBoxType = selected.length === chapter.children.assignable.length ? 'checked'
      : selected.length ? 'partial' : 'unchecked';

    return (
      <ChapterWrapper className="chapter"
        data-is-expanded={this.expanded}
      >
        <ChapterHeading
          role="button"
          data-chapter-section={chapter.chapter_section.chapter}
          onClick={this.onAccordianToggle}
        >
          <span className="chapter-checkbox">
            <TriStateCheckbox type={checkBoxType} onClick={this.toggleSectionSelections} />
          </span>
          <span className="chapter-number">Chapter <ChapterSection chapterSection={chapter.chapter_section} /> - </span>
          <BookPartTitle className="chapter-title" title={chapter.title} />
          {course &&
            <BrowseTheBook
              unstyled
              onClick={this.browseBook}
              page={chapter.children.first}
              course={course}
            >
              Browse this Chapter
            </BrowseTheBook>}
        </ChapterHeading>
        <Collapse in={this.expanded}>
          <div className="sections">
            {chapter.children.assignable.map((section) =>
              <Section key={section.cnx_id} {...this.props} section={section} />)}
          </div>
        </Collapse>
      </ChapterWrapper>
    );
  }
}

const SectionChooserWrapper = styled.div`
  border: ${props => props.theme.borders.box};
  border-radius: 4px;
`;

@observer
export default class SectionsChooser extends React.Component {

  static propTypes = {
    book: PropTypes.instanceOf(BookModel).isRequired,
    course: PropTypes.instanceOf(CourseModel),
    onSelectionChange: PropTypes.func,
    selectedPageIds: PropTypes.arrayOf(
      PropTypes.string
    ),
  };

  @observable selections = {};

  UNSAFE_componentWillMount() {
    this.props.book.ensureLoaded();

    this.copySelectionStateFrom(
      this.props.selectedPageIds ? this.props.selectedPageIds : []
    );
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
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
      <SectionChooserWrapper>
        {book.chapters.map((chapter) =>
          <ChapterAccordion
            key={chapter.id}
            {...this.props}
            onChange={this.onSectionSelectionChange}
            selections={this.selections}
            chapter={chapter}
          />)}
      </SectionChooserWrapper>
    );
  }
}
