import React from 'react';
import { findDOMNode } from 'react-dom';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { get } from 'lodash';
import { action } from 'mobx';
import { observer, inject } from 'mobx-react';
import RootCloseWrapper from 'react-overlays/lib/RootCloseWrapper';

import TourAnchor from '../tours/anchor';
import Chat from '../../models/chat';
import UserMenu from '../../models/user/menu';
import Icon from '../icon';
import SupportDocument from './support-document-link';
import TourContext from '../../models/tour/context';
import Router from '../../helpers/router';

@observer
class SupportMenuDropDown extends React.PureComponent {

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

  get accessibilityLink() {
    const { courseId } = Router.currentParams();
    return `/accessibility-statement/${courseId || ''}`;
  }

  render() {
    const { open, onClose, rootCloseEvent } = this.props;
    const { courseId } = Router.currentParams();

    const menu = (
      <TourAnchor
        tag="ul"
        bsRole="menu"
        id="support-menu-button"
        ariaLabelledby="support-menu"
        onSelect={this.onSelect}
        className="dropdown-menu dropdown-menu-right"
      >

        {this.renderPageTipsOption()}
        <MenuItem
          key="nav-help-link"
          className="-help-link"
          target="_blank"
          onSelect={this.onSelect}
          href={UserMenu.helpLinkForCourseId(courseId)}
        >
          <span>Help Articles</span>
        </MenuItem>

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
      </TourAnchor>
    );
    return (
      <RootCloseWrapper noWrap
        onRootClose={onClose}
        disabled={!open}
        event={rootCloseEvent}
      >
        {menu}
      </RootCloseWrapper>
    );
  }

}


@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
export default class SupportMenu extends React.PureComponent {
  static propTypes = {
    tourContext: React.PropTypes.instanceOf(TourContext),
    courseId: React.PropTypes.string,
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
          noCaret
        >
          <Icon type="question-circle" />
          <span title="Page tips and support" className="control-label">Help</span>
          <Icon type="angle-down" />
        </Dropdown.Toggle>
        <SupportMenuDropDown {...this.props} />
      </Dropdown>
    );

  }
}
