import { React, styled } from 'vendor';
import { colors } from 'theme';
import { Icon } from 'shared';

const StyledIcon = styled(Icon).attrs({
    className: 'icon',
})`
  .arrow-wrapper &&&.icon {
    top: calc(55vh - 80px);
    margin: 80px auto;
    path {
      fill: ${colors.neutral.grayblue};
    }
    height: 80px;
    width: 80px;
    border: 1px solid ${colors.neutral.grayblue};
    border-radius: 50%;
    padding: 20px 24px;
    opacity: 0.6;
  }
`;

const NextIcon = () => <StyledIcon type="chevron-right" />;
const PrevIcon = () => <StyledIcon type="chevron-left" />;

export { PrevIcon, NextIcon };
