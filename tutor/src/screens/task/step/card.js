import { React, PropTypes, observer, styled } from '../../../helpers/react';
import { Card } from 'react-bootstrap';

const StepCard = styled(Card)`
    min-height: 400px;
    width: 400px;
margin-top: 100px;
padding: 2rem;
`;
StepCard.displayName = 'StepCard';
StepCard.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StepCard;
