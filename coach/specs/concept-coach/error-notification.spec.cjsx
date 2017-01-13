{Testing, sinon, _, React, ReactTestUtils} = require 'shared/specs/helpers'

jest.mock '../../src/navigation/model'

ErrorNotification = require 'concept-coach/error-notification'

TASK  = require '../../api/cc/tasks/C_UUID/m_uuid/GET'
tasks = require 'task/collection'
api   = require 'api'
cloneDeep = require 'lodash/cloneDeep'

Course = require 'course/model'
AUTH_DATA = require '../../auth/status/GET'

ERROR =
  response:
    status: 500
    statusText: 'Its On Fire!'
    data:
      errors: [ {code: 'test_test_test'} ]

Navigation = null

describe 'CC Error Notification Component', ->
  beforeEach ->
    Navigation = require '../../src/navigation/model'
    @props =
      course: new Course(_.first(AUTH_DATA.courses))
      close: sinon.spy()
      moduleUUID: 'm_uuid'
      collectionUUID: 'C_UUID'
    tasks.load("#{@props.collectionUUID}/#{@props.moduleUUID}",  TASK)

  it "doesn't render by default", ->
    wrapper = shallow(<ErrorNotification {...@props} />)
    expect(wrapper.html()).to.be.null
    undefined

  it 'renders exceptions', ->
    wrapper = shallow(<ErrorNotification {...@props} />)
    msg = 'undefined var foo used in bar'
    api.channel.emit('error', new Error(msg))
    expect(wrapper.find('ModalBody').render().text()).to.include("Error: #{msg}")
    undefined

  it 'shows error details by default', ->
    wrapper = shallow(<ErrorNotification {...@props} />)
    comp = wrapper.instance()
    sinon.stub(comp, 'onHide')
    api.channel.emit('error', ERROR)
    expect(wrapper.find('ModalTitle').render().text()).to.equal('Server Error encountered')
    expect(wrapper.find('ModalBody').render().text()).to.include('test_test_test')
    wrapper.find('ModalFooter Button').simulate('click')
    expect(comp.onHide).to.have.been.called
    undefined

  it 'renders course not started', ->
    wrapper = shallow(<ErrorNotification {...@props} />)
    error = cloneDeep(ERROR)
    error.response.data.errors[0].code = 'course_not_started'
    api.channel.emit('error', error)
    expect(wrapper.find('ModalTitle').render().text()).to.equal('Future Course')
    expect(wrapper.find('ModalBody').render().text()).to.include('not yet started')
    wrapper.find('ModalFooter Button').simulate('click')
    expect(@props.close).to.have.been.called
    undefined

  it 'renders course has ended', ->
    wrapper = shallow(<ErrorNotification {...@props} />)
    error = cloneDeep(ERROR)
    error.response.data.errors[0].code = 'course_ended'
    api.channel.emit('error', error)
    expect(wrapper.find('ModalTitle').render().text()).to.equal('Past Course')
    expect(wrapper.find('ModalBody').render().text()).to.include('course ended')
    wrapper.find('ModalFooter Button').simulate('click')
    expect(Navigation.channel.emit).toHaveBeenCalledWith('show.progress', view: 'progress')
    undefined
