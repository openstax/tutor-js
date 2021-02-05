import { React, PropTypes, styled, css } from 'vendor'
import { Icon } from 'shared'
import { useState, useCallback } from 'react'
import scrollIntoView from 'scroll-into-view'
import Offerings from '../../models/course/offerings'
import { colors } from 'theme'
import { Button } from 'react-bootstrap'
import { isEmpty } from 'lodash'
import { BackgroundWrapper, ContentWrapper } from '../../helpers/background-wrapper'
import { ScrollToTop } from 'shared'
import './styles.scss'

const StyledPage = styled.div`
  background: #fff;
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
`

const Wrapper = styled.div`
  display: flex;
  align-items: stretch;
  margin-top: 3.6rem;

  .offering-wrapper {
    display: flex;
    width: 592px;
    justify-content: space-between;
    flex-wrap: wrap;
    margin-bottom: 48px;
  }
`

const Sidebar = styled.div`
  width: 280px;
  margin-right: 56px;
  // height: vh(100);
  background: #f6f7f8;
  padding: 0.7rem 0.9rem 2.7rem;
  color: ${colors.neutral.grayblue};
  font-size: 1.4rem;
  line-height: 2rem;

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

const Content = styled.form`
  padding-bottom: 14rem;

  h3 {
    text-transform: uppercase;
    font-size: 1.4rem;
    margin-bottom: 0.3rem;
    color: ${colors.neutral.std};
  }

  .suggest {
    margin-top: 3.2rem;

    label {
      font-weight: bold;
      color: ${colors.neutral.darker};
    }

    input {
      display: block;
      margin-top: 1.2rem;
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

const Offering = styled.label`
  .control {
    display: flex;
    align-items: center;
    width: 280px;
    min-height: 64px;
    border: 1px solid ${colors.neutral.pale};
    padding: 0.8rem;
    margin: 0.6rem 0 1rem;
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
  .two-col {
    display: flex;
    justify-content: space-between;
  }
`

const Block = styled.div`
  display: flex;
  background: ${colors.neutral.bright};
  padding: 3.2rem;
  margin-bottom: 2.4rem;

  & + & {
    margin-left: 2.4rem;
  }

  button {
    width: 276px;
    height: 48px;
  }

  ${props => (props.variant === 'footer') && css`
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

    button {
      background-color: #fff;
      border: 1px solid ${colors.neutral.pale};
      color: ${colors.neutral.grayblue};
      font-weight: bold;
      filter: drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1));
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

  .text {
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
      }
    }
    ul {
      padding-left: 2rem;
    }
  }
`

// TODO: Swap to Offerings.available
const offerings = [
  {
    subject: 'Science',
    books: [
    { title: 'Anatomy and Physiology', appearance_code: 'anatomy_physiology' },
    { title: 'Biology 2e', appearance_code: 'biology_2e' },
    { title: 'College Physics', appearance_code: 'college_physics' },
    ],
  },
  {
    subject: 'Social Sciences',
    books: [
    { title: 'Introduction to Sociology 2e', appearance_code: 'intro_sociology' },
    { title: 'Psychology 2e', appearance_code: 'psych_2e' },
    ],
  },
  {
    subject: 'Humanities',
    books: [
    { title: 'U.S. History', appearance_code: 'none' },
    ],
  },
  {
    subject: 'Business',
    books: [
    { title: 'Entrepreneurship', appearance_code: 'entrepreneurship' },
    ],
  },
  {
    subject: 'AP® Courses',
    books: [
    { title: 'Biology 2e for AP® Courses', appearance_code: 'ap_biology' },
    { title: 'College Physics for AP® Courses', appearance_code: 'ap_physics' },
    { title: 'Life Liberty and the Pursuit of Happiness for AP® Courses', appearance_code: 'ap_us_history' },
    ],
  },
]

const OfferingList: React.FC = ({ offering }) => {
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
      <Icon type={showList ? 'caret-down' : 'caret-right'} /> {offering['subject']}
      </button>
      {showList &&
        <div className="offering-shortcuts">
          {offering['books'].map((book, i) => (
            <a
              key={i} href={`#${book['appearance_code']}`}
              onClick={(event) => scrollToBook(event, book['appearance_code'])}
            >
            {book['title']}
            </a>
          ))}
        </div>
      }
    </div>
  )
}

