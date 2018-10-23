import PropTypes from 'prop-types';
import React from 'react';
import { action } from 'mobx';
import { observer, inject } from 'mobx-react';

import TourContext from '../../../models/tour/context';
import TourStep from '../../../models/tour/step';

import { Tooltip } from 'react-joyride';

import defaultsDeep from 'lodash/defaultsDeep';
import omit         from 'lodash/omit';
import classnames   from 'classnames';

import { bindClickHandler } from './common';

export default
@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
class TipsNowOrLater extends React.Component {
  static propTypes = {
    tourContext: PropTypes.object.isRequired,
    step:  PropTypes.object.isRequired,
    className: PropTypes.string,
    buttons: PropTypes.object,
    style: PropTypes.object,
  }

  @action.bound
  handleClick = bindClickHandler.call(this, { next: this.triggerPageTips.bind(this) });

  triggerPageTips() {
    this.props.step.joyrideRef.props.callback({
      type: 'finished',
      action: 'finished',
    });
    this.props.tourContext.playTriggeredTours();
    return true;
  }

  render () {
    const { step, className } = this.props;
    const buttons = { primary: 'View tips now', skip: 'View later' };

    step.isFixed = true;

    defaultsDeep(step.style, this.props.style);
    defaultsDeep(buttons, omit(this.props.buttons, 'secondary'));

    return (
      <Tooltip
        {...omit(this.props, 'style', 'buttons')}
        className={classnames('tips-now-or-later', className)}
        step={step}
        buttons={buttons}
        onClick={this.handleClick}
      />
    );
  }
};
