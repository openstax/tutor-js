import React from 'react';
import { inject, observer, PropTypes as MobxPropTypes } from 'mobx-react';
import { action, observe, observable } from 'mobx';
import { Modal } from 'react-bootstrap';
import { get, pick } from 'lodash';
import Course from '../../models/course';
import onboardingForCourse from '../../models/course/onboarding';
import TourContext from '../../models/tour/context';
import Onboarding from '../../models/course/onboarding/base';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

@inject((context) => pick(context, 'tourContext', 'spyMode'))
@observer
export default class CourseNagModal extends React.Component {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course),
    tourContext: React.PropTypes.instanceOf(TourContext).isRequired,
    spyMode: MobxPropTypes.observableObject,
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
        animation={false}
        dialogClassName={className}
        backdropClassName={className}
        className={className}
        show={!this.isDismissed}
        onHide={this.onClose}
      >
        <NagComponent
          onDismiss={this.onDismiss}
          ux={this.ux}
        />
      </Modal>
    );
  }


}
