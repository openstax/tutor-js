import PropTypes from 'prop-types';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { action, observe, observable } from 'mobx';
import { Modal } from 'react-bootstrap';
import { pick } from 'lodash';
import Course from '../models/course';
import onboardingForCourse from '../models/course/onboarding';
import TourContext from '../models/tour/context';
import Onboarding from '../models/course/onboarding/base';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

export default
@inject((context) => pick(context, 'tourContext', 'spyMode'))
@observer
class CourseNagModal extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course),
    tourContext: PropTypes.instanceOf(TourContext).isRequired,
    spyMode: PropTypes.object,
  }

  @observable ux;

  @action.bound
  onDismiss() { this.isDismissed = true; }

  @observable isDismissed = false

  componentWillUnmount() {
    if (this.ux) {
      this.ux.close();
    }
    if (this.spyModeObserverDispose) { this.spyModeObserverDispose(); }
  }

  componentWillMount() {
    const { course } = this.props;
    if (course) {
      this.ux = onboardingForCourse(course, this.props.tourContext);
      this.ux.mount();
    }
    if (this.props.spyMode) {
      this.spyModeObserverDispose = observe(this.props.spyMode, 'isEnabled', this.onSpyModelChange);
    }
  }

  @autobind
  onSpyModelChange({ newValue: isEnabled }) {
    Onboarding.spyMode = isEnabled;
  }

  render() {
    const NagComponent = this.ux && this.ux.nagComponent;
    if (this.props.tourContext.tour || this.isDismissed || !NagComponent) {
      return null;
    }
    const className = classnames('onboarding', NagComponent.className);
    return (
      <Modal
        dialogClassName={className}
        backdropClassName={className}
        backdrop="static"
        className={className}
        onHide={this.onDismiss}
        show={true}
      >
        <NagComponent
          onDismiss={this.onDismiss}
          ux={this.ux}
        />
      </Modal>
    );
  }

}
