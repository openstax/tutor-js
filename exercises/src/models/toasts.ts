import { currentToasts, setHandlers } from 'shared/model/toasts';
import Published from '../components/exercise/published-toast';

setHandlers({
    published() {
        return Published;
    },
});

export default currentToasts;
