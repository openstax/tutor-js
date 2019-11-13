import { React, PropTypes, styled } from 'vendor';

const StyledBookPartTitle = styled.div`
  display: inline-block;
`;


const BookPartTitle = ({ title, className }) => (
  <StyledBookPartTitle className={className} dangerouslySetInnerHTML={{ __html: title }} />
);

BookPartTitle.propTypes = {
  title: PropTypes.string.isRequired,
  className: PropTypes.string,
};

export default BookPartTitle;
