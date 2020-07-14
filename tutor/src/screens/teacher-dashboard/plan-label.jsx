import { React, observer, styled } from 'vendor';
import PropTypes from 'prop-types';
import TourAnchor from '../../components/tours/anchor';

const TRIANGLE = 5;

const Ribbon = styled.div`
  height: 0;
  border-bottom: ${TRIANGLE}px solid #f36a31;
  border-top: ${TRIANGLE}px solid #f36a31;
  border-right: ${TRIANGLE * 0.5}px solid transparent;
  display: flex;
  align-items: center;
`;

const Text = styled.span`
  color: white;
  margin: 0 5px;
  font-size: 8px;
`;

const GradeBanner = observer(({ plan }) => {
  if (!plan.isGradeable || !plan.ungraded_step_count) { return null; }
  return (
    <Ribbon>
      <Text>{plan.ungraded_step_count} NEW</Text>
    </Ribbon>
  );
});

const Label = styled.label`
  display: flex;
  margin: 0;
  align-items: center;
  cursor: pointer;
`;

const Title = styled.span`
  margin-left: 0.3rem;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
`;

@observer
class CoursePlanLabel extends React.Component {

  static propTypes = {
    plan: PropTypes.shape({
      title: PropTypes.string.isRequired,
      opensAt: PropTypes.string,
      opensAtString: PropTypes.string,
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
          <GradeBanner plan={plan} />
          <Title className="text" title={plan.title}>{plan.title}</Title>
        </Label>
      </TourAnchor>
    );
  }
}

export default CoursePlanLabel;
