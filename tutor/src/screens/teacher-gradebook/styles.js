import { styled, css } from 'vendor';
import { Cell as TableCell } from 'react-sticky-table';
import { colors } from 'theme';

export const getCell = (padding) => styled(TableCell)`
  padding: ${padding};
  border-bottom: 0;
  text-align: center;
  vertical-align: middle;
  border-left: 1px solid ${colors.neutral.pale};
  &:last-child {
    border-right: 1px solid ${colors.neutral.pale};
  }
  ${props => props.striped && css`
    background: ${colors.neutral.lighter};
  `}
  ${props => props.drawBorderBottom && css`
    border-bottom: 1px solid ${colors.neutral.pale};
  `};
`;
