import { currentToasts, setToastHandlers } from 'shared/model/toasts';
import Published from '../components/exercise/published-toast';

setToastHandlers({
    published() {
        return Published;
    },
});

export default currentToasts;
