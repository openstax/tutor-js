import { React, PropTypes, styled, cn } from 'vendor';
import { isEmpty } from 'lodash';
import Course from '../models/course';
import RelatedContent from '../models/related-content';
import BrowseTheBook from './buttons/browse-the-book';
import BookPartTitle from './book-part-title';

const StyledRelatedContentLink = styled.div`
  display: flex;
  flex-wrap: wrap;
  .chapter-section { font-weight: normal; color: inherit; }
  .browse-the-book { display: flex; }
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
          <BookPartTitle displayChapterSection part={rl} />
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
