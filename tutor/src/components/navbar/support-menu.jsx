import PropTypes from 'prop-types';
import React from 'react';
import { findDOMNode } from 'react-dom';
import { Dropdown } from 'react-bootstrap';
import { get } from 'lodash';
import { action, computed, observable, when } from 'mobx';
import { observer, inject } from 'mobx-react';
import User from '../../models/user';
import TourAnchor from '../tours/anchor';
import Chat from '../../models/chat';
import UserMenu from '../../models/user/menu';
import { Icon } from 'shared';
import SupportDocument from './support-document-link';
import BestPracticesGuide from './best-practices-guide';
import TourContext from '../../models/tour/context';
import Router from '../../helpers/router';
import Course from '../../models/course';
import Theme from '../../theme';

const StudentPreview = observer(({
  course, tourContext, ...props // eslint-disable-line no-unused-vars
}, { router }) => {
  if(
    !course ||
      !( User.isConfirmedFaculty || User.isUnverifiedInstructor ) ||
      (course && course.currentRole.isTeacherStudent)
  ) { return null; }
  return (
    <Dropdown.Item
      {...props}
      id="student-preview-videos"
      onClick={() => {
        router.history.push(Router.makePathname('studentPreview', { courseId: course.id }));
      }}
    >
      <TourAnchor id="student-preview-link">
        <span className="control-label" title="See what students see">Student preview videos</span>
      </TourAnchor>
    </Dropdown.Item>
  );
});

StudentPreview.contextTypes = {
  router: PropTypes.object,
};

const PageTips = observer(({ onPlayClick, tourContext, ...props }) => {
  if (!get(tourContext, 'hasTriggeredTour', false)){ return null; }
  return (
    <Dropdown.Item
      className="page-tips"
      {...props}
      onSelect={onPlayClick}
    >
      <TourAnchor id="menu-option-page-tips">
        Page Tips
      </TourAnchor>
    </Dropdown.Item>
  );
});


export default
@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
class SupportMenu extends React.Component {

  static propTypes = {
    tourContext: PropTypes.instanceOf(TourContext),
    course: PropTypes.instanceOf(Course),
    onClose:  PropTypes.func,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  @observable chatEnabled;
  @observable chatDisabled;

  renderChat() {
    if (!Chat.isEnabled) { return null; }
    return [
      <Dropdown.Item
        style={{ display: 'none' }}
        key="chat-enabled"
        className="chat enabled"
        ref={opt => this.chatEnabled = opt}
        onSelect={this.onSelect}
        onClick={Chat.start}
      >
        <Icon type='comments-solid' color={Theme.colors.controls.active} /><span>Chat with Support</span>
      </Dropdown.Item>,
      <Dropdown.Item
        style={{ display: 'none' }}
        key="chat-disabled"
        className="chat disabled"
        onSelect={this.onSelect}
        ref={opt => this.chatDisabled = opt}
      >
        <Icon type='comments' color={Theme.colors.states.disabled} /><span>Chat Support Offline</span>
      </Dropdown.Item>,
    ];
  }

  @action.bound
  onSelect() {
    this.props.onClose && this.props.onClose();
  }


  @action.bound
  onPlayTourClick() {
    this.onSelect();
    this.props.tourContext.playTriggeredTours();
  }

  @action.bound
  goToAccessibility(ev) {
    ev.preventDefault();
    this.context.router.history.push(this.accessibilityLink);
  }

  @computed
  get accessibilityLink() {
    return `/accessibility-statement/${(this.props.course && this.props.course.id) || ''}`;
  }

  componentDidMount() {
    when(
      () => this.chatEnabled && this.chatDisabled,
      () => Chat.setElementVisiblity(
        findDOMNode(this.chatEnabled),
        findDOMNode(this.chatDisabled)
      ),
    );
  }

  render() {
    const { course } = this.props;
    return (
      <Dropdown className="support-menu">
        <Dropdown.Toggle
          id="support-menu"
          ref={m => (this.dropdownToggle = m)}
          aria-label="Page tips and support"
          variant="ox"
        >
          <TourAnchor
            id="support-menu-button"
            aria-labelledby="support-menu"
            onSelect={this.onSelect}
          >
            <Icon type="question-circle" />
            <span title="Page tips and support" className="control-label">Help</span>
            <Icon type="angle-down" className="toggle" />
          </TourAnchor>
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <PageTips onPlayClick={this.onPlayTourClick} {...this.props} />
          <Dropdown.Item
            key="nav-help-link"
            className="-help-link"
            target="_blank"
            onSelect={this.onSelect}
            href={UserMenu.helpLinkForCourse(course)}
          >
            <span>Help Articles</span>
          </Dropdown.Item>
          <StudentPreview course={course} {...this.props} />
          <SupportDocument course={course} />
          <BestPracticesGuide course={course} />
          <Dropdown.Item
            key="nav-keyboard-shortcuts"
            className="-help-link"
            onSelect={this.onSelect}
            href={this.accessibilityLink}
            onClick={this.goToAccessibility}
          >
            <span>Accessibility Statement</span>
          </Dropdown.Item>
          {this.renderChat()}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

}
