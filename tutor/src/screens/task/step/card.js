import { React, PropTypes, styled } from '../../../helpers/react';
import Theme from '../../../theme';

const StepCard = styled.div`
  flex: 1 1 auto;
  min-height: 400px;
  width: 1000px;
  border-radius: 0.25rem;
  margin: 10rem auto 0 auto;
  border: 1px solid ${Theme.colors.neutral.light};
  border-radius: 0.25rem;
  ${props => !props.noPadding && 'padding: 50px 140px;'}
`;

export { StepCard };

//
// import { React, PropTypes, styled } from '../../../helpers/react';
// import Theme from '../../../theme';
//
// const StepCard = styled.div`
// flex: 1 1 auto;
// min-height: 400px;
//   width: 1000px;
//   border-radius: 0.25rem;
//   margin: 10rem auto 0 auto;
//   border: 1px solid ${Theme.colors.neutral.light};
//   border-radius: 0.25rem;
// `;
//
// const PaddedCard = styled(StepCard)`
//   padding: 50px 140px;
// `;
// StepCard.displayName = 'StepCard';
// StepCard.propTypes = {
//   children: PropTypes.node.isRequired,
// };
//
// export { StepCard, FillWidthStepCard };
