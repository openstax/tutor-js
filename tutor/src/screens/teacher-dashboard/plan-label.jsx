import { React, observer, styled } from '../../helpers/react';
import PropTypes from 'prop-types';
import TourAnchor from '../../components/tours/anchor';
import TroubleIcon from '../../components/icons/trouble';

const Label = styled.label`
  > .ox-icon { margin-left: 0; }
`;

@observer
class CoursePlanLabel extends React.Component {

  static propTypes = {
    plan: PropTypes.shape({
      title: PropTypes.string.isRequired,
      opensAt: PropTypes.string,
    }).isRequired,
  };


  render() {
    const { plan } = this.props;

    return (
      <TourAnchor id="calendar-task-plan">
        <Label
          data-opens-at={plan.opensAtString}
          data-title={plan.title}
        >
          <TroubleIcon plan={plan} />
          {plan.title}
        </Label>
      </TourAnchor>
    );
  }
}

export default CoursePlanLabel;
