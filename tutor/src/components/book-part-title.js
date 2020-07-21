import { React, PropTypes, cn, styled, css } from 'vendor';
import ChapterSection from './chapter-section';


const hideChapterSectionCSS = css`
  .os-number {
    display: none;
  }
`;

const StyledBookPartTitle = styled.div`
  display: inline-block;
  ${({ hideChapterSection }) => hideChapterSection && hideChapterSectionCSS}
  .os-number {
    .os-part-text {
      font-weight: normal;
    }
    font-weight: ${({ boldChapterSection }) => boldChapterSection ? 'bold' : 'normal'};
  }
  .chapter-section {
    font-weight: ${({ boldChapterSection }) => boldChapterSection ? 'bold' : 'normal'};
    margin-right: 0.5rem;
  }
  .label {
    margin-right: 0.5rem;
  }
`;

const hasChapterSection = /os-number/;

const BookPartTitle = ({ part, label, className, boldChapterSection, displayChapterSection }) => {

  return (
    <StyledBookPartTitle
      boldChapterSection={boldChapterSection}
      hideChapterSection={!displayChapterSection}
      className={cn('book-part-title', className)}
    >
      {label && !part.title.includes(label) && (
        <span className="label">{label}</span>
      )}
      {displayChapterSection && !part.title.match(hasChapterSection) && (
        <ChapterSection chapterSection={part.chapter_section} />
      )}
      <span dangerouslySetInnerHTML={{ __html: part.title }} />
    </StyledBookPartTitle>
  );
};

BookPartTitle.propTypes = {
  part: PropTypes.shape({
    title: PropTypes.string.isRequired,
    chapter_section: PropTypes.object,
  }).isRequired,
  label: PropTypes.node,
  className: PropTypes.string,
  boldChapterSection: PropTypes.bool,
  displayChapterSection: PropTypes.bool,
};

export default BookPartTitle;
