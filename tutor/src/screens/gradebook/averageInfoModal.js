import { React, PropTypes, useObserver, styled } from 'vendor';
import { Modal } from 'react-bootstrap';
import { colors } from 'theme';

const StyledModal = styled(Modal)`
    .modal-dialog .modal-header, .modal .modal-header {
        background-color: ${colors.neutral.lighter};
        font-size: 1.6rem;
        font-weight: bold;
        & span {
            font-size: 3rem;
        }
    }
`;

const List = styled.ol`
    list-style: none;
    & li {
        margin: 0 0 0.5rem 0;
        counter-increment: list-counter;
        position: relative;
        & p:first-child {
            font-weight: 600;
        }
        & p {
            font-size: 1.5rem;
            line-height: 20px;
            color: ${colors.neutral.darker};
        }
    }
    & li::before {
        content: counter(list-counter);
        color: white;
        font-size: 1rem;
        font-weight: bold;
        position: absolute;
        --size: 15px;
        left: calc(-1 * var(--size) - 10px);
        width: var(--size);
        height: var(--size);
        line-height: var(--size);
        top: 2px;
        background: gray;
        border-radius: 50%;
        text-align: center;
    }
`;

const AverageInfoModal = ({ ux }) => {
  return useObserver(() =>
    <StyledModal
      show={ux.showAverageInfoModal}
      onHide={() => ux.hideAverageInfo()}
    >
      <Modal.Header closeButton>
          How OpenStax Tutor calculates averages
      </Modal.Header>
      <Modal.Body>
        <List>
          <li>
            <p>Homework assignment average is based on equally weighted homework assignments that are past due.</p>
            <p>
                The point value of each assignment is averaged so that all homework assignments have equal weight.
            </p>
            <p>
                Example:
            </p>
          </li>
          <li>
            <p>Reading assignment average is based on equally weighted reading assignments that are past due.</p>
            <p>
                The point value of each assignment is averaged so that all reading assignments have equal weight.
            </p>
            <p>
                Example:
            </p>
          </li>
        </List>
      </Modal.Body>
    </StyledModal>);
};
AverageInfoModal.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default AverageInfoModal;