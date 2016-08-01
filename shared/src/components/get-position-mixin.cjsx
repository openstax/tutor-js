module.exports =
  getTopPosition: (el) ->
    el.getBoundingClientRect().top - document.body.getBoundingClientRect().top
