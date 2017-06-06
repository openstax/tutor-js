import React from 'react';
import { action } from 'mobx';
import { observer, inject } from 'mobx-react';

import TourContext from '../../../models/tour/context';

import { Tooltip } from 'react-joyride';

import defaultsDeep from 'lodash/defaultsDeep';
import omit         from 'lodash/omit';

@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
export default class TipsNowOrLater extends React.PureComponent {
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
    const step = this.props.step;
    const buttons = { primary: 'View later', secondary: 'View tips now' };

    step.text = this.props.children;
    step.isFixed = true;

    defaultsDeep(step.style, this.props.style);
    defaultsDeep(buttons, this.props.buttons);

    return (
      <Tooltip
        position="left"
        {...omit(this.props, 'style', 'buttons')}
        step={step}
        buttons={buttons}
        onClick={this.handleClick}
      />
    );
  }
}
