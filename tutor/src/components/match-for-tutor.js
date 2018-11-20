import { OXMatchByRouter } from 'shared';
import Router from '../helpers/router';
import InvalidPage from './invalid-page';

const MatchForTutor = OXMatchByRouter(Router, InvalidPage, 'TutorRouterMatch');
export default MatchForTutor;
