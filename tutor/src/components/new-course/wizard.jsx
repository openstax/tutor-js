import React from 'react';
import { observer } from 'mobx-react';
import { Button, Panel } from 'react-bootstrap';
import classnames from 'classnames';
import { keys, isFunction, isEmpty, invoke } from 'lodash';
import { autobind } from 'core-decorators';

import TutorRouter from '../../helpers/router';


import { NewCourseActions, NewCourseStore } from '../../flux/new-course';
import { CourseActions, CourseStore } from '../../flux/course';
import { CourseListingStore } from '../../flux/course-listing';

import CourseOfferingTitle from './offering-title';
import OXFancyLoader from '../ox-fancy-loader';

import course_type     from './select-type';
import offering_id     from './select-course';
import term            from './select-dates';
import new_or_copy     from './new-or-copy';
import cloned_from_id  from './course-clone';
import details         from './course-details';
import build           from './build-course';

const STAGES = {
  course_type, offering_id, term, new_or_copy, cloned_from_id, details, build,
};

const STAGE_KEYS = keys(STAGES);

const componentFor = index => STAGES[ STAGE_KEYS[ index ] ];

@observer
export default class NewCourseWizard extends React.PureComponent {

  static propTypes = {
    isLoading: React.PropTypes.bool.isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = { currentStage: 0, firstStage: 0 };
  }

  componentWillMount() {
    NewCourseActions.initialize(
      TutorRouter.currentParams()
    );
    this.setStage();
  }

  setStage() {
    let firstStage;
    if (STAGES.offering_id.shouldSkip()) {
      firstStage = 2;
    } else {
      firstStage = NewCourseStore.canSelectCourseType() ? 0 : 1;
    }
    this.setState({ firstStage, currentStage: firstStage });
  }

  componentWillReceiveProps(nextProps) {
    // we're switching from loading to not loading
    if (this.props.isLoading && !nextProps.isLoading) {
      this.setStage();
    }
  }


  onContinue() { return this.go(1); }

  onBack() { return this.go(-1); }

  go(amt) {
    let stage = this.state.currentStage;
    while (invoke(componentFor(stage + amt), 'shouldSkip') === true) {
      stage += amt;
    }
    this.setState({ currentStage: stage + amt });
  }

  @autobind
  BackButton() {
    if (this.state.currentStage === this.state.firstStage) { return null; }
    return (
      <Button onClick={this.onBack} className="back">
        Back
      </Button>
    );
  }

  @autobind
  Footer() {
    const Component = componentFor(this.state.currentStage);
    if (Component.Footer != null) {
      return (
        <Component.Footer course={NewCourseStore.newCourse()} />
      );
    } else {
      return (
        (
          <div className="controls">
            <Button onClick={this.onCancel} className="cancel">
              Cancel
            </Button>
            {React.createElement(this.BackButton, null)}
            <Button
              onClick={this.onContinue}
              bsStyle="primary"
              className="next"
              disabled={!NewCourseStore.isValid( STAGE_KEYS[this.state.currentStage] )}>
              Continue
            </Button>
          </div>
        )
      );
    }
  }

  @autobind
  Title() {
    const { currentStage } = this.state;
    let { title } = componentFor(currentStage);
    if (isFunction(title)) { title = title(); }
    let offeringId = NewCourseStore.get('offering_id');

    if (currentStage === (STAGE_KEYS.length - 1)) {
      const newCourse = NewCourseStore.newCourse();
      if (newCourse != null) { offeringId = newCourse.offering_id; }
    }

    if ((offeringId != null) && (currentStage > 1)) {
      return (
        (
          <CourseOfferingTitle offeringId={offeringId}>
            {title}
          </CourseOfferingTitle>
        )
      );
    } else {
      return (
        (
          <div>
            {title}
          </div>
        )
      );
    }
  }

  onCancel() {
    NewCourseActions.reset();
    return (
      this.context.router.transitionTo('/dashboard')
    );
  }

  render() {
    const { isLoading } = this.props;
    const isBuilding = NewCourseStore.isBuilding();

    const Component = componentFor(this.state.currentStage);

    const wizardClasses = classnames('new-course-wizard', STAGE_KEYS[this.state.currentStage], {
      'is-loading': isLoading || isBuilding,
      'is-building': isBuilding,
    });

    return (
      <Panel
        header={React.createElement(this.Title, null)}
        className={wizardClasses}
        footer={React.createElement(this.Footer, null)}>
        <div className="panel-content">
          <OXFancyLoader isLoading={isLoading || isBuilding} />
          {!isLoading ? <Component /> : undefined}
        </div>
      </Panel>
    );
  }
}
