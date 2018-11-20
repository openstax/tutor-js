import PropTypes from 'prop-types';
import React from 'react';
import { readonly } from 'core-decorators';
import { map, keys, pickBy, isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import { observable, action, computed } from 'mobx';
import SectionsFilter from './sections-filter';
import AnnotationCard from './annotation-card';
import SummaryPopup from './summary-popup';
import AnnotationsMap from '../../models/annotations';

export default
@observer
class AnnotationSummaryPage extends React.Component {

  static propTypes = {
    annotations: PropTypes.instanceOf(AnnotationsMap).isRequired,
    onDelete: PropTypes.func.isRequired,
    currentChapter: PropTypes.number.isRequired,
    currentSection: PropTypes.number.isRequired,
    courseId: PropTypes.string.isRequired,
  };

  @readonly selectedSections = observable.map();

  resetToSection(chapter, section) {
    this.selectedSections.clear();
    this.selectedSections.set(`${chapter}.${section}`, true);
  }

  componentWillMount() {
    this.resetToSection(this.props.currentChapter, this.props.currentSection);
  }

  componentDidMount() {
    this.prepareFocus();
  }

  componentWillReceiveProps(nextProps) {
    if (
      nextProps.currentSection !== this.props.currentSection ||
        nextProps.currentChapter !== this.props.currentChapter
    ) {
      this.resetToSection(nextProps.currentChapter, nextProps.currentSection);
    }
  }

  prepareFocus() {
    const { containerRef } = this;
    const focusAnchor = document.createElement('a');

    focusAnchor.setAttribute('href', '#');
    containerRef.insertBefore(focusAnchor, containerRef.firstChild);
    focusAnchor.focus();
    focusAnchor.addEventListener('blur', () => containerRef.removeChild(focusAnchor), false);
  }

  @action.bound onDelete(...args) {
    this.props.onDelete(...args);
    this.prepareFocus();
  }

  @computed get annotationsBySection() {
    return this.props.annotations.byCourseAndPage[this.props.courseId];
  }

  @computed get selectedAnnotations() {
    return pickBy(this.annotationsBySection, (notes, cs) => this.selectedSections.get(cs));
  }

  renderEmpty() {
    return (
      <div className="summary-page" ref={ref => this.containerRef = ref}>
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
      <div className="summary-page" ref={ref => this.containerRef = ref}>
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
              {map(notes, (annotation) => (
                <AnnotationCard
                  key={annotation.id}
                  annotation={annotation}
                  onDelete={this.onDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

};
