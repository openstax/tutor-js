import { React, styled } from 'vendor';
import PropTypes from 'prop-types';
import { Icon } from 'shared';
import { colors } from 'theme';
import { EIcon } from '../../components/icons/extension';

const Wrapper = styled.div`
  display: inline-flex;
  flex-direction: row;
  font-size: 1.1rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  /* https://coryrylan.com/blog/css-gap-space-with-flexbox */
  --gap-top: 5px;
  --gap-bottom: 12px;
  margin: calc(-1 * var(--gap-top)) 0 0 calc(-1 * var(--gap-bottom));
  width: calc(100% + var(--gap));
  > div {
    display: flex;
    align-items: flex-start;
    margin: var(--gap-top) 0 0 var(--gap-bottom);

    .extension-icon, svg {
      margin-top: 2px;
    }
  }
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
    <div>
      <div><Icon color={colors.warning} type="exclamation-circle" /></div> <span>Due soon</span>
    </div>
    <div>
      <div><Icon color={colors.danger} type="clock" /></div> <span>Late work</span>
    </div>
    <div>
      <div><StyledEIcon /></div> <span>Extension</span>
    </div>
    <div>
      <div><Icon variant="circledStar" /></div> <span>Provisional score. Final scores will be available when published by your instructor.</span>
    </div>
  </Wrapper>
);

StatusIconLegend.propTypes = {
  tasks: PropTypes.oneOfType([
    PropTypes.object, PropTypes.array,
  ]).isRequired,
};

export default StatusIconLegend;
