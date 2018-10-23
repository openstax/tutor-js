import OXRouter from 'shared/helpers/router';
import { getRoutes } from '../routes';

const TutorRouter = new OXRouter;

TutorRouter.setRoutes(getRoutes(TutorRouter));

export default TutorRouter;
