import PropTypes from 'prop-types';
import { React, observer } from '../../helpers/react';
import { map, get, isObject } from 'lodash';
import UserMenu from '../../models/user/menu';

const SUPPORT_LINK_PARAMS = '&cu=1&fs=ContactUs&q=';

const makeContactMessage = function({ status, statusMessage, config, location }) {
  const { userAgent } = window.navigator;
  const { data } = config;
  let reqDetails = `${config.method} on ${config.url} returned status "${status}" with message "${statusMessage}"`;
  if (data) {
    reqDetails += `\n\nThe request body was:\n${isObject(data) ? JSON.stringify(data, null, 2) : data}`;
  }

  return `Hello!

I ran into a problem at ${location} while using browser
${userAgent}.

The request details are:
${reqDetails}.`;
};

const makeContactURL = function({ status, statusMessage, config }) {
  const location = window.location.href;
  const body = encodeURIComponent(makeContactMessage({ status, statusMessage, config, location }));
  const subject = encodeURIComponent(`OpenStax Tutor Error ${status} at ${location}`);
  return `mailto:${UserMenu.supportEmail}?subject=${subject}&body=${body}`;
};

const ServerErrorMessage = observer((props) => {
  let dataMessage, debugInfo;
  let { status, statusMessage, config, debug, data } = props;
  if (statusMessage == null) { statusMessage = 'No response was received'; }
  if (status == null) { status = 0; }

  const noStatusMessage = status ? '' : <h4>It looks like your internet connection was interrupted,<br />please check your connection and retry</h4>;

  const errorsMessage = (
    <span>
      {map(get(data, 'errors', [{ code: statusMessage }]),'code').join(', ')}
    </span>
  );

  if (config.data) {
    dataMessage = <span>with <pre>{config.data}</pre></span>;
  }

  if (debug) {
    debugInfo = [
      <p key="error-note">
        Additional error messages returned from the server is:
      </p>,
      <pre key="errors" className="response">
        {errorsMessage}
      </pre>,
      <div key="request" className="request">
        <kbd>{config.method}</kbd> on {config.url} {dataMessage}
      </div>,
    ];
  }

  const mailTo = makeContactURL({ status, statusMessage, config });

  return (
    <div className="server-error">
      <h3>
        An error with code {status} has occured
      </h3>
      {noStatusMessage}
      <p>
        Please <a href={mailTo}>contact us</a> to file a bug report.
      </p>
      {debugInfo}
    </div>
  );
});

ServerErrorMessage.displayName = 'ServerErrorMessage';

ServerErrorMessage.propTypes = {
  status: PropTypes.number,
  data: PropTypes.object,
  statusMessage: PropTypes.string,
  config: PropTypes.object,
  debug: PropTypes.bool,
};

ServerErrorMessage.defaultProps = {
  config: {},
  debug: true,
};

export default ServerErrorMessage;
