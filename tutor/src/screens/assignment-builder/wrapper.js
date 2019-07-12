import { React, PropTypes, styled } from '../../helpers/react';
import NudgeAvailableMessage from './nudge-is-available-message';
import UX from './ux';

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

const AssignmentBuilderWrapper = ({ ux: { plan: { type } }, children }) => {
  return (
    <Wrapper
      className={`${type}-plan task-plan`}
      data-assignment-type={type}
    >
      <StyledNudgeMessage planType={type} />
      {children}
    </Wrapper>
  );
};

AssignmentBuilderWrapper.propTypes = {
  ux: PropTypes.instanceOf(UX).isRequired,
  children: PropTypes.node.isRequired,
};

export default AssignmentBuilderWrapper;
