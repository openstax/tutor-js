import { React, PropTypes, styled, Theme } from 'vendor';
import { isEmpty } from 'lodash';
import ChapterSection from '../models/chapter-section';

const PageTitleWrapper = styled.div.attrs({ className: 'page-title' })`
  margin-top: 3rem;
  padding: 2rem 0 1.5rem 0;
`;

const Title = styled.h1.attrs({ className: 'page-title-heading' })`
  font-size: 2.4rem;
  line-height: 2.4rem;
  margin: 0;
  padding: 2rem 3rem 1rem 3rem;
`;

const Preamble = styled.div`
  padding: 0 3rem;
  display: block;
  font-weight: 400;
  text-transform: uppercase;
  ${Theme.fonts.sans('1.4rem')};
`;

class PageTitle extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    showObjectivesPreamble: PropTypes.bool,
    isChapterSectionDisplayed: PropTypes.bool,
    chapter_section: PropTypes.instanceOf(ChapterSection).isRequired,
  };

  static defaultProps = {
    showObjectivesPreamble: false,
  }

  get isIntro() {
    return 0 === this.props.chapter_section.section;
  }

  get preambleMessage() {
    return this.isIntro ?
      'In this chapter you will learn about:' :
      'By the end of this section, you will be able to:';
  }

  render() {

    const {
      title, chapter_section, isChapterSectionDisplayed, showObjectivesPreamble,
    } = this.props;

    if (isEmpty(title) || this.isIntro) { return null; }

    return (
      <PageTitleWrapper>
        <Title>
          <span className="part">
            {isChapterSectionDisplayed && (
              <span className="section">
                {chapter_section.toString()}
                {' '}
              </span>)}
            <span className="title">
              {title}
            </span>
          </span>
        </Title>
        {showObjectivesPreamble && (
          <Preamble>
            {this.preambleMessage}
          </Preamble>)}
      </PageTitleWrapper>
    );
  }
}

export default PageTitle;
