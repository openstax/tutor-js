import { expect } from 'chai';

import { CrudConfig, makeSimpleStore, extendConfig } from '../src/flux/helpers';

const TestCrudConfig = CrudConfig();
const { actions: CrudActions, store: CrudStore } = makeSimpleStore(TestCrudConfig);


const ExtendedConfig = {
  _loaded(obj, id) {
    if (!obj.doNotModify) { return { nested: obj }; }
  },

  _saved(obj, id) {
    if (!obj.doNotModify) { return { nested: obj }; }
  },

  exports: {
    testExtendedStore() { return console.log('crud-store testing'); },
  },
};

extendConfig(ExtendedConfig, new CrudConfig());
const { actions: ExtendedActions, store: ExtendedStore } = makeSimpleStore(ExtendedConfig);


describe('CRUD Store', function() {
  afterEach(() => CrudActions.reset());

  it('should clear the store', function() {
    const id = 0;
    expect(CrudStore.isUnknown(id)).to.be.true;
    CrudActions.loaded({ hello: 'foo', steps: [] }, id);
    expect(CrudStore.isUnknown(id)).to.be.false;
    CrudActions.reset();
    expect(CrudStore.isUnknown(id)).to.be.true;
    return undefined;
  });

  it('should load a task and notify', function(done) {
    let calledSynchronously = false;
    CrudStore.addChangeListener(function() {
      calledSynchronously = true;
      return calledSynchronously && done();
    });
    CrudActions.loaded({ hello: 'world', steps: [] }, 123);
    expect(CrudStore.get(123).hello).to.equal('world');
    return undefined;
  });

  it('should load a task through the happy path', function() {
    const id = 0;
    expect(CrudStore.isUnknown(id)).to.be.true;
    expect(CrudStore.isLoaded(id)).to.be.false;
    expect(CrudStore.isLoading(id)).to.be.false;
    expect(CrudStore.isFailed(id)).to.be.false;

    CrudActions.load(id);

    expect(CrudStore.isUnknown(id)).to.be.false;
    expect(CrudStore.isLoaded(id)).to.be.false;
    expect(CrudStore.isLoading(id)).to.be.true;
    expect(CrudStore.isFailed(id)).to.be.false;

    CrudActions.loaded({ hello: 'bar', steps: [] }, id);

    expect(CrudStore.isUnknown(id)).to.be.false;
    expect(CrudStore.isLoaded(id)).to.be.true;
    expect(CrudStore.isLoading(id)).to.be.false;
    expect(CrudStore.isFailed(id)).to.be.false;

    expect(CrudStore.get(id).hello).to.equal('bar');
    return undefined;
  });

  it('should note when a load failed', function() {
    const id = 0;
    expect(CrudStore.isUnknown(id)).to.be.true;
    expect(CrudStore.isLoaded(id)).to.be.false;
    expect(CrudStore.isLoading(id)).to.be.false;
    expect(CrudStore.isFailed(id)).to.be.false;

    CrudActions.load(id);

    expect(CrudStore.isUnknown(id)).to.be.false;
    expect(CrudStore.isLoaded(id)).to.be.false;
    expect(CrudStore.isLoading(id)).to.be.true;
    expect(CrudStore.isFailed(id)).to.be.false;

    CrudActions.FAILED(404, { err: 'message' }, id);

    expect(CrudStore.isUnknown(id)).to.be.false;
    expect(CrudStore.isLoaded(id)).to.be.false;
    expect(CrudStore.isLoading(id)).to.be.false;
    expect(CrudStore.isFailed(id)).to.be.true;
    return undefined;
  });

  it('should store changed attributes locally', function() {
    const id = 0;
    CrudActions.loaded({ hello: 'bar' }, id);
    expect(CrudStore.isChanged(id)).to.be.false;

    CrudActions._change(id, { foo: 'baz' });
    expect(CrudStore.isChanged(id)).to.be.true;
    expect(CrudStore.get(id)).to.deep.equal({ hello: 'bar', foo: 'baz' });
    expect(CrudStore.getChanged(id)).to.deep.equal({ foo: 'baz' });

    CrudActions._change(id, { hello: 'bam' });
    expect(CrudStore.get(id)).to.deep.equal({ hello: 'bam', foo: 'baz' });
    expect(CrudStore.getChanged(id)).to.deep.equal({ foo: 'baz', hello: 'bam' });
    return undefined;
  });

  it('should clear changed attributes when saved', function() {
    const id = 0;
    CrudActions.loaded({ hello: 'bar' }, id);
    CrudActions._change(id, { foo: 'baz' });
    CrudActions.saved({ afterSave: true }, id);
    expect(CrudStore.isChanged(id)).to.be.false;
    expect(CrudStore.get(id)).to.deep.equal({ afterSave: true });
    return undefined;
  });

  it('should clear changed attributes locally when clearChanged()', function() {
    const id = 0;
    CrudActions.loaded({ hello: 'bar' }, id);
    CrudActions._change(id, { foo: 'baz' });
    CrudActions.clearChanged(id);
    expect(CrudStore.get(id)).to.deep.equal({ hello: 'bar' });
    expect(CrudStore.getChanged(id)).to.deep.equal({});
    return undefined;
  });

  it('should be loaded when a new item is created', function() {
    const id = CrudStore.freshLocalId();
    CrudActions.create(id, { hello: 'bar' });
    expect(CrudStore.isLoaded(id)).to.be.true;
    return undefined;
  });

  it('should have additional actions if the config has been extended', function() {
    expect(ExtendedActions._loaded).to.be.a('function');
    return undefined;
  });

  it('should additional store functions if the config has been extended', function() {
    expect(ExtendedStore.testExtendedStore).to.be.a('function');
    return undefined;
  });

  it('should not change what is loaded if _loaded function is undefined', function() {
    const id = 0;
    const storeObj = { hello: 'bar' };
    CrudActions.loaded(storeObj, id);
    expect(CrudActions._loaded).to.be.undefined;
    expect(CrudStore.get(id)).to.deep.equal(storeObj);
    return undefined;
  });

  it('should change what is loaded if _loaded function is defined and returns', function() {
    const id = 0;
    const nestedStore = { hello: 'bar' };
    ExtendedActions.loaded(nestedStore, id);
    expect(ExtendedConfig._loaded(nestedStore, id)).to.not.be.undefined;
    expect(ExtendedStore.get(id).nested).to.deep.equal(nestedStore);
    return undefined;
  });

  it('should not change what is loaded if _loaded function returns falsy', function() {
    const id = 0;
    const storeObj = { hello: 'bar', doNotModify: true };
    ExtendedActions.loaded(storeObj, id);
    expect(ExtendedConfig._loaded(storeObj, id)).to.be.undefined;
    expect(ExtendedStore.get(id)).to.deep.equal(storeObj);
    return undefined;
  });

  it('should not change what is saved if _saved function is undefined', function() {
    const id = 0;
    const storeObj = { hello: 'bar' };
    CrudActions.saved(storeObj, id);
    expect(CrudActions._saved).to.be.undefined;
    expect(CrudStore.get(id)).to.deep.equal(storeObj);
    return undefined;
  });

  it('should change what is saved if _saved function is defined and returns', function() {
    const id = 0;
    const nestedStore = { hello: 'bar' };
    ExtendedActions.saved(nestedStore, id);
    expect(ExtendedConfig._saved(nestedStore, id)).to.not.be.undefined;
    expect(ExtendedStore.get(id).nested).to.deep.equal(nestedStore);
    return undefined;
  });

  return it('should not change what is saved if _saved function returns falsy', function() {
    const id = 0;
    const storeObj = { hello: 'bar', doNotModify: true };
    ExtendedActions.saved(storeObj, id);
    expect(ExtendedConfig._saved(storeObj, id)).to.be.undefined;
    expect(ExtendedStore.get(id)).to.deep.equal(storeObj);
    return undefined;
  });
});
