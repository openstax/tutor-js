import { styled, css } from 'vendor';
import { StickyTable, Cell as TableCell } from 'react-sticky-table';
import { Icon } from 'shared';
import { colors } from 'theme';

const StyledStickyTable = styled(StickyTable)`
  margin: 2.2rem 0 1.4rem;

  && {
    border-collapse: collapse;

    .sticky-table-row {
      .sticky-table-cell {
        vertical-align: middle;
        font-size: 1.6rem;
        border-bottom: 0;
        /* Fix a Firefox bug that prevents borders from rendering when
           using sticky position with border-collapse. */
        background-clip: padding-box;
      }

      &:first-child .sticky-table-cell {
        border-bottom: 2px solid ${colors.neutral.pale};
      }

      &:last-child .sticky-table-cell {
        border-bottom: 1px solid ${colors.neutral.pale};
        border-top: 2px solid ${colors.neutral.pale};
      }
    }
  }
`;

const Cell = styled(TableCell)`
  position: relative;
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
  /* Order and specificity here is important */
  &&&.sticky-table-cell {
    ${props => props.isUnattemptedAutoZero && isUnattemptedAutoZeroCSS}
    ${props => props.isTrouble && isTroubleCSS}
    ${props => props.border === false && 'border-bottom: 0;'}
  }

  .ox-icon-clock {
    position: absolute;
    top: 3px;
    left: 5px;
    margin: 0;
    width: 0.8rem;
    height: 0.8rem;
  }
  && {
    ${props => props.borderTop && css`
      border-top: 1px solid ${colors.neutral.pale};
    `}
    }
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
  min-height: 3.8rem;
`;

const ColumnHeading = styled.div`
  border-top: 0.4rem solid ${props => props.variant === 'q' ? colors.templates.homework.border : colors.neutral.std};
  cursor: ${props => props.onClick || props.clickable ? 'pointer' : 'inherit'};
  font-size: 1.4rem;
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
  border-top: 1px solid ${colors.danger} !important;
  border-bottom: 1px solid ${colors.danger} !important;
`;

const isUnattemptedAutoZeroCSS = css`
  background-color: ${colors.neutral.light};
  border-top: 1px solid ${colors.neutral.std};
  border-bottom: 1px solid ${colors.neutral.std};
`;

const TableBottom = styled.div`
  margin: 2.4rem 0;
  max-width: 788px;
  color: ${colors.neutral.thin};
  line-height: 2rem;
`;

const Definitions = styled.dl`
  display: flex;
  align-items: center;
  flex-wrap: wrap;

  > * {
    display: flex;
    align-items: center;
    margin-right: 2.4rem;
    margin-bottom: 0.8rem;

    > :first-child {
      width: 3rem;
    }
  }
`;

const Entry = styled.div`
  ${props => props.wide && 'width: 344px'}
`;

const Term = styled.dt`
  ${props => props.variant !== 'icon' && css`
    border-color: ${colors.neutral.light};
    border-style: solid;
  `}
  ${props => props.variant === 'trouble' && css`
    ${isTroubleCSS}
    border-color: ${colors.danger};
  `}
  ${props => props.variant === 'unattempted' && css`
    ${isUnattemptedAutoZeroCSS}
    border-color: ${colors.neutral.std};
  `}
  ${props => props.variant !== 'icon' && css`
    border-width: 1px;
    display: flex;
    justify-content: center;
  `}
  width: 3rem;
  height: 1.8rem;
  font-size: 1.4rem;
  line-height: 1.4rem;
  ${props => props.variant === 'icon' && css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    > * {
      max-width: 1.8rem;
    }
    .ox-icon {
      margin: 0;
    }
  `}
`;

const Definition = styled.dd`
  margin: 0 0 0 0.8rem;
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
    TableBottom, Definitions, Entry, Term, Definition,
    ControlsWrapper, ControlGroup,
    OrderIcon, NameWrapper,
};
