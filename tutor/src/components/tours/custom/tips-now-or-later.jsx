import React from 'react';
import { action } from 'mobx';
import { observer, inject } from 'mobx-react';

import TourContext from '../../../models/tour/context';

import { Tooltip } from 'react-joyride';

import defaultsDeep from 'lodash/defaultsDeep';
import omit         from 'lodash/omit';
import classnames   from 'classnames';

import { bindClickHandler } from './common';

@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
export default class TipsNowOrLater extends React.PureComponent {
  // static propTypes = {
  //   tourContext: React.PropTypes.instanceOf(TourContext)
  // }

  @action.bound
  handleClick = bindClickHandler.call(this, {next: this.triggerPageTips.bind(this)});

  triggerPageTips() {
    this.props.step.joyrideRef.props.callback({
      type: 'finished',
      action: 'finished'
    });
    this.props.tourContext.playTriggeredTours();
    return true;
  }

  render () {
    const step = this.props.step;
    const buttons = { primary: 'View tips now', skip: 'View later' };
    const className = classnames('tips-now-or-later',  this.props.className);

    step.isFixed = true;

    defaultsDeep(step.style, this.props.style);
    defaultsDeep(buttons, omit(this.props.buttons, 'secondary'));

    return (
      <Tooltip
        {...omit(this.props, 'style', 'buttons')}
        className={className}
        step={step}
        buttons={buttons}
        onClick={this.handleClick}
      />
    );
  }
}
