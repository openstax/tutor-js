import {
    React, PropTypes, observer,
} from 'vendor';
import Spotlight from './spotlight';
import Floater from 'react-floater';
import STEPS from './custom';

@observer
export default class TourStep extends React.Component {

  static propTypes = {
      step: PropTypes.object.isRequired,
      ride: PropTypes.object.isRequired,
  }

  styles = {
      floater: {
          maxWidth: '100%',
      },
      container: {
          padding: 0,
          borderRadius: '4px',
      },
      options: {
          zIndex: 1501,
      },
  };


  render() {
      const { step, ride } = this.props;
      const Step = STEPS[step.customComponent || 'Standard'];

      const tip = (
          <Floater
              open={true}
              debug={ride.context.emitDebugInfo}
              autoOpen={true}
              key={step.anchor_id}
              target={step.target}
              styles={this.styles}
              disableAnimation={true}
              placement={step.placement}
              content={<Step step={step} ride={ride} />}
          />
      );
      if (step.shouldShowSpotlight) {
          return (
              <Spotlight step={step} ride={ride}>
                  {tip}
              </Spotlight>
          );
      }
      return tip;
  }

}
