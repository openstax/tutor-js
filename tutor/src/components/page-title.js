import { React, PropTypes, styled, Theme } from 'vendor';
import { isEmpty } from 'lodash';
import ChapterSection from './chapter-section';
import ChapterSectionModel from '../models/chapter-section';

const PageTitleWrapper = styled.div.attrs({ className: 'page-title' })`
  margin-top: 3rem;
  padding: 2rem 0 1.5rem 0;
`;

const Heading = styled.h1.attrs({ className: 'page-title-heading' })`
  font-size: 2.4rem;
  line-height: 3rem;
  margin: 0;
  display: flex;
  padding: 2rem 3rem 1rem 3rem;
`;

const Title = styled.div`
  margin-left: 0.5rem;
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
    chapter_section: PropTypes.instanceOf(ChapterSectionModel).isRequired,
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
        <Heading>
          {isChapterSectionDisplayed && (
            <ChapterSection chapterSection={chapter_section} />)}
          <Title>
            {title}
          </Title>
        </Heading>
        {showObjectivesPreamble && (
          <Preamble>
            {this.preambleMessage}
          </Preamble>)}
      </PageTitleWrapper>
    );
  }
}

export default PageTitle;
