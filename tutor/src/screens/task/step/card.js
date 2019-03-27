import { styled } from '../../../helpers/react';
import Theme from '../../../theme';

const StepCard = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  min-height: 400px;
  width: 1000px;
  border-radius: 0.25rem;
  margin: 10rem auto;
  border: 1px solid ${Theme.colors.neutral.light};
  border-radius: 0.25rem;
  ${props => !props.noPadding && 'padding: 50px 140px;'}
`;

export { StepCard };
