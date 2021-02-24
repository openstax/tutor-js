import { styled } from 'vendor';
import { colors } from 'theme';
import { Button } from 'react-bootstrap';

// This file is intended to hold very lightweight wrappers around other components

export const ToolbarButton = styled(Button).attrs({
    variant: 'plain',
})`
  && { border: 1px solid ${colors.neutral.pale}; }
`;
