import React from 'react';
import { get } from 'lodash';
import { action } from 'mobx';
import { inject, observer } from 'mobx-react';
import classnames from 'classnames';

import User from '../../models/user';
import TourAnchor from '../tours/anchor';
import TourContext from '../../models/tour/context';

@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
export default class ToursReplay extends React.PureComponent {
  static propTypes = {
    tourContext: React.PropTypes.instanceOf(TourContext),
  }

  @action.bound
  onReplayClicked() {
    User.replayTours();
  }

  render() {
    const classes = classnames(
      'tours-replay', 'fa-stack fa-lg',
      { 'is-visible': get(this.props, 'tourContext.hasReplayableTours') }
    );

    return (
      <TourAnchor
        role="button"
        id="tours-navbar-icon" tag="li"
        onClick={this.onReplayClicked}
        className={classes}
      >
        <i className="fa fa-television fa-stack-2x"></i>
        <i className="fa fa-commenting-o fa-stack-1x"></i>
      </TourAnchor>
    );
  }
}
