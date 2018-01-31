import React from 'react';
import { readonly } from 'core-decorators';
import { map, keys, pickBy, isEmpty } from 'lodash';
import { observer } from 'mobx-react';
import { observable, computed } from 'mobx';
import SectionsFilter from './sections-filter';
import AnnotationCard from './annotation-card';
import User from '../../models/user';
import SummaryPopup from "./summary-popup";
import SummaryListing from './summary-listing';

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
          <h2>No sections are selected</h2>
          <h3>Select at least one section to display it’s annotations</h3>
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
          <SummaryPopup annotations={this.selectedAnnotations} />
        </div>
        {this.renderEmptyMessage()}
        <SummaryListing annotations={this.selectedAnnotations} />
      </div>
    );
  }

}
