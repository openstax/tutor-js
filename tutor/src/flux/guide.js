import { CrudConfig, makeSimpleStore, extendConfig } from './helpers';

const CourseGuideConfig = {};

extendConfig(CourseGuideConfig, new CrudConfig());
const { actions, store } = makeSimpleStore(CourseGuideConfig);
export { actions as CourseGuideActions, store as CourseGuideStore };
