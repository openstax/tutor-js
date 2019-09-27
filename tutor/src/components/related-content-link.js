import { React, PropTypes, styled, cn } from 'vendor';
import { isEmpty } from 'lodash';
import Course from '../models/course';
import ChapterSection from './chapter-section';
import RelatedContent from '../models/related-content';
import BrowseTheBook from './buttons/browse-the-book';

const StyledRelatedContentLink = styled.div`
  display: flex;
  .chapter-section { font-weight: normal; color: inherit; }
  .browse-the-book { display: flex; }
`;

const Title = styled.span.attrs({ className: 'title' })`
  margin-left: 0.5rem;
  max-width: 300px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const Preamble = styled.span.attrs({ className: 'preamble' })`
  margin-right: 0.5rem;
`;

const RelatedContentLink = ({ className, linkPrefix, course, content, preamble }) => {

  if (isEmpty(content)) { return null; }

  return (
    <StyledRelatedContentLink className={cn('related-content-link', className)}>
      {preamble && <Preamble>{preamble}</Preamble>}
      {content.map((rl, i) => (
        <BrowseTheBook
          key={i}
          unstyled={true}
          chapterSection={rl.chapter_section}
          course={course}
          tabIndex={-1}
        >
          {linkPrefix}
          <ChapterSection chapterSection={rl.chapter_section} />
          <Title>{rl.title}</Title>

        </BrowseTheBook>))}
    </StyledRelatedContentLink>
  );
};

RelatedContentLink.propTypes = {
  course: PropTypes.instanceOf(Course).isRequired,
  content: PropTypes.arrayOf(
    PropTypes.instanceOf(RelatedContent).isRequired,
  ).isRequired,
  preamble: PropTypes.string,
  className: PropTypes.string,
  linkPrefix: PropTypes.node,
};

RelatedContentLink.defaultProps = {
  preamble: 'Comes from',
};


export default RelatedContentLink;
