import { React, PropTypes, observer, styled, css } from 'vendor';
import { Modal } from 'react-bootstrap';
import { colors } from 'theme';
import { omit } from 'lodash';

const StyledModal = styled((props) => <Modal {...omit(props, StyledModal.OmitProps)} />)`
  .modal-dialog {
    .modal-header {
      padding: 1.2rem 4rem;
      ${props => props.templateColors.border && css`
        border-left: 0.8rem solid ${props => props.templateColors.border};
        padding: 1.2rem 3.2rem;
      `}
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

    .modal-footer {
      padding: 0 4rem 4rem;
    }

    .close {
      font-size: 3rem;
      margin-top: -1.5rem;
    }
  }
`;

StyledModal.OmitProps = [
  'templateType',
  'templateColors',
  'template',
];

const CourseModal = observer((props) => {
  return (
    <StyledModal
      {...props}
      templateColors={colors.templates[props.templateType]}
    >
      {props.children}
    </StyledModal>
  );
});

CourseModal.propTypes = {
  templateType: PropTypes.string.isRequired,
};

export default CourseModal;
