import { React, PropTypes, observable, idType, observer, cn } from '../../helpers/react';
import S from '../../helpers/string';
import Plan from '../../models/task-plans/teacher/plan';
import { Card } from 'react-bootstrap';
import { CloseButton } from 'shared';

const Header = ({ plan, onCancel, label = 'Assignment'}) => {
  let headerText;

  if (label) { label = ` ${label}`; }

  const type = S.capitalize(plan.type);

  if (plan.isNew) {
    headerText = `Add ${type}${label}`;
  } else {
    headerText = `Edit ${type}${label}`;
  }

  return (
    <Card.Header>
      <span key="header-text">
        {headerText}
      </span>
      <CloseButton key="close-button" className="pull-right" onClick={onCancel} />
    </Card.Header>
  );
};

Header.propTypes = {
  label: PropTypes.string,
  onCancel: PropTypes.func.isRequired,
  plan: PropTypes.instanceOf(Plan).isRequired,
};


export default Header;
