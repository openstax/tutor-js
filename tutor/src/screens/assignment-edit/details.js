import { React, PropTypes, styled, observer } from 'vendor';
import { AssignmentBuilder } from './builder';
import DetailsBody from './details-body';

const StyledDetailsBody = styled(DetailsBody)`
  padding-left: 10.4rem;
`;

const Details = observer(({ ux }) => {
  return (
    <AssignmentBuilder
      title="Add Details"
      ux={ux}
    >
      <StyledDetailsBody ux={ux} />
    </AssignmentBuilder>
  );
});

Details.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Details;
