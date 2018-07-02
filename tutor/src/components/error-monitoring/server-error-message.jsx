import { React, observer } from '../../helpers/react';
import { map, get, isObject } from 'lodash';
import UserMenu from '../../models/user/menu';

const SUPPORT_LINK_PARAMS = '&cu=1&fs=ContactUs&q=';

const makeContactMessage = function(status, message, data, request) {
  if (request == null) { request = { method: 'unknown', url: '' }; }
  const { userAgent } = window.navigator;
  const location = window.location.href;

  let errorInfo = `${status} with ${message} for ${request.method} on ${request.url}`;

  if (request.data) {
    const data = isObject(request.data) ? JSON.stringify(request.data, null, 2) : request.data;
    errorInfo += ` with\n${data}`;
  }

  return `Hello!
I ran into a problem on
${userAgent} at ${location}.

Here is some additional info:
${errorInfo}.`;
};

const makeContactURL = function(supportLinkBase, status, message, data, request) {
  const location = window.location.href;
  const body = encodeURIComponent(makeContactMessage(status, message, data, request));
  const subject = encodeURIComponent(`OpenStax Tutor Error ${status} at ${location}`);
  return `mailto:${UserMenu.supportEmail}?subject=${subject}&body=${body}`;
};

const ServerErrorMessage = observer((props) => {
  let dataMessage, debugInfo;
  let { status, statusMessage, config, debug, data } = props;
  if (statusMessage == null) { statusMessage = 'No response was received'; }

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

  const mailTo = makeContactURL(status, statusMessage, data, config);

  return (
    <div className="server-error">
      <h3>
        An error with code {status} has occured
      </h3>
      <p>
        Please <a href={mailTo}>contact us</a> to file a bug report.
      </p>
      {debugInfo}
    </div>
  );
});

ServerErrorMessage.displayName = 'ServerErrorMessage';

ServerErrorMessage.propTypes = {
  status: React.PropTypes.number,
  data: React.PropTypes.object,
  statusMessage: React.PropTypes.string,
  config: React.PropTypes.object,
  debug: React.PropTypes.bool,
};

ServerErrorMessage.defaultProps = { debug: true };

export default ServerErrorMessage;
