import { styled } from 'vendor';
import Theme from '../../theme';
import { Button } from 'react-bootstrap';

const SecondaryToolbarButton = styled(Button)`
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  color: ${Theme.colors.neutral.grayblue};
  background-color: transparent;
  border: none;
  white-space: nowrap;
  padding: 2.1rem 1rem;

  svg {
    height: 1.8rem;
    margin-right: 0.8rem;
  }
`;

export default SecondaryToolbarButton;
