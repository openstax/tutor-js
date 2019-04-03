import { React, PropTypes, cn, styled } from '../../../helpers/react';
import Theme from '../../../theme';

const InnerStepCard = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 400px;
  max-width: 960px;
  min-width: 500px;
  border-radius: 0.25rem;
  margin: auto;
  border: 1px solid ${Theme.colors.neutral.light};
  border-radius: 0.25rem;
  background-color: white;
  ${props => !props.unpadded && 'padding: 50px 140px;'}
`;

const OuterStepCard = styled.div`
  padding: 2rem;
`;

const StepCard = ({ unpadded, className, children }) => (
  <OuterStepCard>
    <InnerStepCard
      unpadded={unpadded}
      className={className}
    >
      {children}
    </InnerStepCard>
  </OuterStepCard>
);

StepCard.propTypes = {
  unpadded: PropTypes.bool,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export { StepCard };
