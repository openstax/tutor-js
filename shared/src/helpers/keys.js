import { isArray, forEach, partial } from 'lodash'
import keymaster from 'keymaster';

const keysHelper = {};

const handleKeys = function(keyFN, keys, ...keymasterArgs) {
    if (!keys) { return (keys != null); }
    // cover for some annoying keymaster bugs
    if (isArray(keys)) {
        return forEach(keys, key => keyFN(key.toString(), ...Array.from(keymasterArgs)));
    } else {
        return keyFN(keys, ...Array.from(keymasterArgs));
    }
};

keysHelper.on = partial(handleKeys, keymaster);

keysHelper.off = partial(handleKeys, keymaster.unbind);

keysHelper.getCharFromNumKey = (numKey, offset = 1) => String.fromCharCode((97 - offset) + numKey);

export default keysHelper;
