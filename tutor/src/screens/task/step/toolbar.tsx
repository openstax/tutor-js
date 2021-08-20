import { React, observer, styled } from 'vendor'
import Theme from '../../../theme'
import { StudentTaskStep, Course, PracticeQuestions } from '../../../models'
import { ExerciseSuggestCorrectionLink, Icon } from 'shared'
import SavePracticeButton from '../../../components/buttons/save-practice'
import BrowseTheBook from '../../../components/buttons/browse-the-book'

interface StyledProps {
    theme: typeof Theme,
}

const Toolbar = styled.div<StyledProps>`
    font-size: 1.4rem;
    color: ${Theme.colors.neutral.darker};
    border: 1px solid ${Theme.colors.neutral.pale};
    background: #fff;
    z-index: 1;

    button, a {
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0;
        padding: 2px 0;
        border: 0;
        border-radius: 0;
        position: relative;

        &:nth-child(2):before, &:nth-child(2):after, &:nth-child(3):after {
            content: '';
            position: absolute;
        }

        &:not(.is-saved.save-practice-button) svg.ox-icon,
        &:not(.is-saved.save-practice-button) span {
            color: ${Theme.colors.neutral.std};
        }

        &:hover {
            box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.2);

            &:not(.save-practice-button) {
                & span, & svg.ox-icon {
                    color: ${Theme.colors.neutral.darker};
                }
                background: inherit;
            }

            &:not(.is-saved).save-practice-button {
                & svg, & span { color: ${Theme.colors.cerulan}; }
            }
            span {
                display: block;
            }
        }

        svg.ox-icon  {
            margin: 0;
            padding: 0;
            vertical-align: initial;
            width: 43px;
            font-size: 1.6rem;
        }
    }

    ${({ theme }) => theme.breakpoint.desktop`
        position: absolute;
        top: 61px;
        left: -80px;
        width: 45px;

        @media (max-width: 1200px) { left: calc(-5vw + 9px); }
        @media (max-width: 1088px) { left: -1px; }

        button, a {
            width: 43px;
            height: 45px;

            &:hover {
                width: 202px;
            }

            &:nth-child(2):after, &:nth-child(3):after {
                border-top: 1px solid ${Theme.colors.neutral.bright};
                width: 26px;
                top: 0;
            }

            span {
                display: none;
                flex-grow: 1;
                text-align: left;
            }
        }
    `}

    ${({ theme }) => theme.breakpoint.tablet`
        position: relative;
        width: auto;
        border-width: 1px 0;
        display: flex;
        justify-content: space-between;

        button, a {
            flex-direction: column;
            flex-grow: 1;
            padding: 10px 18px 6px;

            &:nth-child(2):before, &:nth-child(2):after {
                height: 40px;
            }
            &:nth-child(2):before {
                border-left: 1px solid ${Theme.colors.neutral.bright};
                left: 0;
            }
            &:nth-child(2):after {
                border-right: 1px solid ${Theme.colors.neutral.bright};
                right: 0;
            }
            &:not(.save-practice-button.is-saved) span {
                color: ${Theme.colors.neutral.std};
            }
            span {
                display: block;
                margin-top: 2px;
                font-size: 1rem;
                line-height: 1.4rem;
                text-align: center;
                min-width: 100px;
            }
        }
    `}

    ${({ theme }) => theme.breakpoint.mobile`
        button, a {
            span {
                min-width: initial;
            }

            svg[data-icon="spinner"] + span {
                min-width: 80px;
            }
        }
    `}
`

interface StepToolbarProps {
    hideToolbar?: boolean,
    course: Course,
    step: StudentTaskStep,
    practiceQuestions: PracticeQuestions,
    hideContentLink?: boolean,
    showSaveToPractice?: boolean,
    mobile?: boolean,
}

const StepToolbar: React.FC<StepToolbarProps> = observer(({
    hideToolbar, course, step, hideContentLink, practiceQuestions, showSaveToPractice,
}) => {
    if (hideToolbar) {
        return null;
    }
    return (
        <Toolbar>
            {
                showSaveToPractice &&
                <SavePracticeButton
                    taskStep={step}
                    practiceQuestions={practiceQuestions}
                />
            }
            {
                !hideContentLink && (
                    <BrowseTheBook
                        unstyled={true}
                        course={course}
                        chapterSection={step.chapterSection}
                    >
                        <Icon type="book-open" />
                        <span>View topic in textbook</span>
                    </BrowseTheBook>)
            }

            <ExerciseSuggestCorrectionLink
                exerciseId={step.uid}
                bookUUID={course.ecosystem_book_uuid}
                related_content={step.content.related_content}
            >
                <Icon type="exclamation-circle" />
                <span>Suggest a correction</span>
            </ExerciseSuggestCorrectionLink>
        </Toolbar>
    )
})

StepToolbar.displayName = 'StepToolbar'

export { StepToolbar }
