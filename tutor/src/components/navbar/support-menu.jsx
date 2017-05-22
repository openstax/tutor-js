import React from 'react';
import { Dropdown, MenuItem } from 'react-bootstrap';
import { get } from 'lodash';
import { action } from 'mobx';
import { observer, inject } from 'mobx-react';

import UserMenu from '../../models/user/menu';
import SupportMenuIcon from './support-menu-icon';
import TourContext from '../../models/tour/context';

@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
export default class SupportMenu extends React.PureComponent {
  static propTypes = {
    tourContext: React.PropTypes.instanceOf(TourContext),
    courseId: React.PropTypes.string,
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
        Page Tips
      </MenuItem>
    );
  }

  render() {
    return (
      <Dropdown
        id="support-menu"
        pullRight
        className="support-menu"
      >
        <Dropdown.Toggle
          noCaret
          useAnchor={true}
        >
          <SupportMenuIcon />
        </Dropdown.Toggle>
        <Dropdown.Menu >
          {this.renderPageTipsOption()}
          <MenuItem
            key="nav-help-link"
            className="-help-link"
            target="_blank"
            href={UserMenu.helpLinkForCourseId(this.props.courseId)}
          >
            <span>
              Get Help
            </span>
          </MenuItem>
        </Dropdown.Menu>
      </Dropdown>
    );


  }
}
