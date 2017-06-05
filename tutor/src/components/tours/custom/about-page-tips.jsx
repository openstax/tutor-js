import React from 'react';
import { action } from 'mobx';
import { observer, inject } from 'mobx-react';

import TourContext from '../../../models/tour/context';

import { Tooltip } from 'react-joyride';

@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
export default class AboutPageTips extends React.PureComponent {
  // static propTypes = {
  //   tourContext: React.PropTypes.instanceOf(TourContext)
  // }

  @action.bound
  handleClick(clickEvent) {
    let parentRide = this.props.ride.joyrideRef;

    const { index, shouldRun } = parentRide.state;
    const { steps, type } = parentRide.props;
    const el = clickEvent.currentTarget.className.includes('joyride-') && [
      'A',
      'BUTTON'
    ].includes(clickEvent.currentTarget.tagName) ? clickEvent.currentTarget : clickEvent.target;
    const dataType = el.dataset.type;

    /* istanbul ignore else */
    if (el.className.indexOf('joyride-') === 0 && dataType === 'back') { 
      clickEvent.preventDefault();
      clickEvent.stopPropagation();
      parentRide.stop();
      parentRide.reset();
      this.props.tourContext.playTriggeredTours();
    } else {
      parentRide.onClickTooltip(clickEvent);
    }
  }

  render () {
    return (
      <Tooltip
        buttons={{primary: 'View later', secondary: 'View tips now'}}
        onClick={this.handleClick}
        {...this.props}
      />
    );
  }
}
