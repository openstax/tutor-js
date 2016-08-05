_              = require 'underscore'
{expect}       = require 'chai'
React          = require 'react'
{Promise}      = require 'es6-promise'
{TimeActions}  = require '../../src/flux/time'
ReactAddons    = require 'react/addons'
ReactTestUtils = React.addons.TestUtils
{routerStub, commonActions} = require './helpers/utilities'

{CourseActions, CourseStore} = require '../../src/flux/course'
{ReferenceBookActions, ReferenceBookStore} = require '../../src/flux/reference-book'
{ReferenceBookPageActions, ReferenceBookPageStore} = require '../../src/flux/reference-book-page'
ReferenceBook = require '../../src/components/reference-book/reference-book'
Page = require '../../src/components/reference-book/page'

COURSE_ID = '1'
ECOSYSTEM_ID = '1'
COURSE = require '../../api/user/courses/1.json'
TOC  = require '../../api/ecosystems/1/readings.json'
FIRST_PAGE_ID = '0e58aa87-2e09-40a7-8bf3-269b2fa16509'
FIRST_PAGE  = '1.1'
SECOND_PAGE = '1.2'
SECOND_PAGE_ID = '0e58aa87-2e09-40a7-8bf3-269b2fa16510'
THIRD_PAGE  = '1.3'
THIRD_PAGE_ID = '0e58aa87-2e09-40a7-8bf3-269b2fa16511'

PAGE = require '../../api/pages/0e58aa87-2e09-40a7-8bf3-269b2fa16509.json'



ECO_ID = '3'
ECO_TOC  = require '../../api/ecosystems/3/readings.json'
ECO_PAGES = {}
ECO_PAGES['334f8b61-30eb-4475-8e05-5260a4866b4b@4.68'] = require '../../api/pages/334f8b61-30eb-4475-8e05-5260a4866b4b@4.68.json'
ECO_PAGES['d419f72d-3349-4449-ab34-c705409df4aa@5'] = require '../../api/pages/d419f72d-3349-4449-ab34-c705409df4aa@5.json'
ECO_PAGES['17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12'] = require '../../api/pages/17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12.json'
ECO_FIRST_PAGE = '1'
ECO_SECOND_PAGE = '1.1'
ECO_SECOND_PAGE_ID = 'd419f72d-3349-4449-ab34-c705409df4aa@5'

TOCS =
  '1': TOC,
  '3': ECO_TOC


renderBook = (section, ecosystemId) ->
  ecosystemId ?= CourseStore.get(COURSE_ID)?.ecosystem_id

  new Promise (resolve, reject) ->
    url = "/books/#{COURSE_ID}"
    url += "/section/#{section}" if section
    url += "?ecosystemId=#{ecosystemId}" if ecosystemId isnt CourseStore.get(COURSE_ID)?.ecosystem_id

    routerStub.goTo(url).then( (result) ->
      resolve(_.extend({
        book: ReactTestUtils.findRenderedComponentWithType(result.component, ReferenceBook)
      }, result))
    , (err) ->
      console.err err
    )

