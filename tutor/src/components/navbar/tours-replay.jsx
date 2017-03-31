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
      { 'is-visible': get(this.props, 'tourContext.hasViewableTour') }
    );

    return (
      <TourAnchor
        role="button"
        id="tours-navbar-icon" tag="li"
        onClick={this.onReplayClicked}
        className={classes}
      >
        <svg
          width="100%" height="100%" viewBox="0 0 12 14" version="1.1"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d={[
            'M6.795,6.795l2.58,-1.17l-2.58,-1.17l-1.17,-2.58l-1.17,2.58l-2.58,1.17l2.58,',
            '1.17l1.17,2.58l1.17,-2.58Zm3.195,-6.795c0.34,0 0.635,0.12 0.885,0.36c0.25,',
            '0.24 0.375,0.53 0.375,0.87l0,8.76c0,0.34 -0.125,0.635 -0.375,0.885c-0.25,',
            '0.25 -0.545,0.375 -0.885,0.375l-2.49,0l-1.875,1.875l-1.875,-1.875l-2.49,0c',
            '-0.34,0 -0.635,-0.125 -0.885,-0.375c-0.25,-0.25 -0.375,-0.545 -0.375,-0.885l0,',
            '-8.76c0,-0.34 0.125,-0.63 0.375,-0.87c0.25,-0.24 0.545,-0.36 0.885,-0.36l8.73,0Z'].join('')}
          />
        </svg>
      </TourAnchor>
    );
  }
}
