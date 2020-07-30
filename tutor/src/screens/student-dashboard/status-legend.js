import { React, styled } from 'vendor';
import PropTypes from 'prop-types';
import { Icon } from 'shared';
import { colors } from 'theme';
import { EIcon } from '../../components/icons/extension';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 1rem 0;
  font-size: 1.2rem;
  flex-wrap: wrap;
  justify-content: left;
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

  ${props => props.theme.breakpoint.mobile`
    span:last-child {
      margin-left: 0;
      margin-top: 5px;
    }
  `}
`;

const StyledEIcon = styled(EIcon)`
  margin-right: 0.5rem;
  min-width: 12px;
  min-height: 12px;
  width: 12px;
  height: 12px;
  font-size: 0.8rem;
  line-height: 1.2rem;
`;

const StatusIconLegend = () => (
  <Wrapper>
    <span>
      <Icon color={colors.warning} type="exclamation-circle" /> Due soon
    </span>
    <span>
      <Icon color={colors.danger} type="clock" /> Late
    </span>
    <span>
      <StyledEIcon /> Extension
    </span>
    <span>
      <Icon variant="circledStar" /> Provisional score. Final scores will be available when published by your instructor.
    </span>
  </Wrapper>
);

StatusIconLegend.propTypes = {
  tasks: PropTypes.oneOfType([
    PropTypes.object, PropTypes.array,
  ]).isRequired,
};

export default StatusIconLegend;
