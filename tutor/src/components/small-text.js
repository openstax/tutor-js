import { styled } from 'vendor';
import { colors } from 'theme';

const SmallText = styled.p`
  font-size: ${props => props['font-size'] || 'smaller'};
  color: ${colors.neutral.thin};
`

export default SmallText
