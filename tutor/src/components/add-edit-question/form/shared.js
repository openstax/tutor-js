import { React, PropTypes, styled, cn, observer } from 'vendor';
import { Form } from 'react-bootstrap';
import { colors } from 'theme';
import { EditableHTML } from '../../editor';

const StyledRowContent = styled.div`
  display: flex;
  flex-wrap: wrap;
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
    flex-wrap: wrap;
    &.gray-background {
      background-color: ${colors.neutral.bright};
    }
    &.padding {
      padding: 2.4rem 1.8rem;
    }
  }
  .editor-wrapper {
    :not(.limited), &.detailed-solution {
      .editable-html {
        min-height: 80px;
      }
    }
    .limited {
      .editable-html {
        min-height: 40px;
      }
    }
    .editor {
      .error-info {
        color: ${colors.strong_red};
      }
      .editable-html {
        margin: 0;
        background-color: white;
        border: 1px solid ${colors.neutral.pale};
        .openstax-has-html {
          margin: 1rem;
          // placeholder are not in a <p> tag
          color: ${colors.neutral.thin};
          p {
            color: ${colors.neutral.darker};
            line-height: 2.4rem;
            font-size: 1.6rem;
          }
        }
      }
      // overriding the inline style
      .perry-white {
        border: 1px solid ${colors.neutral.pale};
        width: 100% !important;
      }
    }
    &.isEmpty .editable-html {
      border: 1px solid ${colors.soft_red};
      background-color: ${colors.gray_red};
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

const EditableHTMLPanel = styled(EditableHTML)({
    flex: 1,
    '.ProseMirror.pw-prosemirror-editor': {
        padding: '2rem',
    },
});


export const TextInputHTMLEditor = ({ className, label, errorInfo, html, ...props }) => (
    <StyledRowContent className={cn('editor-wrapper', className, { 'isEmpty': errorInfo })}>
        {label && <Form.Label>{label}</Form.Label>}
        <div className="editor limited">
            <EditableHTMLPanel {...props} limitedEditing={true} html={html || ''}/>
            {errorInfo && <p className="error-info">{errorInfo}</p>}
        </div>
    </StyledRowContent>
);
TextInputHTMLEditor.propTypes = {
    html: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    errorInfo: PropTypes.string,
};

export const AnswerHTMLEditor = ({ className, label = '', errorInfo = '', html, ...props }) => (
    <StyledRowContent className={cn('editor-wrapper', className, { 'isEmpty': errorInfo })}>
        {label && <Form.Label>{label}</Form.Label>}
        <div className="editor">
            <EditableHTMLPanel {...props} limitedEditing={false} html={html || ''}/>
            {errorInfo && <p className="error-info">{errorInfo}</p>}
        </div>
    </StyledRowContent>
);
AnswerHTMLEditor.propTypes = {
    html: PropTypes.string,
    label: PropTypes.string,
    className: PropTypes.string,
    errorInfo: PropTypes.string,
};

export const AddEditFormTextInput = observer(({ onChange, plainText = false, value, label = '', placeholder = '', className, errorInfo = '' }) => {
    const input = plainText ?
        <Form.Control type="text" onChange={({ target: { value } }) => onChange(value)} value={value} placeholder={placeholder} /> :
        <TextInputHTMLEditor onChange={onChange} html={value} placeholder={placeholder} errorInfo={errorInfo} />;
    return (
        <StyledAddEditFormTextInput controlId={className} className={className}>
            {label && <Form.Label>{label}</Form.Label>}
            {input}
        </StyledAddEditFormTextInput>
    );
});

export const AddEditQuestionFormBlock = ({
    label,
    formContentRenderer: FormContent,
    className,
    showGrayBackground = false,
    addPadding = true,
    onFocus,
}) => {
    return (
        <StyledRowContent className={className} onFocus={onFocus ? onFocus : null}>
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
    onFocus: PropTypes.func,
};
