import { React, styled, css } from 'vendor'
import { Icon, ScrollToTop } from 'shared'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import scrollIntoView from 'scroll-into-view'
import { createPreviewCourse } from '../../store/courses'
import { useAllOfferings } from '../../store/offering'
import User from '../../models/user'
import { Offering } from '../../store/types'
import CourseInformation from '../../models/course/information'
import { colors, navbars, breakpoint } from 'theme'
import { Button } from 'react-bootstrap'
import { isEmpty, groupBy, map, extend } from 'lodash'
import Router from '../../helpers/router'
import AsyncButton from 'shared/components/buttons/async-button'
import TutorLink from '../../components/link'
import { BackgroundWrapper, ContentWrapper } from '../../helpers/background-wrapper'
import qs from 'qs'

import './styles.scss'

enum Screens {
    Select,
    Detail,
    AfterSuggest
}

const StyledBackgroundWrapper = styled(BackgroundWrapper)`
    min-height: calc(100vh - ${navbars.top.height});
`

const StyledPage = styled.div`
    background: #fff;
    position: relative;
    overflow: hidden;
`

const Header = styled.div`
    text-align: center;
    margin-top: 4.4rem;

    h2 {
        font-size: 1.8rem;
        font-weight: bold;
        line-height: 3rem;
        letter-spacing: 0.05rem;
        margin: 0 0 1rem;
    }

    h1 {
        font-size: 3.6rem;
        font-weight: bold;
        line-height: 4rem;
        letter-spacing: -0.144rem;

        > * {
            font-size: 1.4rem;
            font-weight: normal;
            letter-spacing: initial;
            color: ${colors.neutral.thin};
        }
    }

    &.suggested h1 {
        font-size: 2.4rem;
        line-height: 2rem;
        letter-spacing: -0.096rem;
    }
`

const Wrapper = styled.div`
    display: flex;
    align-items: stretch;
    margin-top: 3.6rem;
    overflow: auto;
    position: relative;

    .offering-wrapper {
        display: flex;
        width: 592px;
        justify-content: space-between;
        flex-wrap: wrap;
        margin-bottom: 33px;
    }
`

const Sidebar = styled.div`
    width: 280px;
    min-height: 70vh;
    margin-right: 56px;
    background: #f6f7f8;
    padding: 0.7rem 0.9rem 10.7rem;
    color: ${colors.neutral.grayblue};
    font-size: 1.4rem;
    line-height: 2rem;
    position: sticky;
    align-self: flex-start;
    top: 0;

    ${breakpoint.tablet`
       display: none;
    `}

    button {
        display: initial;
        border: 0;
        background: none;
        padding: 0.5rem 0;
        margin: 2rem 0 0.1rem;
        padding-left: 2.2rem;
        font-weight: bold;
        color: unset;

        svg {
            position: absolute;
            margin: 0.1rem 0 0 -1.8rem;
            font-size: 1.7rem;
        }
    }

    a {
        color: unset;
        font-weight: initial;
        display: block;
        margin-left: 2.2rem;
        margin-bottom: 0.7rem;
    }
`

const Content = styled.div`
    padding-bottom: 14rem;

    h3 {
        text-transform: uppercase;
        font-size: 1.4rem;
        line-height: 2rem;
        margin-bottom: 1.1rem;
        color: ${colors.neutral.std};
    }

    .suggest {
        margin-top: 3.2rem;

        label {
            font-weight: bold;
            color: ${colors.neutral.darker};
        }

        .submit-wrapper {
            display: flex;
            align-items: center;
            margin-top: 1.2rem;
        }

        input {
            display: block;
            margin-right: 1.6rem;
            width: 280px;
            padding: 1rem 0.8rem;
            border: 1px solid ${colors.neutral.pale};

            &:focus {
                outline: 1px solid ${colors.forms.borders.focus};
                box-shadow: 0px 0px 4px ${colors.forms.borders.focus};
            }
        }
    }
`

const OfferingLabel = styled.label`
    .control {
        display: flex;
        align-items: center;
        width: 280px;
        min-height: 64px;
        border: 1px solid ${colors.neutral.pale};
        padding: 0.8rem;
        margin: 0 0 1.1rem;
        font-size: 1.6rem;
        line-height: 2.4rem;
        background: #fff;
        border-radius: 2px;

        .image {
            height: 48px;
            width: 48px;
        }

        .title {
            margin-left: 11px;
            font-weight: normal;
            letter-spacing: -0.025rem;
        }
    }

    input {
        clip: rect(0 0 0 0);
        clip-path: inset(100%);
        height: 1px;
        overflow: hidden;
        position: absolute;
        white-space: nowrap;
        width: 1px;
    }

    input:checked + .control {
        border-color: ${colors.primary};
        box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.2);
    }

    input:focus + .control {
        border-color: ${colors.forms.borders.focus};
        box-shadow: 0px 0px 4px ${colors.forms.borders.focus};
    }
`

