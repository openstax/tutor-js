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
    this.props.tourContext.playTriggeredTours();
  }

  renderPageTipsOption() {
    if (!get(this.props, 'tourContext.hasElgibleTour', false)){ return null; }
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
        <Icon type='comment-o' /><span>Chat with Support</span>
      </MenuItem>,
      <MenuItem
        style={{ display: 'none' }}
        key="chat-disabled"
        className="chat disabled"
        ref={opt => this.chatDisabled = opt}
      >
        <Icon type='comment-o' /><span>Chat with Support</span>
      </MenuItem>,
    ];
  }

  render() {
    return (
      <Dropdown
        id="support-menu"
        pullRight
        className="support-menu"
      >
        <Dropdown.Toggle
          useAnchor={true}
        >
          <TourAnchor id="support-menu-button">
            <Icon type="question-circle" />
            <span className="control-label">Help</span>
          </TourAnchor>
        </Dropdown.Toggle>
        <Dropdown.Menu >
          {this.renderPageTipsOption()}
          {this.renderChat()}
          <MenuItem
            key="nav-help-link"
            className="-help-link"
            target="_blank"
            href={UserMenu.helpLinkForCourseId(this.props.courseId)}
          >
            <span>Get Help</span>
          </MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    );


  }
}
