import React from 'react';
import { OverlayTrigger, Button, Popover } from 'react-bootstrap';
import { observer, styled } from 'vendor';
import { TemplateBody } from '../grading-templates/card';

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

const PreviewTooltip = observer(({ template }) => {
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
      <StyledButton variant="link" id="preview-card-trigger">
        Preview
      </StyledButton>
    </OverlayTrigger>
  );
});

export default PreviewTooltip;
