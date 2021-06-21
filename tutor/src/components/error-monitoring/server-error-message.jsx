import PropTypes from 'prop-types';
import { React, observer } from 'vendor';
import { makeContactURL } from '../../helpers/contact';
const SUPPORT_LINK_PARAMS = '&cu=1&fs=ContactUs&q=';

const ServerErrorMessage = observer((props) => {
    let dataMessage;
    let { apiResponse, message, config, data } = props;

    const statusMessage = message || apiResponse?.statusText || 'No response was received'
    const status = apiResponse?.status || 0

    const fetchFailure = apiResponse?.statusText?.match(/Failed to fetch/) && <h4>It looks like your internet connection was interrupted,<br />please check your connection and retry</h4>;

    if (data) {
        dataMessage = <span>Information returned was: <pre>{JSON.stringify(data, null, 2)}</pre></span>;
    }

    const mailTo = makeContactURL({ status, statusMessage, config });

    return (
        <div className="server-error">
            <h3>
                {status} {statusMessage}
            </h3>
            {fetchFailure}
            <p>
                Please <a href={mailTo}>contact us</a> to file a bug report.
            </p>
            {dataMessage}
        </div>
    );
});

ServerErrorMessage.displayName = 'ServerErrorMessage';

ServerErrorMessage.propTypes = {
    status: PropTypes.number,
    data: PropTypes.oneOfType([
        PropTypes.object, PropTypes.string,
    ]),
    statusMessage: PropTypes.string,
    message: PropTypes.string,
    config: PropTypes.object,
    debug: PropTypes.bool,
};

ServerErrorMessage.defaultProps = {
    config: {},
    debug: true,
};

export default ServerErrorMessage;
