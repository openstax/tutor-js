import { React, styled } from '../../helpers/react';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Icon } from 'shared';
import Theme from '../../theme';

const Wrapper = styled.div`
  display: flex;
  margin: 1rem 0;
  span + span {
    margin-left: 2rem;
  }
`;

const LateIconLedgend = props => {
  if (isEmpty(props.tasks)) {
    return null;
  }

  return (
    <Wrapper>
      <span>
        <Icon color={Theme.colors.warning} type="exclamation-circle" /> Due soon
      </span>
      <span>
        <Icon color={Theme.colors.danger} type="clock" /> Late
      </span>
      <span>
        <Icon color={Theme.colors.neutral.thin} type="clock" /> Late but accepted
      </span>
    </Wrapper>
  );
};

LateIconLedgend.propTypes = {
  tasks: PropTypes.array.isRequired,
};

export default LateIconLedgend;
