import {
  React, PropTypes, observer, styled,
} from '../../../helpers/react';
import { Button } from 'react-bootstrap';
import Theme from '../../../theme';
import { ResponseValidationUX } from '../response-validation-ux';
import Course from '../../../models/course';
import TaskStep from '../../../models/student-tasks/step';
import RelatedContentLink from '../../../components/related-content-link';
import BrowseTheBook from '../../../components/buttons/browse-the-book';
import ChapterSection from '../../../components/chapter-section';

const StyledNudgeMessage = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  padding-top: 1rem;
  font-size: 1.5rem;
  flex-direction: column;
`;

const Message = styled.p`
  color: ${Theme.colors.danger};
  .btn-link {
    margin: 0;
    padding: 0;
    display: inline;
  }
`;
const Title = styled.h5`
  color: ${Theme.colors.danger};
  font-weight: bolder;
`;

const Actions = styled.div`
  .chapter-section {
    color: unset;
    font-weight: normal;
  }
  .related-content-link{
    display: inline;
  }
  .btn-link {
    padding-left: 0;
    font-size: 1.5rem;
  }
`;

const Review = ({ step, course, children }) => ( // eslint-disable-line react/prop-types
  <BrowseTheBook
    unstyled={true}
    chapterSection={step.chapterSection.asString}
    course={course}
    tabIndex={-1}
  >
    {children}
  </BrowseTheBook>
);

const Submit = ({ ux, children }) => ( // eslint-disable-line react/prop-types
  <Button variant="link" onClick={ux.submitOriginalResponse}>{children}</Button>
);


const NudgeMessages = [
  {
    title: 'Take another chance',
    Message: ({ step, course, ux }) => ( // eslint-disable-line react/prop-types
      <Message>
        Write your answer after <Review course={course} step={step}>reviewing
        section</Review> OR <Submit ux={ux}>Submit
        this answer</Submit>
      </Message>
    ),
  }, {
    title: 'Not sure? Here’s a hint',
    Message: ({ step, course, ux }) => ( // eslint-disable-line react/prop-types
      <Message>
        This question comes from
        section <ChapterSection chapterSection={step.chapterSection}
        />. <Review course={course} step={step}>Review and
        rewrite</Review> OR <Submit ux={ux}>Submit this answer</Submit>
      </Message>
    ),
  }, {
    title: 'Try again',
    Message: ({ step, course, ux }) => ( // eslint-disable-line react/prop-types
      <Message>
        Take your time. Rewrite your answer after <Review course={course} step={step}>reviewing
        section</Review> OR <Submit ux={ux}>Submit this answer</Submit>
      </Message>
    ),
  }, {
    title: 'Give it another shot',
    Message: ({ step, course, ux }) => ( // eslint-disable-line react/prop-types
      <Message>
        Answer in your own words to improve your
        learning. <Review course={course} step={step}>Review
        section</Review> OR <Submit ux={ux}>Submit this answer</Submit>
      </Message>
    ),
  },
];

const NudgeMessage = observer(({ course, step, ux }) => {
  const { displayNudgeError } = ux;
  if (!displayNudgeError) {
    return (
      <Actions>
        <RelatedContentLink course={course} content={step.content.related_content} />
      </Actions>
    );
  }

  const { Message } = ux.nudge;

  return (
    <StyledNudgeMessage>
      <Actions>
        <Title>{ux.nudge.title}</Title>
        <Message ux={ux} step={step} course={course} />
      </Actions>
    </StyledNudgeMessage>
  );

});

NudgeMessage.propTypes = {
  course: PropTypes.instanceOf(Course).isRequired,
  step: PropTypes.instanceOf(TaskStep).isRequired,
  ux: PropTypes.instanceOf(ResponseValidationUX).isRequired,
};
NudgeMessage.displayName = 'NudgeMessage';

export { NudgeMessages, NudgeMessage };
