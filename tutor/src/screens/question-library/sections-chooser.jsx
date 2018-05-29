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
    isHidden: React.PropTypes.bool.isRequired,
  };

  @observable pageIds = [];

  @action.bound showQuestions() {
    this.props.exercises.fetch({
      limit: false,
      course: this.props.course,
      page_ids: this.pageIds.peek(),
    });
    this.props.onSelectionsChange(this.pageIds);
  }

  clearQuestions() {
    this.pageIds = [];
    this.props.onSelectionsChange(this.pageIds);
  }

  @action.bound onSectionChange(pageIds) {
    this.pageIds = pageIds;
  }

  render() {
    if (this.props.isHidden) {
      return null;
    }

    return (
      <div className="sections-chooser panel">
        <div className="header">
          <div className="wrapper">
            <h2>
              Question Library
            </h2>
            <BackButton
              fallbackLink={{
                text: 'Back to Dashboard', to: 'dashboard', params: { courseId: this.props.course.id },
              }} />
          </div>
        </div>
        <TourRegion
          className="sections-list"
          id="question-library-sections-chooser"
          otherTours={['preview-question-library-sections-chooser', 'question-library-super']}
          courseId={this.props.course.id}>
          <Chooser
            onSelectionChange={this.onSectionChange}
            selectedPageIds={this.pageIds.peek()}
            book={this.props.course.referenceBook}
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
