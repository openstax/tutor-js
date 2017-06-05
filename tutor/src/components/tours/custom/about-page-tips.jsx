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
    const el = this.getClickTarget(clickEvent);
    const dataType = el.dataset.type;

    if (el.className.indexOf('joyride-') === 0 && dataType === 'back') {
      clickEvent.preventDefault();
      clickEvent.stopPropagation();

      return this.triggerPageTips();
    }

    this.props.ride.joyrideRef.onClickTooltip(clickEvent);
  }

  getClickTarget(clickEvent) {
    return clickEvent.currentTarget.className.includes('joyride-') && [
      'A',
      'BUTTON'
    ].includes(clickEvent.currentTarget.tagName) ? clickEvent.currentTarget : clickEvent.target;
  }

  triggerPageTips() {
    this.props.ride.joyrideRef.props.callback({
      type: 'finished',
      action: 'finished'
    });
    this.props.tourContext.playTriggeredTours();
  }

  render () {
    return (
      <Tooltip
        {...this.props}
        buttons={{primary: 'View later', secondary: 'View tips now'}}
        onClick={this.handleClick}
      />
    );
  }
}
