import { React, styled } from '../../helpers/react';
import { Icon } from 'shared';
import Theme from '../../theme';

const Wrapper = styled.div`
  display: flex;
  margin: 1rem 0;
  span + span {
    margin-left: 2rem;
  }
`;

const LateIconLedgend = () => {
  return (
    <Wrapper>
      <span>
        <Icon color={Theme.colors.warning} type="exclamation-circle" /> Due Tomorrow
      </span>
      <span>
        <Icon color={Theme.colors.danger} type="clock" /> Late but not accepted
      </span>
      <span>
        <Icon color={Theme.colors.neutral.lite} type="clock" /> Late but accepted
      </span>
    </Wrapper>
  );
};

export default LateIconLedgend;
