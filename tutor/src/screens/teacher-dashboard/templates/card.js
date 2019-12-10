import { React, styled, PropTypes, observer } from 'vendor';
import { GradingTemplate } from '../../../models/grading/templates';
import { Card, Button } from 'react-bootstrap';

const StyledCard = styled(Card)`

`;

const TemplateCard = observer(({ template, onEdit }) => {
  return (
    <StyledCard>
      <Card.Body>
        {template.name}
        <Button onClick={() => onEdit(template)}>edit</Button>
      </Card.Body>
    </StyledCard>
  );
});
TemplateCard.displayName = 'TemplateCard';
TemplateCard.propTypes = {
  onEdit: PropTypes.func.isRequired,
  template: PropTypes.instanceOf(GradingTemplate).isRequired,
};


export default TemplateCard;
