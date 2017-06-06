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

    if (el.className.indexOf('joyride-') === 0 && dataType === 'next') {
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
    const buttons = { primary: 'View tips now', skip: 'View later' };

    step.text = this.props.children;
    step.isFixed = true;

    step.style.footer = {
      width: '220px'
    };

    step.style.button = {
      float: 'left'
    };

    step.style.skip = {
      float: 'right',
      padding: '6px 12px',
      margin: 0
    };

    defaultsDeep(step.style, this.props.style);
    defaultsDeep(buttons, omit(this.props.buttons, 'secondary'));

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