const Footer = styled.div`
    display: flex;
    justify-content: flex-end;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    padding: 2.6rem 13.6rem;
    background-color: ${colors.neutral.bright};
    border-top: 1px solid ${colors.neutral.pale};

    button {
        width: 16.8rem;
        height: 4.8rem;
    }
`

const SubjectWrapper = styled.div`
    width: 880px;
    margin: 0 auto;
`

const TwoCol = styled.div`
    display: flex;
    justify-content: space-between;

    &.narrow {
        max-width: 680px;
        margin: 0 auto;
    }
`

const Block = styled.div`
    display: flex;
    background: ${colors.neutral.bright};
    padding: 3.2rem 2.4rem 3.2rem 3.2rem;
    margin-bottom: 2.4rem;

    & + & {
        margin-left: 2.4rem;
    }

    .btn {
        width: 27.6rem;
        height: 4.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .btn-light {
        background-color: #fff;
        border: 1px solid ${colors.neutral.pale};
        color: ${colors.neutral.grayblue};
        font-weight: bold;
        filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1));
    }

    ${props => (props.variant === 'light') && css`
        display: block;
        background: #fff;
        border: 1px solid ${colors.neutral.pale};
        text-align: center;
        font-size: 1.4rem;
        line-height: 2.4rem;
        padding: 2.8rem 2.8rem 5.2rem;

        > * {
            margin: 0 auto;
            max-width: 379px;
        }

        h4 {
            font-size: 1.8rem;
            line-height: 3rem;
        }

        p {
            margin: 0.8rem auto 1.6rem;
        }
    `}

    .image, .square {
        width: 168px;
        height: 168px;
        background-color: #494949;
        color: #fff;
        font-size: 2.4rem;
        flex-shrink: 0;
        margin-right: 2.4rem;
        ${props => (props.variant === 'hero') && css`
            width: 264px;
            height: 264px;
        `}
    }

    a.square {
        font-weight: bold;
        letter-spacing: -1px;
        line-height: 3rem;
        padding: 17px 9px;

        &:not(.guide) {
            display: flex;
            justify-content: center;
            align-items: center;

        }
        &, &:hover {
            color: #fff;
        }
        [data-icon="play-circle"] {
            width: 48px;
            height: 48px;
            margin: 0;
        }
    }

    .text, &.text {
        h4 {
            font-weight: bold;
            font-size: 1.8rem;
            line-height: 3rem;
        }
        p, ul {
            font-size: 1.6rem;
            line-height: 2.4rem;

            &.note {
                font-size: 1.4rem;
                line-height: 2.4rem;
                margin-bottom: 1.5rem;
            }
        }
        ul {
            padding-left: 2rem;
            margin-bottom: 0;
        }
    }

    &.action-card {
        height: 320px;
        width: 320px;
        display: flex;
        flex-direction: column;
        padding: 2.5rem 2rem 2.9rem;

        & + & {
            margin-left: 4rem;
        }

        p {
            flex-grow: 1;
            font-size: 1.8rem;
            line-height: 3rem;
        }
    }
`

const SuggestButton = styled(AsyncButton)`
    min-width: 12.7rem;
    height: 4rem;
`

interface OfferingListProps {
    subject: string
    offerings: Offering[]
}

const OfferingList: React.FC<OfferingListProps> = ({ subject, offerings }) => {
    const [showList, setListState] = useState(true)

    const toggleShow = () => {
        setListState(!showList);
    }

    const scrollToBook = (event, id) => {
        event.preventDefault()

        scrollIntoView(document.querySelector(`[id="${id}"]`), {
            time: 300,
            align: { top: 0, topOffset: 80 },
        })
    }

    return (
        <div>
            <button aria-expanded="true" onClick={toggleShow}>
                <Icon type={showList ? 'caret-down' : 'caret-right'} /> {subject}
            </button>
            {showList &&
                <div className="offering-shortcuts">
                    {map(offerings, (book, i) => (
                        <a
                            key={i}
                            href={`#${book.id}`}
                            onClick={(event) => scrollToBook(event, book.id)}
                        >
                            {book['title']}
                        </a>
                    ))}
                </div>
            }
        </div>
    )
}

interface SubjectSelectProps {
    selectedSubject: number
    setSelectedSubject: void
    setActiveScreen: void
    offerings: Offering[]
}

