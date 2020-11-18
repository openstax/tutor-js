import { React, PropTypes, styled, cn, observer } from 'vendor';
import { Form } from 'react-bootstrap';
import { colors, breakpoint } from 'theme';

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
    }
    &.padding {
      padding: 2.4rem 1.8rem;
    }
  }
`;

const StyledAddEditFormTextInput = styled(Form.Group)`
    input {
        color: ${colors.neutral.darker};
        &::placeholder {
            font-size: 1.4rem;
            color: ${colors.neutral.thin};
        }
        &:focus {
            background-color: ${colors.white};
        }
    }
  
`;

export const AddEditFormTextInput = observer(({ onChange, value, label, placeholder, className }) => {
  return (
    <StyledAddEditFormTextInput controlId={className} className={className}>
      <Form.Label>{label}</Form.Label>
      <Form.Control
        type="text"
        onChange={onChange}
        value={value}
        placeholder={placeholder}
      />
    </StyledAddEditFormTextInput>
  );
});

const AddEditQuestionFormBlock = ({
  label,
  formContentRenderer: FormContent,
  className,
  showGrayBackground = false,
  addPadding = true,
}) => {
  return (
    <StyledRowContent className={cn({ className })}>
      <div
        className={cn('label-wrapper', { 'gray-background': showGrayBackground })}>
        <span>{label}</span>
      </div>
      <div
        className={cn('content-form', { 'gray-background': showGrayBackground, 'padding': addPadding })}>
        <FormContent />
      </div>
    </StyledRowContent>
  );
};
AddEditQuestionFormBlock.propTypes = {
  label: PropTypes.string.isRequired,
  formContentRenderer: PropTypes.func.isRequired,
  className: PropTypes.string,
  showGrayBackground: PropTypes.bool,
  addPadding: PropTypes.bool,
};

export default AddEditQuestionFormBlock;
