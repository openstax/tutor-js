import PropTypes from 'prop-types';
import React from 'react';
import { observable, action, computed } from 'mobx';
import { observer } from 'mobx-react';
import { Collapse } from 'react-bootstrap';
import { filter, extend, forEach, find } from 'lodash';
import styled from 'styled-components';
import BrowseTheBook from './buttons/browse-the-book';
import TriStateCheckbox from './tri-state-checkbox';
import cn from 'classnames';
import Loading from  'shared/components/loading-animation';
import BookModel from '../models/reference-book';
import CourseModel from '../models/course';
import ReferenceBookNode from '../models/reference-book/node';
import BookPartTitle from './book-part-title';
import { colors } from 'theme';

const SectionWrapper = styled.div`
  display: flex;
  height: 2.5rem;
  align-items: center;
  margin-left: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
  font-size: 1.6rem;
  > * { margin-left: 2rem; }
  input { font-size: 1.7rem; margin-left: 1.2rem; }
  border-bottom: ${props => props.theme.borders.box};
  padding: 1.8rem 0;
`;

@observer
class Section extends React.Component {
    static propTypes = {
        section: PropTypes.instanceOf(ReferenceBookNode).isRequired,
        selections: PropTypes.object.isRequired,
        onChange: PropTypes.func.isRequired,
    };

    isSelected = () => { return !!this.props.selections[this.props.section.id]; };

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound toggleSection() {
        this.props.onChange({ [this.props.section.id]: !this.isSelected() });
    }

    render() {
        const { section } = this.props;
        const classNames = cn('section', { selected: this.isSelected() });
        const checkBoxType = this.isSelected() ? 'checked' : 'unchecked';
        return (
            <SectionWrapper
                className={classNames}
                data-section-id={section.id}
                onClick={this.toggleSection}
            >
                <span className="section-checkbox">
                    <TriStateCheckbox
                        type={checkBoxType}
                        checkedColor={colors.orange} />
                </span>
                <BookPartTitle
                    className="section-title"
                    boldChapterSection
                    displayChapterSection={section.isChapterSectionDisplayed}
                    part={section}
                />
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
  margin-bottom: 0.5rem;
  padding: 1.8rem 0;
  > * { margin-left: 1rem; }
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
        chapter: PropTypes.instanceOf(ReferenceBookNode).isRequired,
        course: PropTypes.instanceOf(CourseModel),
        onChange: PropTypes.func.isRequired,
        selections: PropTypes.object.isRequired,
    };

    constructor(props) {
        super(props);
        modelize(this);
    }

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
                        <TriStateCheckbox
                            type={checkBoxType}
                            onClick={this.toggleSectionSelections}
                            checkedColor={colors.orange} />
                    </span>
                    <BookPartTitle
                        className="chapter-title"
                        label="Chapter"
                        displayChapterSection
                        part={chapter}
                    />
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
                        {chapter.children.assignable.map((section, i) =>
                            <Section key={i} {...this.props} section={section} />)}
                    </div>
                </Collapse>
            </ChapterWrapper>
        );
    }
}

@observer
export default
class SectionsChooser extends React.Component {
    static propTypes = {
        book: PropTypes.instanceOf(BookModel).isRequired,
        course: PropTypes.instanceOf(CourseModel),
        onSelectionChange: PropTypes.func,
        selectedPageIds: PropTypes.arrayOf(
            PropTypes.string
        ),
    };

    @observable selections = {};

    constructor(props) {
        super(props);
        modelize(this);
    }

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
        <>
          {book.chapters.map((chapter, i) =>
              <ChapterAccordion
                  key={i}
                  {...this.props}
                  onChange={this.onSectionSelectionChange}
                  selections={this.selections}
                  chapter={chapter}
              />)}
        </>
        );
    }
}