const SubjectSelect: React.FC<SubjectSelectProps> = ({
    selectedSubject, setSelectedSubject, setActiveScreen, offerings,
}) => {
    const [showSuggestSubmitButton, setShowSuggestSubmitButton] = useState(false)
    const [suggestedSubject, setSuggestedSubject] = useState('')
    const [submittingSuggestion, setSubmittingSuggestion] = useState(false)

    const onSubmitSuggestion = (e) => {
        e.preventDefault()
        setSubmittingSuggestion(true)
        Promise.resolve(User.suggestSubject({ data: suggestedSubject }))
            .then(() => setActiveScreen(Screens.AfterSuggest))
    }

    const onChangeSuggestion = (value) => {
        setSuggestedSubject(value)
        setShowSuggestSubmitButton(value.length > 0)
    }

    return (
        <StyledPage>
            <Header>
                <h2>Welcome to OpenStax Tutor</h2>
                <h1 id="instructions">
                    Select a subject you'll be teaching
                    <div>(You can change or add more subjects later)</div>
                </h1>
            </Header>
            <Wrapper>
                <Sidebar>
                    {map(Object.keys(offerings), (key, i) => {
                        const subjectTitle = key === 'undefined' ? 'Subjects' : key
                        return (<OfferingList subject={subjectTitle} offerings={offerings[key]} key={i} />)
                    })}
                </Sidebar>
                <Content>
                    <form id="offering-form" aria-labelledby="instructions">
                        {map(Object.keys(offerings), (key, i) => (
                            <div key={i}>
                                <h3>{key === 'undefined' ? 'Subjects' : key}</h3>
                                <div className="offering-wrapper">
                                    {map(offerings[key], (book, i) => (
                                        <OfferingLabel key={i} id={book.id}>
                                            <input
                                                type="radio"
                                                name="offering"
                                                checked={selectedSubject === book.id}
                                                onChange={() => setSelectedSubject(book.id)}
                                                data-test-id={`offering-${i}`}
                                            />
                                            <div className="control">
                                                <div className="image" data-appearance={book['appearance_code']}></div>
                                                <div className="title">{book['title']}</div>
                                            </div>
                                        </OfferingLabel>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </form>

                    <form className="suggest">
                        <label>
                            <span>Don't see your subject?</span>
                            <div className="submit-wrapper">
                                <input
                                    type="text"
                                    maxLength={50}
                                    placeholder="Suggest a subject"
                                    onChange={(e) => onChangeSuggestion(e.target.value)}
                                    data-test-id="input-suggested-subject"
                                />
                                <SuggestButton
                                    type="submit"
                                    variant="primary"
                                    onClick={(e) => onSubmitSuggestion(e)}
                                    hidden={!showSuggestSubmitButton}
                                    disabled={suggestedSubject.length === 0}
                                    isWaiting={submittingSuggestion}
                                    waitingText="Submitting..."
                                    data-test-id="submit-suggested-subject"
                                >
                                    Submit
                                </SuggestButton>
                            </div>
                        </label>
                    </form>
                </Content>
            </Wrapper>
            {!isEmpty(selectedSubject) &&
                <Footer>
                    <Button
                        variant="primary"
                        type="submit"
                        data-test-id="show-detail"
                        onClick={(e) => {
                            e.preventDefault()
                            setActiveScreen(Screens.Detail)
                        }}
                        form="offering-form"
                    >
                        Next
                    </Button>
                </Footer>
            }
        </StyledPage>
    )
}

interface SubjectDetailProps {
    offerings: Offering[]
    selectedSubject: number
    history: History
}

const SubjectDetail: React.FC<SubjectDetailProps> = ({
    offerings, selectedSubject, history,
}) => {
    const [creatingPreview, setCreatingPreview] = useState(false)
    const dispatch = useDispatch()
    const offering = Object.values(offerings).flat().find(o => o.id == selectedSubject)

    const createPreview = () => {
        if (!User.canViewPreviewCourses) {
            return null
        }

        setCreatingPreview(true)
        dispatch(createPreviewCourse(offering))
            .then((result) => {
                setCreatingPreview(false)
                if (!result.error) {
                    history.push(Router.makePathname(
                        'dashboard', { courseId: result.payload.id },
                    ))
                }
            })
    }

    return (
        <StyledPage>
            <Header>
                <h2>Let’s get you started!</h2>
                <h1 id="instructions">
                    Some resources to help you begin
                    <div>(You can find these resources on the ‘My Courses’ page)</div>
                </h1>
            </Header>
            <SubjectWrapper>
                <Block variant="hero">
                    <div className="image" data-appearance={offering.appearance_code}></div>
                    <div className="text">
                        <h4>Explore the preview course</h4>
                        <p>A Preview Course is an OpenStax Tutor course pre-populated with assignments and demo student data.</p>
                        <ul>
                            <li>Create sample assignments</li>
                            <li>Review thousands of questions in the OpenStax Question Library</li>
                            <li>View the course as a student</li>
                        </ul>
                        <p className="note">Note: You can’t enroll students or add your own questions to a Preview Course.</p>
                        <AsyncButton
                            variant="primary"
                            data-test-id="explore-course"
                            onClick={createPreview}
                            isWaiting={creatingPreview}
                            waitingText="Creating preview..."
                            data-test-id="create-preview"
                        >
                            Explore preview course
                        </AsyncButton>
                    </div>
                </Block>
                <TwoCol>
                    <Block>
                        <a
                            className="square guide"
                            href={CourseInformation.gettingStartedGuide['teacher']}
                            target="_blank"
                        >
                            Instructor Getting Started Guide
                        </a>
                        <div className="text">
                            <h4>Have questions?</h4>
                            <p>In this guide, you’ll find more information on OpenStax Tutor features and answers to common questions.</p>
                        </div>
                    </Block>
                    <Block>
                        <a className="square" href={CourseInformation.videoTutorials} target="_blank">
                            <Icon type="play-circle" size="lg" />
                        </a>
                        <div className="text">
                            <h4>Video Tutorials</h4>
                            <p>Our video tutorials have been designed to take you step by step through some of the most important tasks. </p>
                        </div>
                    </Block>
                </TwoCol>
                <Block variant="light" className="text">
                    <h4>Ready to begin?</h4>
                    <p>Creating a course is the first step towards managing your class assignments.</p>
                    <TutorLink
                        className="btn btn-light"
                        to="createNewCourseFromOffering"
                        params={{ appearanceCode: offering.appearance_code }}
                        data-test-id="create-course"
                    >
                        Create a course
                    </TutorLink>
                </Block>
            </SubjectWrapper>
        </StyledPage>
    )
}

interface SubjectSuggestedProps {
    setActiveScreen: void
}

const SubjectSuggested: React.FC<SubjectSuggestedProps> = ({ setActiveScreen }) => {
    return (
        <StyledPage>
            <Header className="suggested">
                <h1>Thank you! Your subject suggestion has been submitted.</h1>
            </Header>
            <Wrapper>
                <TwoCol className="narrow">
                    <Block variant="light" className="text action-card">
                        <h4>Personalized homework.<br /> Pre-loaded Question Libary.</h4>
                        <p>Explore OpenStax Tutor and features that enable better learning for your students and easy course creation for you.</p>
                        <Button
                            variant="primary"
                            onClick={() => setActiveScreen(Screens.Select)}
                            data-test-id="back-to-select"
                        >
                            Continue to OpenStax Tutor
                        </Button>
                    </Block>
                    <Block variant="light" className="text action-card">
                        <h4>Peer-reviewed. <br />
                            Openly licensed. 100% free.</h4>
                        <p>Review our OpenStax textbooks, additional resources and technology partners.</p>
                        <a
                            className="btn btn-light"
                            href={CourseInformation.openstaxSubjects}
                            data-test-id="explore-books"
                        >
                            Explore OpenStax books
                        </a>
                    </Block>
                </TwoCol>
            </Wrapper>
        </StyledPage>
    )
}

interface NewUserProps {
    history: History
    windowImpl: any
}

const NewTeacher: React.FC<NewUserProps> = ({ history, windowImpl = window }) => {
    const setActiveScreen = (screen: Screen) => {
        const query = extend(Router.currentQuery(windowImpl), { onboarding: screen })
        history.push(windowImpl.location.pathname + '?' + qs.stringify(query))
    }

    const [selectedSubject, setSelectedSubject] = useState()

    let queriedScreen = parseInt(Router.currentQuery().onboarding) || Screens.Select
    if (queriedScreen === Screens.Detail && isEmpty(selectedSubject)) {
        queriedScreen = Screens.Select
        history.push(windowImpl.location.pathname)
    }
    const [activeScreen, _setActiveScreen] = useState(queriedScreen)

    useEffect(
        () => {
            _setActiveScreen(queriedScreen)
        },
        [queriedScreen],
    )

    const offerings = groupBy(useAllOfferings(), 'subject')
    const options = {
        selectedSubject: selectedSubject,
        setSelectedSubject: setSelectedSubject,
        setActiveScreen: setActiveScreen,
        offerings: offerings as Offering[],
        history: history,
    }
    const screens = [
        <SubjectSelect {...options} />,
        <SubjectDetail {...options} />,
        <SubjectSuggested {...options} />,
    ]

    return (
        <StyledBackgroundWrapper>
            <ScrollToTop>
                <ContentWrapper>
                    {screens[activeScreen]}
                </ContentWrapper>
            </ScrollToTop>
        </StyledBackgroundWrapper>
    )
}

export default NewTeacher
