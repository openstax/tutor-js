import React from 'react';
import { findDOMNode } from 'react-dom';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { get } from 'lodash';
import { action, computed, observable } from 'mobx';
import { observer, inject } from 'mobx-react';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';
import User from '../../models/user';
import TourAnchor from '../tours/anchor';
import Chat from '../../models/chat';
import UserMenu from '../../models/user/menu';
import Icon from '../icon';
import SupportDocument from './support-document-link';
import TourContext from '../../models/tour/context';
import Router from '../../helpers/router';


const StudentPreview = observer(({ courseId, tourContext, ...props }, { router }) => {
  if( !courseId || !( User.isConfirmedFaculty || User.isUnverifiedInstructor ) ) { return null; }
  return (
    <MenuItem
      {...props}
      onClick={() => {
        router.history.push(Router.makePathname('studentPreview'));
      }}
    >
      <TourAnchor id="student-preview-link">
        <span className="control-label" title="See what students see">Student preview videos</span>
      </TourAnchor>
    </MenuItem>
  );
});

StudentPreview.contextTypes = {
  router: React.PropTypes.object,
};

const PageTips = observer(({ courseId, onPlayClick, tourContext, ...props }) => {
  if (!get(tourContext, 'hasTriggeredTour', false)){ return null; }
  return (
    <MenuItem
      className="page-tips"
      {...props}
      onSelect={onPlayClick}
    >
      <TourAnchor id="menu-option-page-tips">
        Page Tips
      </TourAnchor>
    </MenuItem>
  );
});


@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
export default class SupportMenu extends React.PureComponent {
  static propTypes = {
    tourContext: React.PropTypes.instanceOf(TourContext),
    courseId: React.PropTypes.string,
  }


  static defaultProps = {
    bsRole: 'menu',
  }

  static propTypes = {
    open: React.PropTypes.bool,
    courseId: React.PropTypes.string,
    onClose:  React.PropTypes.func,
    tourContext: React.PropTypes.object.isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  componentDidMount() {
    Chat.setElementVisiblity(findDOMNode(this.chatEnabled), findDOMNode(this.chatDisabled));
  }

  renderChat() {
    if (!Chat.isEnabled) { return null; }
    return [
      <MenuItem
        style={{ display: 'none' }}
        key="chat-enabled"
        className="chat enabled"
        ref={opt => this.chatEnabled = opt}
        onSelect={this.onSelect}
        onClick={Chat.start}
      >
        <Icon type='comments' /><span>Chat with Support</span>
      </MenuItem>,
      <MenuItem
        style={{ display: 'none' }}
        key="chat-disabled"
        className="chat disabled"
        onSelect={this.onSelect}
        ref={opt => this.chatDisabled = opt}
      >
        <Icon type='comments-o' /><span>Chat Support Offline</span>
      </MenuItem>,
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
    return `/accessibility-statement/${this.props.courseId || ''}`;
  }

  renderF() {
    const { open, onClose, rootCloseEvent, courseId } = this.props;

    return (
      <RootCloseWrapper noWrap
        onRootClose={onClose}
        disabled={!open}
        event={rootCloseEvent}
      >
      </RootCloseWrapper>
    );
  }

  @observable isOpen;
  @action.bound onMouseEnter() { this.isOpen = true; }
  @action.bound onMouseLeave() { this.isOpen = false; }
  @action.bound onToggle(isOpen) { this.isOpen = isOpen; }

  render() {
    const { open, onClose, rootCloseEvent, courseId } = this.props;

    return (
      <Dropdown
        id="support-menu"
        className="support-menu"
      >
        <Dropdown.Toggle
          ref={m => (this.dropdownToggle = m)}
          useAnchor={true}
          noCaret
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
        <Dropdown.Menu
          className="dropdown-menu dropdown-menu-right"
        >
          <PageTips onPlayClick={this.onPlayTourClick} {...this.props} />
          <MenuItem
            key="nav-help-link"
            className="-help-link"
            target="_blank"
            onSelect={this.onSelect}
            href={UserMenu.helpLinkForCourseId(courseId)}
          >
            <span>Help Articles</span>
          </MenuItem>
          <StudentPreview courseId={courseId} {...this.props} />
          <SupportDocument courseId={courseId} />
          <MenuItem
            key="nav-keyboard-shortcuts"
            className="-help-link"
            onSelect={this.onSelect}
            href={this.accessibilityLink}
            onClick={this.goToAccessibility}
          >
            <span>Accessibility Statement</span>
          </MenuItem>
          {this.renderChat()}
        </Dropdown.Menu>
      </Dropdown>
    );
  }

}
