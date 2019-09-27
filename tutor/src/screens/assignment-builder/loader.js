import { React } from 'vendor';
import ContentLoader from 'react-content-loader';

const TaskPlanLoader = () => (
  <ContentLoader
    height={160}
    width={400}
    speed={2}
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="25" y="15" rx="5" ry="5" width="220" height="10" />
    <rect x="25" y="45" rx="5" ry="5" width="220" height="40" />
    <rect x="25" y="75" rx="5" ry="5" width="220" height="10" />
    <rect x="25" y="105" rx="5" ry="5" width="40" height="10" />
    <rect x="85" y="105" rx="5" ry="5" width="40" height="10" />
    <rect x="145" y="105" rx="5" ry="5" width="40" height="10" />
    <rect x="205" y="105" rx="5" ry="5" width="40" height="10" />
    <rect x="25" y="145" rx="5" ry="5" width="140" height="10" />
  </ContentLoader>
);

export default TaskPlanLoader;
