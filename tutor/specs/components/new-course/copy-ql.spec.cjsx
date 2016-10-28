{React, shallow} = require '../helpers/component-testing'

CopyQL = require '../../../src/components/new-course/copy-ql'

{NewCourseStore, NewCourseActions} = require '../../../src/flux/new-course'

describe 'CreateCourse: choosing to copy QL', ->

  it 'it does not display unless cloning', ->
    expect(CopyQL.shouldSkip()).to.be.true
    NewCourseActions.set(source_course_id: 22)
    expect(CopyQL.shouldSkip()).to.be.false
    undefined

  it 'sets flux values', ->
    wrapper = shallow(<CopyQL />)
    wrapper.find('tr.fresh').simulate('click')
    expect(NewCourseStore.get('copy_ql')).to.equal('fresh')
    wrapper.find('tr.copy').simulate('click')
    expect(NewCourseStore.get('copy_ql')).to.equal('copy')
    undefined
