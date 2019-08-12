import PropTypes from 'prop-types';
import React from 'react';
import { inject, observer } from 'mobx-react';
import { action, computed, observe, observable } from 'mobx';
import { Modal } from 'react-bootstrap';
import { pick } from 'lodash';
import Course from '../models/course';
import onboardingForCourse from '../models/course/onboarding';
import ModalManager from './modal-manager';
import TourContext from '../models/tour/context';
import Onboarding from '../models/course/onboarding/base';
import { autobind } from 'core-decorators';
import classnames from 'classnames';

export default
@inject((context) => pick(context, 'modalManager', 'tourContext', 'spyMode'))
@observer
class CourseNagModal extends React.Component {

  static propTypes = {
    course: PropTypes.instanceOf(Course),
    modalManager: PropTypes.instanceOf(ModalManager).isRequired,
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
      if (this.ux) {
        // always call ux.mount() before checking ux.priority
        this.ux.mount();
        this.props.modalManager.queue(this, this.ux.priority);
      }
      // the last component to queue itself should start the modalManager
      // call this even if the component did not queue itself so it still works for other components
      this.props.modalManager.start();
    }
    if (this.props.spyMode) {
      this.spyModeObserverDispose = observe(this.props.spyMode, 'isEnabled', this.onSpyModelChange);
    }
  }

  @computed get isReady() {
    return !this.isDismissed && this.ux && this.ux.isReady;
  }

  @autobind
  onSpyModelChange({ newValue: isEnabled }) {
    Onboarding.spyMode = isEnabled;
  }

  render() {
    if (!this.props.modalManager.canDisplay(this) || !this.isReady) { return null; }

    const NagComponent = this.ux.nagComponent;
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
