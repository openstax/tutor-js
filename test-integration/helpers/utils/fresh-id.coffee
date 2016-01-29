# Generate a set of 2 random characters
# Shorter is good for views that add '...' when not enough room (like calendar)
module.exports = ->
  '_SE ' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 2)
