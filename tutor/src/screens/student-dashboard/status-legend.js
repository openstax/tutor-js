import { React, styled } from 'vendor';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Icon } from 'shared';
import Theme from '../../theme';

const Wrapper = styled.div`
  display: flex;
  margin: 1rem 0;
  font-size: 1.2rem
  span + span {
    margin-left: 2rem;
  }
`;

const StatusIconLedgend = props => {
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
        <Icon variant="circledStar" /> Provisional score. FInal scores will be available when published by your instructor.
      </span>

    </Wrapper>
  );
};

StatusIconLedgend.propTypes = {
  tasks: PropTypes.oneOfType([
    PropTypes.object, PropTypes.array,
  ]).isRequired,
};

export default StatusIconLedgend;
