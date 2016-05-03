class FakeWindow
  clearInterval: sinon.spy()
  setInterval: sinon.spy -> Math.random()
  localStorage:
    getItem: sinon.stub().returns('[]')
    setItem: sinon.stub()
  document:
    hidden: false


module.exports = FakeWindow
