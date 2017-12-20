import React from 'react';
import { readonly } from 'core-decorators';
import { map, keys, pickBy } from 'lodash';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import SectionsFilter from './sections-filter';
import AnnotationCard from './annotation-card';
import User from '../../models/user';

@observer
export default class AnnotationSummaryPage extends React.Component {

  static propTypes = {
    onDelete: React.PropTypes.func.isRequired,
    currentChapter: React.PropTypes.number.isRequired,
    currentSection: React.PropTypes.number.isRequired,
    courseId: React.PropTypes.string.isRequired,
  };

  @readonly selectedSections = observable.map();

  resetToSection(chapter, section) {
    this.selectedSections.clear();
    this.selectedSections.set(`${chapter}.${section}`, true);
  }

  componentWillMount() {
    this.resetToSection(this.props.currentChapter, this.props.currentSection);
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.currentSection !== this.props.currentSection ||
        nextProps.currentChapter !== this.props.currentChapter
    ) {
      this.resetToSection(nextProps.currentChapter, nextProps.currentSection);
    }
  }

  @computed get annotationsBySection() {
    return User.annotations.byCourseAndPage[this.props.courseId];
  }

  @computed get selectedAnnotations() {
    return pickBy(this.annotationsBySection, (notes, cs) => this.selectedSections.get(cs));
  }

  renderEmpty() {
    return (
      <div className="summary-page">
        <div className="annotations">
          <h3>No notes have been created yet</h3>
        </div>
      </div>
    );
  }

  render() {
    if (!keys(this.annotationsBySection).length) {
      return this.renderEmpty();
    }

    return (
      <div className="summary-page">
        <div className="filter-area">
          <SectionsFilter
            sections={this.annotationsBySection}
            selected={this.selectedSections}
          />
        </div>
        <div className="annotations">
          {map(this.selectedAnnotations, (notes, ch) =>
            <div key={ch}>
              <h1>{notes[0].formattedChapterSection} {notes[0].title}</h1>
              {map(notes, (annotation) => (
                <AnnotationCard
                  key={annotation.id}
                  annotation={annotation}
                  onDelete={this.props.onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

}
