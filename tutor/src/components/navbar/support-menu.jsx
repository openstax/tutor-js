import React from 'react';
import { findDOMNode } from 'react-dom';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { get } from 'lodash';
import { action } from 'mobx';
import { observer, inject } from 'mobx-react';

import TourAnchor from '../tours/anchor'
import Chat from '../../models/chat';
import UserMenu from '../../models/user/menu';
import Icon from '../icon';
import TourContext from '../../models/tour/context';


@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
export default class SupportMenu extends React.PureComponent {
  static propTypes = {
    tourContext: React.PropTypes.instanceOf(TourContext),
    courseId: React.PropTypes.string,
  }

  componentDidMount() {
    Chat.setElementVisiblity(findDOMNode(this.chatEnabled), findDOMNode(this.chatDisabled));
  }

  @action.bound
  onPlayTourClick() {
    // close the menu so it's not stuck open while tours play
    this.dropdownToggle.props.onClick();
    this.props.tourContext.playTriggeredTours();
  }

  renderPageTipsOption() {
    if (!get(this.props, 'tourContext.hasTriggeredTour', false)){ return null; }
    return (
      <MenuItem
        className="page-tips"
        onSelect={this.onPlayTourClick}
      >
        <TourAnchor id="menu-option-page-tips">
          Page Tips
        </TourAnchor>
      </MenuItem>
    );
  }

  renderChat() {
    if (!Chat.isEnabled) { return null; }
    return [
      <MenuItem
        style={{ display: 'none' }}
        key="chat-enabled"
        className="chat enabled"
        ref={opt => this.chatEnabled = opt}
        onClick={Chat.start}
      >
        <Icon type='comments' /><span>Chat with Support</span>
      </MenuItem>,
      <MenuItem
        style={{ display: 'none' }}
        key="chat-disabled"
        className="chat disabled"
        ref={opt => this.chatDisabled = opt}
      >
        <Icon type='comments-o' /><span>Chat support offline</span>
      </MenuItem>,
    ];
  }

  render() {
    return (
      <Dropdown
        id="support-menu"
        className="support-menu"
      >
        <Dropdown.Toggle
          ref={m => (this.dropdownToggle = m)}
          useAnchor={true}
        >
          <Icon type="question-circle" />
          <span title="Page tips and support" className="control-label">Help</span>
        </Dropdown.Toggle>
        <TourAnchor
          tag="ul"
          bsRole="menu"
          id="support-menu-button"
          ariaLabelledby="support-menu"
          className="dropdown-menu dropdown-menu-right"
        >
          {this.renderPageTipsOption()}
          <MenuItem
            key="nav-help-link"
            className="-help-link"
            target="_blank"
            href={UserMenu.helpLinkForCourseId(this.props.courseId)}
          >
            <span>Help Articles</span>
          </MenuItem>
          {this.renderChat()}
        </TourAnchor>
      </Dropdown>
    );


  }
}
