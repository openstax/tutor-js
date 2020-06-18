import { styled, css } from 'vendor';
import { StickyTable, Cell as TableCell } from 'react-sticky-table';
import { Icon } from 'shared';
import { colors } from 'theme';

const StyledStickyTable = styled(StickyTable)`
  margin: 2.2rem 0 1.4rem;

  .sticky-table-row:last-child .sticky-table-cell {
    border-bottom: 1px solid ${colors.neutral.pale};
  }

  .sticky-table-cell {
    vertical-align: middle;
  }
`;

const Cell = styled(TableCell)`
  padding: 0;
  border-width: 1px;
  border-color: transparent;
  border-left: 1px solid ${colors.neutral.pale};
  cursor: ${props => props.onClick || props.clickable ? 'pointer' : 'inherit'};
  &:last-child {
    border-right: 1px solid ${colors.neutral.pale};
  }
  ${props => props.striped && css`
    background: ${colors.neutral.lighter};
  `}
  && {
    ${props => props.isTrouble && isTroubleCSS}
  }
`;


const centeredCSS = css`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const paddingCSS = css`
  padding: 1.2rem 1.6rem;
`;

const CellContents = styled.div`
  ${centeredCSS}
  > * { width: 80px; }
  > *:first-child {
    width: 16rem;
  }
`;


const Heading = styled.div`
  ${props => !props.first && centeredCSS}
  ${props => props.first && !props.noBorder && css`
    border-right: 1px solid ${colors.neutral.pale};
  `}
  ${paddingCSS}
`;

const HeadingTop = styled.div`
  ${paddingCSS}
  padding-top: 1.2rem;
  align-self: stretch;
  font-weight: bold;
  cursor: pointer;
`;

const HeadingMiddle = styled.div`
  ${paddingCSS}
  align-self: stretch;
  padding-top: 0;
  font-size: 1rem;
  color: ${colors.neutral.thin};
`;

const HeadingBottom = styled.div`
  ${paddingCSS}
  align-self: stretch;
  font-size: 1.2rem;
  line-height: 1.4rem;
  color: ${colors.neutral.thin};
  background: #fff;
  position: relative;
`;

const ColumnHeading = styled.div`
  border-top: 0.4rem solid ${props => props.variant === 'q' ? colors.templates.homework.border : colors.neutral.std};
  cursor: ${props => props.onClick || props.clickable ? 'pointer' : 'inherit'};
  &:not(:last-child) {
    border-right: 1px solid ${colors.neutral.pale};
  }
  > * {
    ${props => !props.first && css`
      ${centeredCSS}
    `}
  }
`;

const ColumnFooter = styled.div`

  &:not(:last-child) {
    border-right: 1px solid ${colors.neutral.pale};
  }
  > * {
    /* TODO change to 1.6rem across the board */
    font-size: 1.4rem;
    ${props => !props.first && css`
      ${centeredCSS}
    `}
  }
`;

const SplitCell = styled.div`
  ${centeredCSS}
  flex: 1.0;
  font-size: 1.4rem;
  ${props => props.variant != 'active' && `color: ${colors.link};`}
  ${props => props.variant == 'divider' && `color: ${colors.neutral.pale};`}
  ${props => props.variant != 'divider' && 'cursor: pointer;'}
`;

const LateWork = styled.div`
  padding: 0;
  ${centeredCSS}
  align-self: stretch;
  position: relative;

  .extension-icon {
    position: absolute;
    right: 1rem;
  }
`;

const Total = styled.div`
  padding: 0;
  align-self: stretch;
  border-right: 1px solid  ${colors.neutral.pale};
  ${centeredCSS}
`;

const isTroubleCSS = css`
  background-color: ${colors.states.trouble};
  border-top: 1px solid ${colors.danger};
  border-bottom: 1px solid ${colors.danger} !important;
`;

const DefinitionsWrapper = styled.dl`
  margin: 1.4rem 0;
  display: flex;
  align-items: center;
  dd + dt {
    margin-left: 4.8rem;
  }
`;

const Term = styled.dt`
  border-color: ${colors.neutral.light};
  border-style: solid;
  ${props => props.variant === 'trouble' && isTroubleCSS}
  ${props => props.variant === 'trouble' && `border-color: ${colors.danger}`};
  border-width: 1px;
  display: flex;
  justify-content: center;
  width: 5.6rem;
  height: 2.8rem;
  margin-right: 1.1rem;
  font-size: 1.4rem;
  line-height: 2.4rem;
`;

const Definition = styled.dd`
  margin: 0;
  color: ${colors.neutral.thin};
`;

const ControlsWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 3rem;
`;

const ControlGroup = styled.div`
  display: flex;

  .input-group {
    width: 25.6rem;

    input {
      height: 3.8rem;
    }
  }

  && {
    > *:not(:first-child), > .btn + .btn {
      margin-left: 1.6rem;
    }
    .btn:not(.btn-icon) {
      height: 4rem;
      min-width: 17rem;
    }
  }
`;

const OrderIcon = styled(Icon)`
  &&.btn {
    transition: none;
    font-size: 1.2rem;
    line-height: 1.2rem;

    &:hover, &:focus {
      box-shadow: none;
    }
  }
`;

const NameWrapper = styled(Heading)`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;


export {
  StyledStickyTable, Cell, centeredCSS, paddingCSS, CellContents,
  Heading, HeadingTop, HeadingMiddle, HeadingBottom,
  ColumnHeading, ColumnFooter,
  SplitCell, LateWork, Total, isTroubleCSS,
  DefinitionsWrapper, Term, Definition,
  ControlsWrapper, ControlGroup,
  OrderIcon, NameWrapper,
};