describe 'Reference Book Component', ->

  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)
    ReferenceBookActions.loaded(TOC, ECOSYSTEM_ID)
    ReferenceBookPageActions.loaded(PAGE, FIRST_PAGE_ID)
    renderBook(FIRST_PAGE).then (state) =>
      @state = state

  it 'renders the section title on the navbar',  ->
    expect(@state.div.querySelector('.section-title').textContent)
      .to.match(/1\.1/)

  it 'renders page html', ->
    expect(@state.div.querySelector('.page').textContent)
      .to.equal('A bunch of html')

  it 'toggles menu when navbar control is clicked', ->
    toggle = @state.div.querySelector('.menu-toggle')

    expect(_.toArray(@state.div.querySelector('.reference-book').classList))
      .to.contain('menu-open')

    commonActions.click(toggle)
    expect(_.toArray(@state.div.querySelector('.reference-book').classList))
      .to.not.contain('menu-open')

    commonActions.click(toggle)
    expect(_.toArray(@state.div.querySelector('.reference-book').classList))
      .to.contain('menu-open')

  it 'navigates forward and back between pages', ->
    prevControl = @state.div.querySelector('.page-navigation.prev')
    expect(prevControl).to.not.exist # on first page

    nextControl = @state.div.querySelector('.page-navigation.next')
    expect(nextControl).to.exist
    expect(nextControl.href).to.contain(SECOND_PAGE)
    page = ReactTestUtils.findRenderedComponentWithType(@state.book, Page)

    ReferenceBookPageActions.loaded(PAGE, SECOND_PAGE_ID)
    # button:0 is a mystery argument needed by ReactRouter, taken from their specs
    commonActions.click(nextControl, {button: 0})

    expect(page.context.router.getCurrentParams().section)
      .to.equal(SECOND_PAGE)

    expect(@state.div.querySelector('.page-navigation.next').href)
      .to.contain(THIRD_PAGE)

    expect(@state.div.querySelector('.page-navigation.prev').href)
      .to.contain(FIRST_PAGE)

  it 'preserves menu toggle when navigating forward and back between pages', ->
    toggle = @state.div.querySelector('.menu-toggle')
    nextControl = @state.div.querySelector('.page-navigation.next')

    page = ReactTestUtils.findRenderedComponentWithType(@state.book, Page)
    ReferenceBookPageActions.loaded(PAGE, SECOND_PAGE_ID)

    commonActions.click(toggle)
    expect(_.toArray(@state.div.querySelector('.reference-book').classList))
      .to.not.contain('menu-open')
    # button:0 is a mystery argument needed by ReactRouter, taken from their specs
    commonActions.click(nextControl, {button: 0})
    expect(_.toArray(@state.div.querySelector('.reference-book').classList))
      .to.not.contain('menu-open')

    ReferenceBookPageActions.loaded(PAGE, THIRD_PAGE_ID)
    commonActions.click(nextControl, {button: 0})
    expect(_.toArray(@state.div.querySelector('.reference-book').classList))
      .to.not.contain('menu-open')

    commonActions.click(toggle)
    expect(_.toArray(@state.div.querySelector('.reference-book').classList))
      .to.contain('menu-open')

    prevControl = @state.div.querySelector('.page-navigation.prev')
    commonActions.click(prevControl, {button: 0})
    expect(_.toArray(@state.div.querySelector('.reference-book').classList))
      .to.contain('menu-open')

  it 'sets the menu item to be active based on the current page', ->
    selection = @state.div.querySelector(".menu [data-section='#{FIRST_PAGE}'] a")
    expect(selection).not.to.be.null
    expect(_.toArray(selection.classList)).to.include('active')

  it 'closes TOC when using TOC to nav and window is small', (done) ->
    expect(_.toArray(@state.div.querySelector('.reference-book').classList))
      .to.contain('menu-open')

    nextSelection = @state.div.querySelector(".menu [data-section='#{SECOND_PAGE}'] a")
    ReferenceBookPageActions.loaded(PAGE, SECOND_PAGE_ID)

    commonActions.click(nextSelection)
    expect(_.toArray(@state.div.querySelector('.reference-book').classList))
      .to.not.contain('menu-open')
    done()


describe 'Reference Book Component for a non-default ecosystem', ->

  beforeEach ->
    CourseActions.loaded(COURSE, COURSE_ID)
    ReferenceBookActions.loaded(ECO_TOC, ECO_ID)
    _.each(ECO_PAGES, (page, cnx_id) ->
      ReferenceBookPageActions.loaded(page, cnx_id)
    )

    renderBook(ECO_FIRST_PAGE, ECO_ID).then (state) =>
      @state = state

  it 'renders the section title on the navbar',  ->
    expect(@state.div.querySelector('.section-title').textContent)
      .to.match(/1/)

  it 'sets the menu item to be active based on the current page', ->
    selection = @state.div.querySelector(".menu [data-section='#{ECO_FIRST_PAGE}'] a")
    expect(selection).not.to.be.null
    expect(_.toArray(selection.classList)).to.include('active')

  it 'navigates forward and back between pages, maintaining ecosystem id', ->
    prevControl = @state.div.querySelector('.page-navigation.prev')
    expect(prevControl).to.not.exist # on first page

    nextControl = @state.div.querySelector('.page-navigation.next')
    expect(nextControl).to.exist
    expect(nextControl.href).to.contain(ECO_SECOND_PAGE)
    page = ReactTestUtils.findRenderedComponentWithType(@state.book, Page)

    ReferenceBookPageActions.loaded(ECO_PAGES[ECO_SECOND_PAGE_ID], ECO_SECOND_PAGE_ID)
    # button:0 is a mystery argument needed by ReactRouter, taken from their specs
    commonActions.click(nextControl, {button: 0})

    expect(page.context.router.getCurrentParams().section)
      .to.equal(ECO_SECOND_PAGE)

    expect(page.context.router.getCurrentQuery())
      .to.have.property('ecosystemId').and.equal(ECO_ID)

    expect(@state.div.querySelector('.page-navigation.next').href)
      .to.contain("?ecosystemId=#{ECO_ID}")

    expect(@state.div.querySelector('.page-navigation.prev').href)
      .to.contain("?ecosystemId=#{ECO_ID}")

  it 'keeps ecosystem id in table of contents links', ->
    tocLinks = _.toArray(@state.div.querySelectorAll('.menu a'))
    linkAddresses = _.pluck(tocLinks, 'href')

    _.each(linkAddresses, (linkAddress) ->
      expect(linkAddress).to.contain("?ecosystemId=#{ECO_ID}")
    )
