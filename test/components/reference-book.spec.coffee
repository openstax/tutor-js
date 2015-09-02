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
PHYSICS_TOC  = require '../../api/ecosystems/3/readings.json'

TOCS =
  '1': TOC,
  '3': PHYSICS_TOC

PAGES = {}
PAGES['334f8b61-30eb-4475-8e05-5260a4866b4b@4.68'] = require '../../api/pages/334f8b61-30eb-4475-8e05-5260a4866b4b@4.68.json'
PAGES['d419f72d-3349-4449-ab34-c705409df4aa@5'] = require '../../api/pages/d419f72d-3349-4449-ab34-c705409df4aa@5.json'
PAGES['17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12'] = require '../../api/pages/17f6ff53-2d92-4669-acdd-9a958ea7fd0a@12.json'

console.info(PAGES)

FIRST_PAGE_ID = '0e58aa87-2e09-40a7-8bf3-269b2fa16509'
FIRST_PAGE  = '1.1'
SECOND_PAGE = '1.2'
SECOND_PAGE_ID = '0e58aa87-2e09-40a7-8bf3-269b2fa16510'
THIRD_PAGE  = '1.3'

PAGE = require '../../api/pages/0e58aa87-2e09-40a7-8bf3-269b2fa16509.json'


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

  it 'sets current page to active on menu', ->
    page = ReferenceBookActions.loaded(TOC, ECOSYSTEM_ID)
    console.log page
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
    prevControl = @state.div.querySelector('.page-wrapper > .prev')
    expect(prevControl).to.not.exist # on first page

    nextControl = @state.div.querySelector('.page-wrapper > .next')
    expect(nextControl).to.exist
    expect(nextControl.href).to.contain(SECOND_PAGE)
    page = ReactTestUtils.findRenderedComponentWithType(@state.book, Page)

    ReferenceBookPageActions.loaded(PAGE, SECOND_PAGE_ID)
    # button:0 is a mystery argument needed by ReactRouter, taken from their specs
    commonActions.click(nextControl, {button: 0})

    expect(page.context.router.getCurrentParams().section)
      .to.equal(SECOND_PAGE)

    expect(@state.div.querySelector('.page-wrapper > .next').href)
      .to.contain(THIRD_PAGE)

    expect(@state.div.querySelector('.page-wrapper > .prev').href)
      .to.contain(FIRST_PAGE)


  it 'sets the menu item to be active based on the current page', ->
    selection = @state.div.querySelector(".toc [data-section='#{FIRST_PAGE}'] a")
    expect(selection).not.to.be.null
    expect(_.toArray(selection.classList)).to.include('active')
