import { React, observer, cn, observable } from '../../helpers/react';
import { Button, Card } from 'react-bootstrap';

const BackButton = observer(({ ux }) => {
  if (!ux.canGoBackward) { return null; }
  return (
    <Button onClick={ux.goBackward} className="back">
      Back
    </Button>
  );
});

export default BackButton;
