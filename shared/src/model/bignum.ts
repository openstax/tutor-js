import Big from 'big.js';
import { readonly } from 'core-decorators'

export default class Bignum extends Big {

    @readonly static unknown = new Bignum('0')

    static hydrate(numThing: any) {
        return new Bignum(numThing)
    }

    get isUnknown() {
        return this === Bignum.unknown
    }

    serialize() {
        return this.toPrecision(2)
    }

}