const SubjectSelect: React.FC = ({ selectedSubject, selectSubject, showDetail }) => {
  return (
    <div>
      <Wrapper>
        <Sidebar>
        {offerings.map((offering, i) => (
          <OfferingList offering={offering} key={i} />
          ))}
        </Sidebar>
        <Content role="group" aria-labelledby="instructions">
          {offerings.map((offering, i) => (
            <div key={i}>
              <h3>{offering['subject']}</h3>
              <div className="offering-wrapper">
                {offering['books'].map((book, i) => (
                  <Offering key={i} id={book['appearance_code']}>
                    <input type="radio" name="offering" onChange={() => selectSubject(book['appearance_code'])} />
                    <div className="control">
                      <div className="image" data-appearance={book['appearance_code']}></div>
                      <div className="title">{book['title']}</div>
                    </div>
                  </Offering>
                ))}
              </div>
            </div>
          ))}

          <div className="suggest">
            <label>
              <span>Don't see your subject?</span>
              <input type="text" placeholder="Suggest a subject" />
            </label>
          </div>
        </Content>
      </Wrapper>
      {!isEmpty(selectedSubject) &&
        <Footer>
          <Button
            variant="primary"
            data-test-id="show-detail"
            onClick={() => showDetail(true)}
          >
            Next
          </Button>
        </Footer>
      }
    </div>
  )
}

const SubjectDetail: React.FC = ({ selectedSubject }) => {
  const exploreCourse = () => {

  }

  return(
    <SubjectWrapper>
      <Block variant="hero">
        <div className="image" data-appearance={selectedSubject}></div>
        <div className="text">
          <h4>Explore the preview course</h4>
          <p>A Preview Course is an OpenStax Tutor course pre-populated with assignments and demo student data.</p>
          <ul>
            <li>Create sample assignments</li>
            <li>Review thousands of questions in the OpenStax Question Library</li>
            <li>View the course as a student</li>
          </ul>
          <p className="note">Note: You can’t enroll students or add your own questions to a Preview Course.</p>
          <Button variant="primary" data-test-id="explore-course" onClick={exploreCourse}>
            Explore preview course
          </Button>
        </div>
      </Block>
      <div className="two-col">
        <Block>
          <a className="square guide">Instructor Getting Started Guide</a>
          <div className="text">
            <h4>Have questions?</h4>
            <p>In this guide, you’ll find more information on OpenStax Tutor features and answers to common questions.</p>
          </div>
        </Block>
        <Block>
          <a className="square">
            <Icon type="play-circle" size="lg" />
          </a>
          <div className="text">
            <h4>Video Tutorials</h4>
            <p>Our video tutorials have been designed to take you step by step through some of the most important tasks. </p>
          </div>
        </Block>
      </div>
      <Block variant="footer">
        <h4>Ready to begin?</h4>
        <p>Creating a course is the first step towards managing your class assignments.</p>
        <Button variant="light">Create a course</Button>
      </Block>
    </SubjectWrapper>
  )
}

const NewUser: React.FC = () => {
  const [selectedSubject, setSelectedSubject] = useState("intro_sociology")

  const selectSubject = (value) => {
    setSelectedSubject(value)
  }

  const [showingDetail, setShowingDetail] = useState(true)

  const showDetail = (value) => {
    setShowingDetail(value);
  }

  return(
    <BackgroundWrapper>
      <ScrollToTop>
        <ContentWrapper>
          <StyledPage>
            <Header>
              <h2>Welcome to OpenStax Tutor</h2>
              <h1 id="instructions">
                Select a subject you'll be teaching
                <div>(You can change or add more subjects later)</div>
              </h1>
            </Header>
            {!showingDetail &&
              <SubjectSelect
                selectedSubject={selectedSubject}
                selectSubject={selectSubject}
                showDetail={showDetail}
              />
            }
            {showingDetail && <SubjectDetail selectedSubject={selectedSubject} />}
          </StyledPage>
        </ContentWrapper>
       </ScrollToTop>
    </BackgroundWrapper>
  )
}

export default NewUser
