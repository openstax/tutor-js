# Generate a set of 2 random characters
# Shorter is good for views that add '...' when not enough room (like calendar)
module.exports = ->
  '_S_' + Math.random().toString(36).substr(2, 3)
