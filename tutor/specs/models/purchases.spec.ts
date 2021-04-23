import { Purchase, PurchasesMap } from '../../src/models'

describe('Purchases', () => {
    let purchases: PurchasesMap;

    beforeEach(() => {
        purchases = new PurchasesMap();
        purchases.mergeModelData([{
            identifier: '1234abcd',
            total: 12.82,
            product: { name: 'Foo' },
        }])
    });

    test('#get', () => {
        expect(purchases.get('1234abcd')).toBeInstanceOf(Purchase);
    });

    test('#withRefunds', () => {
        expect(purchases.withRefunds).toHaveLength(1);
    });

});
