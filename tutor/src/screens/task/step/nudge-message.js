import {
    React, PropTypes, observer, styled,
} from 'vendor';
import Theme from '../../../theme';
import { ResponseValidationUX } from '../response-validation-ux';
import { Course, StudentTaskStep } from '../../../models';
import RelatedContentLink from '../../../components/related-content-link';

const StyledNudgeMessage = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-start;
  font-size: 1.4rem;
  line-height: 2.2rem;
  flex-direction: column;
  max-width: 380px;
  .browse-the-book { display: inline; }
  .chapter-section { color: unset; font-weight: normal; }
  .related-content-link{ display: inline; }
  .preamble { color: ${Theme.colors.neutral.lite}; }
  .title { white-space: normal; }

  ${Theme.breakpoint.only.mobile`
    max-width: 100%;
  `}
`;

const Message = styled.div`
  color: ${Theme.colors.danger};
`;

const Title = styled.h5`
  color: ${Theme.colors.danger};
  font-weight: bolder;
  font-size: 1.4rem;
`;

const OR = styled.span.attrs(() => ({ children: 'or' }))`

`;

const Review = ({ step, course, prefix = '' }) => ( // eslint-disable-line react/prop-types
    <RelatedContentLink
        preamble=""
        linkPrefix={prefix}
        course={course}
        content={step.content.related_content}
    />
);

Review.propTypes = {
    step: PropTypes.instanceOf(StudentTaskStep).isRequired,
};

const Submit = ({ ux }) => ( // eslint-disable-line react/prop-types
    <a href="#" onClick={ux.submitOriginalResponse}>
    submit this answer
    </a>
);
Submit.propTypes = {
    ux: PropTypes.instanceOf(ResponseValidationUX).isRequired,
};

const NudgeMessages = [
    {
        title: 'Take another chance',
        Message: ({ step, course, ux }) => ( // eslint-disable-line react/prop-types
            <Message>
        Rewrite your answer after reviewing
        section <Review course={course} step={step} /> <OR/> <Submit ux={ux}/>
            </Message>
        ),
    }, {
        title: 'Not sure? Here’s a hint',
        Message: ({ step, course, ux }) => ( // eslint-disable-line react/prop-types
            <Message>
        This question comes from
        section <Review course={course} step={step} />. Review and
        rewrite <OR/> <Submit ux={ux} />
            </Message>
        ),
    }, {
        title: 'Try again',
        Message: ({ step, course, ux }) => ( // eslint-disable-line react/prop-types
            <Message>
        Take your time. Rewrite your answer after reviewing
        section <Review course={course} step={step} /> <OR/> <Submit ux={ux} />
            </Message>
        ),
    }, {
        title: 'Give it another shot',
        Message: ({ step, course, ux }) => ( // eslint-disable-line react/prop-types
            <Message>
        Answer in your own words to improve your learning.
        Review section <Review course={course} step={step} /> <OR/> <Submit ux={ux} />
            </Message>
        ),
    },
];

const NudgeMessage = observer(({ course, step, ux }) => {
    const { displayNudgeError } = ux;
    if (!displayNudgeError) {
        return (
            <StyledNudgeMessage>
                <RelatedContentLink course={course} content={step.content.related_content} />
            </StyledNudgeMessage>
        );
    }

    const { Message } = ux.nudge;

    return (
        <StyledNudgeMessage>
            <Title>{ux.nudge.title}</Title>
            <Message ux={ux} step={step} course={course} />
        </StyledNudgeMessage>
    );

});

NudgeMessage.propTypes = {
    course: PropTypes.instanceOf(Course).isRequired,
    step: PropTypes.instanceOf(StudentTaskStep).isRequired,
    ux: PropTypes.instanceOf(ResponseValidationUX).isRequired,
};
NudgeMessage.displayName = 'NudgeMessage';

export { NudgeMessages, NudgeMessage };
