import { React, PropTypes, observer, styled } from 'vendor';
import { OverlayTrigger, Button, Popover } from 'react-bootstrap';
import { TemplateBody } from '../grading-templates/card';
import { GradingTemplate } from '../../models/grading/templates';

const StyledButton = styled(Button)`
  &.btn {
    font-size: 1.6rem;
  }

  margin-left: 0.8rem;
`;

const StyledContent = styled(Popover.Content)`
  .card {
    border: 0;
  }
`;

const PreviewTooltip = observer(({ template, variant }) => {
  if (!template) { return null; }

  return (
    <OverlayTrigger
      trigger="click"
      placement="right"
      overlay={
        <Popover id="preview-card-popover">
          <StyledContent>
            <TemplateBody template={template} />
          </StyledContent>
        </Popover>
      }
      rootClose={true}
    >
      <StyledButton variant={variant || 'link'} data-test-id="preview-card-trigger">
        Preview
      </StyledButton>
    </OverlayTrigger>
  );
});

PreviewTooltip.propTypes = {
  template: PropTypes.instanceOf(GradingTemplate).isRequired,
};

export default PreviewTooltip;
