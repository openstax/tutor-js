import { React, PropTypes, observable, idType, observer, cn } from '../../helpers/react';
import Plan from '../../models/task-plans/teacher/plan';
import { Card } from 'react-bootstrap';

const Header = ({ plan, label = 'Assignment'}) => {
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
      <CloseButton key="close-button" className="pull-right" onClick={this.cancel} />
    </Card.Header>
  );
};

Header.propTypes = {
  label: PropTypes.string,
  plan: PropTypes.instanceOf(Plan).isRequired,
};


export default Header;
