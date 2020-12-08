import { React, styled, PropTypes } from 'vendor';
import { Button } from 'react-bootstrap';

const StyledNoExercisesFound = styled.div`
  text-align: center;
  line-height: 3rem;
  font-size: 1.8rem;
  margin-top: 1rem;
  h3, strong {
    font-weight: 700;
  }
  .btn-link {
    padding: 0;
    font-size: inherit;
  }
`;

const backToSelectionSections = (onSelectSections) => {
  return (
    <Button className="back-to-section" variant="link" onClick={onSelectSections}>
      chapter/section
    </Button>
  );
};

const noResultsInFiltering = () => 
  <p className="lead">
    <strong>No Results.</strong> Try selecting a different combination of filters.
  </p>;

const noQuestionsInSection = (isHomework, onSelectSections) =>
  <>
    <h3>
        No questions found.
    </h3>
    <p className="lead">
      Select a different {backToSelectionSections(onSelectSections)}
      {isHomework && ' or add your own questions'}.
    </p>
  </>;

const NoExercisesFound = (props) => {
  return (
    <StyledNoExercisesFound>
      {
        props.sectionHasExercises
          ? noResultsInFiltering()
          : noQuestionsInSection(props.isHomework, props.onSelectSections)
      }
    </StyledNoExercisesFound>
  );
};
NoExercisesFound.propTypes = {
  isHomework: PropTypes.bool,
  sectionHasExercises: PropTypes.bool,
  onSelectSections: PropTypes.func.isRequired,
};

export default NoExercisesFound;
