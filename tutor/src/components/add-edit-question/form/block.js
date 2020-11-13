import { React, PropTypes, styled, cn } from 'vendor';
import { colors } from 'theme';

const StyledRowContent = styled.div`
  display: flex;
  >:first-child {
    flex: 0 1 10%;
    font-size: 1.4rem;
    line-height: 2rem;
    font-weight: 700;
    color: ${colors.neutral.darker};
    text-transform: uppercase;
  }
  >:last-child {
    flex: 0 1 90%;
  }
`;

const AddEditQuestionFormBlock = ({
  label,
  formContentRenderer: FormContent,
  className,
}) => {
  return (
    <StyledRowContent className={cn(className)}>
      <div className="label-wrapper"><span>{label}</span></div>
      <div className="content-form"><FormContent /></div>
    </StyledRowContent>
  );
};
AddEditQuestionFormBlock.propTypes = {
  label: PropTypes.string.isRequired,
  formContentRenderer: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default AddEditQuestionFormBlock;
