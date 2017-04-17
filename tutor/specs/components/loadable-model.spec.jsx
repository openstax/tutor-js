import LoadableModel from '../../src/components/loadable-model';

import Task from '../../src/models/task';


describe('LoadableModel', () => {

  let task;
  let renderSpy;
  beforeEach(() => {
    task = new Task();
    task.fetch = jest.fn(() => task.apiRequestsInProgress.set('fetch',{}) );
    renderSpy = jest.fn(() => <span className="loaded"/>);
  });

  it('does not load and renders for new item', ()=> {
    expect(task.isNew).toBe(true);
    const loader = mount(<LoadableModel model={task} renderItem={renderSpy}/>);
    expect(loader).toHaveRendered('.loaded');
    expect(renderSpy).toHaveBeenCalled();
    expect(task.fetch).not.toHaveBeenCalled();
  });

  it('calls load for unfetched item', () => {
    task.id = 42;
    expect(task.isNew).toBe(false);
    const loader = mount(<LoadableModel model={task} renderItem={renderSpy}/>);
    expect(task.fetch).toHaveBeenCalled();
    expect(loader).not.toHaveRendered('.loaded');
    expect(renderSpy).not.toHaveBeenCalled();
    expect(loader).toHaveRendered('.loadable.is-loading');
  });

  it('renders when load completes', () => {
    task.id = 42;
    task.apiRequestsInProgress.set('fetch',{});
    const loader = mount(<LoadableModel model={task} renderItem={renderSpy}/>);
    expect(loader).toHaveRendered('.loadable.is-loading');
    task.apiRequestsInProgress.delete('fetch');
    expect(loader).toHaveRendered('.loaded');
    expect(loader).not.toHaveRendered('.loadable.is-loading');
  });

});
