{Testing, expect, sinon, _} = require 'openstax-react-components/test/helpers'

User = require 'user/model'

describe 'User', ->


  it 'defaults to not logged in', ->
    expect(User.isLoggedIn()).to.be.false

  it 'resets courses when destroy is called and can no longer emit signals', ->
    fakeCourse =
      destroy: -> true
    sinon.stub(fakeCourse, 'destroy')
    User.courses = [fakeCourse]
    logoutSpy = sinon.spy()
    User.channel.on 'logout.received', logoutSpy
    User.destroy()
    expect(User.courses).to.be.empty
    expect(fakeCourse.destroy).to.have.been.called
    expect(logoutSpy).not.to.have.been.called

    User._signalLogoutCompleted()
    expect(logoutSpy).to.have.not.been.called
