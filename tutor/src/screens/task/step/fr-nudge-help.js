import {
  React, PropTypes, observer, styled,
} from '../../../helpers/react';
import { Button } from 'react-bootstrap';
import Theme from '../../../theme';
import { ResponseValidationUX } from '../response-validation-ux';
import Course from '../../../models/course';
import TaskStep from '../../../models/student-tasks/step';
import RelatedContentLink from '../../../components/related-content-link';

const StyledFrNudgeHelp = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  padding-top: 1rem;
  font-size: 1.5rem;
  flex-direction: column;
`;

const Msg = styled.p`
  color: ${Theme.colors.danger};
`;
const Title = styled.h5`
  color: ${Theme.colors.danger};
  font-weight: bolder;
`;

const Actions = styled.div`
  .related-content-link{
    display: inline;
  }
  .btn-link {
    padding-left: 0;
  }
`;

const FrNudgeHelp = observer(({ course, step, ux }) => {
  return (
    <StyledFrNudgeHelp>
      <Title>Need Help?</Title>
      <Msg>{ux.nudgeMessage}</Msg>
      <Actions>
        <RelatedContentLink
          course={course} content={step.content.related_content}
        /> or <Button variant="link" onClick={ux.submitOriginalResponse}>Submit this answer</Button>
      </Actions>
    </StyledFrNudgeHelp>
  );
});

FrNudgeHelp.propTypes = {
  course: PropTypes.instanceOf(Course).isRequired,
  step: PropTypes.instanceOf(TaskStep).isRequired,
  ux: PropTypes.instanceOf(ResponseValidationUX).isRequired,
};
FrNudgeHelp.displayName = 'FrNudgeHelp';

export { FrNudgeHelp };
