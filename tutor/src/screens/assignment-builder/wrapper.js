import { React, PropTypes, styled } from '../../helpers/react';
import NudgeAvailableMessage from './nudge-is-available-message';

const StyledNudgeMessage = styled(NudgeAvailableMessage)`
  margin-bottom: 4rem;
  border-radius: 2px;
  font-size: 16px;
  padding-left: 28px;
`;

const Wrapper = styled.div`
  margin-top: 6rem;
  margin-left: auto;
  margin-right: auto;
  max-width: 1200px;
  padding: 2rem;
`;

const BuilderWrapper = ({ children, planType }) => (
  <Wrapper
    className={`${planType}-plan task-plan`}
    data-assignment-type={planType}
  >
    <StyledNudgeMessage planType={planType} />
    {children}
  </Wrapper>
);

BuilderWrapper.propTypes = {
  planType: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};


export default BuilderWrapper;
