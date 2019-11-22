import { React, PropTypes, Theme, observer, cn, styled } from 'vendor';
import ChapterSectionModel from '../models/chapter-section';

const StyledChapterSection = styled.span`
  font-weight: 700;
  color: ${Theme.colors.neutral.darker};
`;

const ChapterSection = observer(({ chapterSection, className }) => {
  if (!chapterSection || chapterSection.isEmpty) { return null; }
  return (
    <StyledChapterSection
      className={cn('chapter-section', className)}
      data-chapter-section={chapterSection.key}
    >
      {chapterSection.asString}
    </StyledChapterSection>
  );
});

ChapterSection.displayName = 'ChapterSection';
ChapterSection.propTypes = {
  chapterSection: PropTypes.instanceOf(ChapterSectionModel).isRequired,
  className: PropTypes.string,
};
export default ChapterSection;
