import { React } from 'vendor';
import Warning from '../../components/warning-modal';

const UnknownType = () => (
  <Warning title="Unknown assignment type">
    Please check the link you used and try again
  </Warning>
);

export default UnknownType;
