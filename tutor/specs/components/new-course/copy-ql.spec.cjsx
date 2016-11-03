{React} = require '../helpers/component-testing'

CopyQL = require '../../../src/components/new-course/copy-ql'

{NewCourseStore, NewCourseActions} = require '../../../src/flux/new-course'

describe 'CreateCourse: choosing to copy QL', ->

  it 'it does not display unless cloning', ->
    expect(CopyQL.shouldSkip()).to.be.true
    NewCourseActions.set(cloned_from_id: 22)
    expect(CopyQL.shouldSkip()).to.be.false
    undefined

  it 'sets flux values', ->
    wrapper = shallow(<CopyQL />)
    wrapper.find('tr.true').simulate('click')
    expect(NewCourseStore.get('copy_question_library')).to.equal('true')
    wrapper.find('tr.false').simulate('click')
    expect(NewCourseStore.get('copy_question_library')).to.equal('false')
    undefined
