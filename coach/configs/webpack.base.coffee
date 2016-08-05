module.exports =
  output:
    libraryTarget: 'umd'
    library: 'OpenStaxConceptCoach'
    umdNamedDefine: true
  plugins: [
    # Pass the BASE_URL along
    new webpack.EnvironmentPlugin( 'BASE_URL' )
  ]
