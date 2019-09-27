import { React, PropTypes, styled } from 'vendor';
import S from '../../helpers/string';
import Plan from '../../models/task-plans/teacher/plan';
import { Card } from 'react-bootstrap';
import { CloseButton } from 'shared';

const HeaderWrapper = styled(Card.Header)`
    border-bottom: none;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 2.4rem;
    font-weight: 700;
`;


const Header = ({ plan, onCancel, label = 'Assignment' }) => {
  let headerText;

  if (label) { label = ` ${label}`; }

  const type = S.capitalize(plan.type);

  if (plan.isNew) {
    headerText = `Add ${type}${label}`;
  } else {
    headerText = `Edit ${type}${label}`;
  }

  return (
    <HeaderWrapper
      className="data-assignment-header"
      data-assignment-type={plan.type}
    >
      <span key="header-text">
        {headerText}
      </span>
      <CloseButton key="close-button" className="pull-right" onClick={onCancel} />
    </HeaderWrapper>
  );
};

Header.propTypes = {
  label: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  plan: PropTypes.instanceOf(Plan).isRequired,
};


export default Header;
