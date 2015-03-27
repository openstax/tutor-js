{expect} = require 'chai'

{TeacherTaskPlanStore, TeacherTaskPlanActions} = require '../src/flux/teacher-task-plan'

describe 'Teacher Task Plan Store', ->
  afterEach ->
    TeacherTaskPlanActions.reset()

  it 'should load tasks for a course and notify', (done)->
    calledSynchronously = false
    TeacherTaskPlanStore.addChangeListener ->
      calledSynchronously = true
      calledSynchronously and done()
    TeacherTaskPlanActions.loaded({items:[{hello:'world', steps:[]}]}, 123)
    # Verify the taskPlanLoader unwraps the returned JSON and stores the items
    expect(TeacherTaskPlanStore.get(123)[0].hello).to.equal('world')
