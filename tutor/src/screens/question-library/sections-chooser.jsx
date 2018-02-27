import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { isEmpty } from 'lodash';
import { Button } from 'react-bootstrap';
import Course from '../../models/course';
import { ExercisesMap } from '../../models/exercises';

import TourRegion from '../../components/tours/region';
import TourAnchor from '../../components/tours/anchor';
import BackButton from '../../components/buttons/back-button';
import Chooser from '../../components/sections-chooser';


@observer
export default class QLSectionsChooser extends React.Component {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course).isRequired,
    exercises: React.PropTypes.instanceOf(ExercisesMap).isRequired,
    onSelectionsChange: React.PropTypes.func.isRequired,
  };

  @observable pageIds;

  showQuestions() {
    this.props.exercises.fetchPages(
      this.props.course.ecosystem_id,
      this.pageIds,
    );
    this.props.onSelectionsChange(this.pageIds);
  }

  clearQuestions() {
    this.pageIds = [];
    this.props.onSelectionsChange(this.pageIds);
  }

  onSectionChange(pageIds) {
    this.pageIds = pageIds;
  }

  render() {
    return (
      <div className="sections-chooser panel">
        <div className="header">
          <div className="wrapper">
            <h2>
              Question Library
            </h2>
            <BackButton
              fallbackLink={{
                text: 'Back to Dashboard', to: 'dashboard', params: { courseId: this.props.courseId },
              }} />
          </div>
        </div>
        <TourRegion
          className="sections-list"
          id="question-library-sections-chooser"
          otherTours={['preview-question-library-sections-chooser', 'question-library-super']}
          courseId={this.props.courseId}>
          <Chooser
            onSelectionChange={this.onSectionChange}
            selectedSectionIds={this.pageIds}
            ecosystemId={this.props.course.ecosystem_id}
            chapters={TocStore.get(this.props.ecosystemId)}
          />
        </TourRegion>
        <div className="section-controls panel-footer">
          <div className="wrapper">
            <Button
              bsStyle="primary"
              disabled={isEmpty(this.pageIds)}
              onClick={this.showQuestions}
            >
              Show Questions
            </Button>
            <Button onClick={this.clearQuestions}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

}
