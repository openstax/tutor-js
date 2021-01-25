// credit to https://github.com/jayphelps/core-decorators/blob/master/src/lazy-initialize.js
export default function lazy(target: object, key: string, descriptor: any) {
    const { get } = descriptor
    console.log(key)
    descriptor.get = () => {
        const value = get.apply(target)
        Object.defineProperty(target, key, { value })
    }
    // Object.defineProperty(target, key, {
    //     configurable: true,
    //     enumerable: true
    //     writable: false,
    //     get() {
    //         const
    //             Object.defineProperty(target, key, {
    //                 configurable: true,
    //                 enumerable: true
    //             writable: false,

    //             }
    // });



    // //    console.log(target, key, descriptor)

    // // const configurable = descriptor.configurable,
    // //     initializer = descriptor.initializer,
    // value = descriptor.value;

    // Object.defineProperty(target,){
    //     configurable,
    //         enumerable: false,

    //             get() {
    //         // This happens if someone accesses the
    //         // property directly on the prototype
    //         if (this === target) {
    //             return null;
    //         }

    //         const ret = initializer ? initializer.call(this) : value;

    //         Object.defineProperty(this, key, {
    //             configurable,
    //             enumerable: false,
    //             writable: false,
    //             value: ret,
    //         });

    //         return ret;
    //     },

    // };
}
