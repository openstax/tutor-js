HtmlVideo = require 'helpers/html-videos'

describe 'Html Video Helper', ->
  it 'can wrap an html video frame in a div', ->
    dom = document.createElement('div')
    html = """<iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
    frameborder="0" allowfullscreen></iframe>"""

    dom.innerHTML = html
    dom = HtmlVideo.wrapFrames(dom)
    expect(dom.getElementsByClassName('embed-responsive').length).to.equal(1)

  it 'can wrap multiple html videos frame each in a div', ->
    dom = document.createElement('div')
    html = """<iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
    frameborder="0" allowfullscreen></iframe>
    <iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
    frameborder="0" allowfullscreen></iframe>"""

    dom.innerHTML = html
    dom = HtmlVideo.wrapFrames(dom)
    expect(dom.getElementsByClassName('embed-responsive').length).to.equal(2)

  it 'can will not wrap frames if a wrapper already exists', ->
    dom = document.createElement('div')
    html = """<div class="frame-wrapper embed-responsive">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
    frameborder="0" allowfullscreen></iframe></div>"""

    dom.innerHTML = html
    dom = HtmlVideo.wrapFrames(dom)
    expect(dom.getElementsByClassName('embed-responsive').length).to.equal(1)

  it 'can add responsive embed classes with correct aspect ratio', ->
    dom = document.createElement('div')

    html = """<iframe width="560" height="315" src="https://www.youtube.com/embed/BINK6r1Wy78"
    frameborder="0" allowfullscreen></iframe>"""
    dom.innerHTML = html
    dom = HtmlVideo.wrapFrames(dom)
    expect(dom.getElementsByClassName('embed-responsive-16by9').length).to.equal(1)

    html = """<iframe width="560" height="420" src="https://www.youtube.com/embed/BINK6r1Wy78"
    frameborder="0" allowfullscreen></iframe>"""
    dom.innerHTML = html
    dom = HtmlVideo.wrapFrames(dom)
    expect(dom.getElementsByClassName('embed-responsive-4by3').length).to.equal(1)
