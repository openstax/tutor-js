import { React, PropTypes, styled, cn } from 'vendor';
import { colors } from 'theme';

const StyledRowContent = styled.div`
  display: flex;
  margin-bottom: 4rem;
  >.label-wrapper {
    flex: 0 1 10%;
    font-size: 1.4rem;
    line-height: 3.2rem;
    font-weight: 700;
    color: ${colors.neutral.darker};
    text-transform: uppercase;
    &.gray-background {
      padding-top: 1.6rem;
    }
  }
  >.content-form {
    flex: 0 1 90%;
    &.gray-background {
      background-color: ${colors.neutral.bright};
      padding: 2.4rem 1.8rem;
    }
  }
`;

const AddEditQuestionFormBlock = ({
  label,
  formContentRenderer: FormContent,
  className,
  showGrayBackground = false,
}) => {
  return (
    <StyledRowContent className={cn({ className })}>
      <div className={cn('label-wrapper', { 'gray-background': showGrayBackground })}><span>{label}</span></div>
      <div className={cn('content-form', { 'gray-background': showGrayBackground })}><FormContent /></div>
    </StyledRowContent>
  );
};
AddEditQuestionFormBlock.propTypes = {
  label: PropTypes.string.isRequired,
  formContentRenderer: PropTypes.func.isRequired,
  className: PropTypes.string,
  showGrayBackground: PropTypes.bool,
};

export default AddEditQuestionFormBlock;
