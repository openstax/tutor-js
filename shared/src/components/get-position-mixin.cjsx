module.exports =
  getTopPosition: (el) ->
    return 0 unless el
    el.getBoundingClientRect().top - document.body.getBoundingClientRect().top
