import { React, styled } from 'vendor';
import { isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { Icon } from 'shared';
import Theme from '../../theme';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1rem 0;
  font-size: 1.2rem;
  span {
    display: flex;
    align-items: center;

    svg.fa-star {
      padding: 3px;
    }
  }
  span + span {
    margin-left: 2rem;
  }
`;

const StatusIconLegend = props => {
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
        <Icon variant="circledStar" /> Provisional score. Final scores will be available when published by your instructor.
      </span>

    </Wrapper>
  );
};

StatusIconLegend.propTypes = {
  tasks: PropTypes.oneOfType([
    PropTypes.object, PropTypes.array,
  ]).isRequired,
};

export default StatusIconLegend;
