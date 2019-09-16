import {
  React, PropTypes, action, observer, inject,
} from '../../../helpers/react';
import Standard from './standard';
import { Primary, TextAction } from './buttons';

// import TourContext from '../../../models/tour/context';
// import TourStep from '../../../models/tour/step';

export default
@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
class TipsNowOrLater extends React.Component {

  static propTypes = {
    ride: PropTypes.object.isRequired,
    step: PropTypes.object.isRequired,
    className: PropTypes.string,
    buttons: PropTypes.object,
    style: PropTypes.object,
  }

  // @action.bound
  // handleClick = bindClickHandler.call(this, { next: this.triggerPageTips.bind(this) });

  // triggerPageTips() {
  //   this.props.step.joyrideRef.props.callback({
  //     type: 'finished',
  //     action: 'finished',
  //   });
  //   this.props.tourContext.playTriggeredTours();
  //   return true;
  // }

  @action.bound onViewNowClick() {
    this.props.ride.context.playTriggeredTours();
  }

  @action.bound onViewLaterClick() {
    this.props.ride.cancel();
  }

  render () {
    const buttons = [
      <Primary key="p" onClick={this.onViewNowClick}>View tips now</Primary>,
      <TextAction key="l" onClick={this.onViewLaterClick}>View later</TextAction>,
    ];

    return (
      <Standard {...this.props} buttons={buttons} />
    );

    // const { step, className } = this.props;

    // return (
    //   <div dangerouslySetInnerHTML={{ __html: step.HTML}} />
    // );

    // const buttons = { primary: 'View tips now', skip: 'View later' };

    // step.isFixed = true;

    // defaultsDeep(step.style, this.props.style);
    // defaultsDeep(buttons, omit(this.props.buttons, 'secondary'));

    // return (
    //   <Tooltip
    //     {...omit(this.props, 'style', 'buttons')}
    //     className={classnames('tips-now-or-later', className)}
    //     step={step}
    //     buttons={buttons}
    //     onClick={this.handleClick}
    //   />
    // );

  }
}
