import without from 'lodash/without';
import omit from 'lodash/omit';
import keys from 'lodash/keys';

export default {
    removeDefined(obj, options = {}) {
        let namedProps = keys(obj.constructor.propTypes);
        if (options.allow) {
            namedProps = without(namedProps, options.allow);
        }
        if (options.alsoExclude) {
            namedProps = without(namedProps, options.alsoExclude);
        }

        return omit(obj.props, namedProps);
    },
};
