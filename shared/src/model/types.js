import { registerCustomType } from 'mobx-decorated-models';
import Big from 'big.js';

registerCustomType('bignum', {
    serialize(num) { (num instanceof(Big)) ? num.toJSON() : num; },
    deserialize(num) { return new Big(num); },
});
