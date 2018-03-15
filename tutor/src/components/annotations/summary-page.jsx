import React from 'react';
import { readonly } from 'core-decorators';
import { map, keys, pickBy, isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import SectionsFilter from './sections-filter';
import AnnotationCard from './annotation-card';
import SummaryPopup from "./summary-popup";
import AnnotationsMap from '../../models/annotations';

@observer
export default class AnnotationSummaryPage extends React.Component {

  static propTypes = {
    annotations: React.PropTypes.instanceOf(AnnotationsMap).isRequired,
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
    return this.props.annotations.byCourseAndPage[this.props.courseId];
  }

  @computed get selectedAnnotations() {
    return pickBy(this.annotationsBySection, (notes, cs) => this.selectedSections.get(cs));
  }

  renderEmpty() {
    return (
      <div className="summary-page">
        <div className="annotations">
          <h1>
            Highlights and annotations
          </h1>
          <h4>
            Here’s where you will see a summary of your highlights and annotations.
          </h4>
        </div>
      </div>
    );
  }

  renderEmptyMessage() {
    if (isEmpty(this.selectedAnnotations)) {
      return (
        <div className="annotations">
          <h3>This page has no annotations</h3>
          <p>Select a section from the picker above to display it’s annotations</p>
        </div>
      );
    } else {
      return null;
    }
  }

  render() {
    if (!keys(this.annotationsBySection).length) {
      return this.renderEmpty();
    }

    return (
      <div className="summary-page">
        <h1>
          Highlights and annotations
        </h1>
        <div className="filter-area">
          <SectionsFilter
            sections={this.annotationsBySection}
            selected={this.selectedSections}
          />
          <SummaryPopup annotations={this.selectedAnnotations} courseId={this.props.courseId} />
        </div>
        {this.renderEmptyMessage()}
        <div className="annotations">
          {map(this.selectedAnnotations, (notes, ch) =>
            <div key={ch} className="section">
              <h2>{notes[0].formattedChapterSection} {notes[0].title}</h2>
              <div className="section-annotations-list">
                {map(notes, (annotation) => (
                  <AnnotationCard
                    key={annotation.id}
                    annotation={annotation}
                    onDelete={this.props.onDelete}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

}
