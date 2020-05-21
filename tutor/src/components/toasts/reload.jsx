import { React, observer, useState, useEffect } from 'vendor';
import ReloadButton from '../buttons/reload-page';
import { Button } from 'react-bootstrap';
import FeatureFlags from '../../models/feature_flags';

const UserInitiatedReload = () => (
  <div className="body">
    <p>
      This page needs to be reloaded.
    </p>
    <ReloadButton>Reload</ReloadButton>
  </div>
);

const performRedirect = () => window.location = '/dashboard';

const ForceReload = () => {
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    setTimeout(() => {
      if (timeLeft == 1) {
        performRedirect();
      } else {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);
  });

  return (
    <div className="body">
      <p>
        You will be redirected to the Current Courses page in {timeLeft} seconds.
      </p>
      <Button className="reload-page" onClick={performRedirect}>Reload Now</Button>
    </div>
  );
};

const ReloadToast = observer(() => {
  const Body = FeatureFlags.force_browser_reload ? ForceReload : UserInitiatedReload;
  
  return (
    <div className="toast neutral reload">
      <div className="title">
        <span>Updates available</span>
      </div>
      <Body />
    </div>
  );
});

export default ReloadToast;
