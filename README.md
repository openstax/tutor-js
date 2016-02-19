See it [here](https://openstax.github.io/concept-coach/).

# To run locally:

you need to have [tutor-server](https://github.com/openstax/tutor-server) running locally.  Then,

1. Clone this repo
1. `npm install`
1. `PORT=3004 gulp _webserver`
  * Replace with whatever port you'd like
1. In `tutor-server`'s `config/secrets.yml`, add `http://localhost:3004` to the list of `cc-origins`
  * Starts around line 20.
1. Restart the `tutor-server`
1. Go to `http://localhost:3004` and the Launch button for Concept Coach should be there!


# To build for release and deployment:

1. Run `npm release`
  * This will switch to gh-pages branch, merge master into it, and then build
1. Commit files and push to github gh-pages branch
1. Copy sha hash of commit into webview's `bower.json`
