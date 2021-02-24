import _ from 'underscore';
import keymaster from 'keymaster';

const keysHelper = {};

const handleKeys = function(keyFN, keys, ...keymasterArgs) {
    if (!keys) { return (keys != null); }
    // cover for some annoying keymaster bugs
    if (_.isArray(keys)) {
        return _.each(keys, key => keyFN(key.toString(), ...Array.from(keymasterArgs)));
    } else {
        return keyFN(keys, ...Array.from(keymasterArgs));
    }
};

keysHelper.on = _.partial(handleKeys, keymaster);

keysHelper.off = _.partial(handleKeys, keymaster.unbind);

keysHelper.getCharFromNumKey = (numKey, offset = 1) => String.fromCharCode((97 - offset) + numKey);

export default keysHelper;
