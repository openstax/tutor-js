import { React, PropTypes, observer, styled } from 'vendor';
import { Modal, Table } from 'react-bootstrap';
import { colors } from 'theme';
import { ArbitraryHtmlAndMath } from 'shared';

const StyledModal = styled(Modal)`
    .modal-dialog {
        max-width: 700px
    }
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
    & li:not(:first-child) {
        margin-top: 40px;
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

const StyleTable = styled(Table)`
    margin-top: 15px;
    thead {
        border-top: .5rem solid ${props => props.variant === 'homework' ? colors.templates.homework.border : colors.templates.reading.border};
        & tr {
            background-color: ${props => props.variant === 'homework' ? colors.highlight : '#fdf7d9'};
        }
        & tr th {
            border: none;
            vertical-align: middle;
        }
    }
    tbody {
        & tr {
        background-color: ${props => props.variant === 'homework' ? '#9ce8f4' : '#ffe4a1'};
        }
        & tr td {
            vertical-align: middle;
            & .openstax-has-html {
              font-size: 1.8rem;
            }
        }
    }
    & tr {
        text-align: center;
        height: 50px;
    }
`;

const AverageInfoModal = observer(({ ux }) => {
    return (
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
                        <StyleTable variant="homework">
                            <thead>
                                <tr>
                                    <th>HW1</th>
                                    <th>HW2</th>
                                    <th>HW3</th>
                                    <th>Homework assignment average</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>12/15</td>
                                    <td>24/30</td>
                                    <td>48/60</td>
                                    <td>
                                        <div>
                                            <ArbitraryHtmlAndMath html={'<span data-math="{{12 \\over 15} + {24 \\over 30} + {48 \\over 60} \\over 3} * 100 = 80\\%"></span>'}/>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </StyleTable>
                    </li>
                    <li>
                        <p>Reading assignment average is based on equally weighted reading assignments that are past due.</p>
                        <p>
                The point value of each assignment is averaged so that all reading assignments have equal weight.
                        </p>
                        <p>
                Example:
                        </p>
                        <StyleTable>
                            <thead>
                                <tr>
                                    <th>RD1</th>
                                    <th>RD2</th>
                                    <th>RD3</th>
                                    <th>Reading assignment average</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>12/15</td>
                                    <td>24/30</td>
                                    <td>48/60</td>
                                    <td>
                                        <div>
                                            <ArbitraryHtmlAndMath html={'<span data-math="{{12 \\over 15} + {24 \\over 30} + {48 \\over 60} \\over 3} * 100 = 80\\%"></span>'}/>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </StyleTable>
                    </li>
                </List>
            </Modal.Body>
        </StyledModal>
    );
});
AverageInfoModal.propTypes = {
    ux: PropTypes.object.isRequired,
};

export default AverageInfoModal;
