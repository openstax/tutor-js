import { ModelLoader } from '../../src/models';
import { deferred } from '../helpers';

jest.useFakeTimers();

class TestModel {
    fetch = jest.fn(() => Promise.resolve());
}


describe('Model Loader', () => {
    let model: TestModel;
    let loader: ModelLoader;

    beforeEach(() => {
        model = new TestModel();
        loader = new ModelLoader({ model });
    });

    it('fetches immediately', () => {
        const props = { foo: 'bar' };
        const fetcher = new ModelLoader({ model, fetch: props });

        expect(model.fetch).toHaveBeenCalledWith(props);
        expect(fetcher.isLoading(props)).toBeTruthy();
    });

    it('will not load when load is in progress', () => {
        expect(model.fetch).toHaveBeenCalledTimes(0);
        const args = { one: 1, two: 2 };
        loader.fetch(args);
        expect(model.fetch).toHaveBeenCalledTimes(1);
        loader.fetch(args);
        expect(model.fetch).toHaveBeenCalledTimes(1);
    });

    it('will reload once complete', () => {
        expect(model.fetch).toHaveBeenCalledTimes(0);
        const args = { one: 1, two: 2 };
        loader.fetch(args);
        jest.runAllTimers();
        return deferred(() => {
            expect(model.fetch).toHaveBeenCalledTimes(1);
            expect(loader.isLoading(args)).toBeFalsy();
            expect(loader.hasLoaded(args)).toBeTruthy();
            expect(model.fetch).toHaveBeenCalledTimes(1);
            loader.fetch(args, { reload: true });
            expect(model.fetch).toHaveBeenCalledTimes(2);
        });


    });

});
