This directory contains React and `flex-react` components.

# tl;dr

- Synchronous state changes on objects **only** occur in the Store
- Async AJAX transitions are handled by the `API` (`./api.coffee`)
- React has no knowledge and just renders the state of the Store.


# Description

Each Store (inside the <./flux> dir) exports a Store and a set of actions for manipulating the Store.

Synchronous state changes on objects **only** occur in the Store and components manipulate the Store indirectly by calling actions (ie `TaskActions.load(id)`).

The API layer provides async transitions by calling other actions.


# Happy-path Task fetching

To render a Task the following happens (assuming the Task has not been fetched yet):

1. React Task component is rendered with a "Loading Started..."
  - since `TaskStore.get(12)` returned null
1. React Task component fires a `TaskActions.load(12)`
  - API listens to the `TaskActions.load(12)` action and fires an AJAX call to get the Task JSON
  - Task Store listens to the `TaskActions.load(12)` action and sets the state to "loading"
    1. Task Store fires a change event
    1. React Task component listens to the change event and re-renders with "Loading..."
1. API's AJAX call resolves and calls the `TaskActions.loaded(12, {...})` action
  - Task Store listens to the `TaskActions.loaded(12, {...})` action and sets the state to loaded and remembers the task JSON
    1. Task Store fires a change event
    1. React Task component listens to the change event and re-renders with the entire task


# Error-path Task fetching

It is the same as Happy-path except the last step calls the `TaskActions.FAILED(12)` action.
