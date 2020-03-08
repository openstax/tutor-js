import { React, PropTypes, observer, styled } from 'vendor';
import { Modal } from 'react-bootstrap';
import { colors } from 'theme';
import { omit } from 'lodash';

const StyledModal = styled((props) => <Modal {...omit(props, StyledModal.OmitProps)} />)`
  .modal-dialog {
    .modal-header {
      padding: 1.2rem 3.2rem;
      border-left: 0.8rem solid ${props => props.templateColors.border};
      background-color: ${props => props.templateColors.background};
      font-size: 1.8rem;
      font-weight: bold;
      border-bottom: 0;
      border-radius: 0;
    }

    .modal-body {
      line-height: 2rem;
      padding: 4rem;
    }

    .close {
      font-size: 3rem;
      margin-top: -1.5rem;
    }
  }
`;

StyledModal.OmitProps = [
  'templateType',
  'template',
];

const TemplateModal = observer((props) => {
  return (
    <StyledModal
      {...props}
      templateColors={colors.templates[props.templateType]}
    >
      {props.children}
    </StyledModal>
  );
});

TemplateModal.propTypes = {
  templateType: PropTypes.string.isRequired,
};

export default TemplateModal;
