module.exports =
  logic:
    inputs:
      scale: { start: 1, end: 3 }
      mass:  { start: 1, end: 3 }
      speed: { start: 1, end: 3 }
    outputs:
      ship_mass: ({scale, mass, speed}) -> scale * Math.pow(100, mass)
      ship_speed: ({scale, mass, speed}) -> scale * Math.pow(10, speed)
      ship_force: ({scale, mass, speed}) -> scale * Math.pow(100, mass) * scale * Math.pow(10, speed)
      ship_mass_grams: ({scale, mass, speed}) -> scale * Math.pow(100, mass) * 1000
      ship_mass_div_speed: ({scale, mass, speed}) -> scale * Math.pow(100, mass) / scale * Math.pow(10, speed)

  background: 'This exercise has many parts. Each one is a different type of question. Einstein makes a {{ ship_mass }} kg spaceship'
  parts: [
    {
      background: 'The spaceship moves at {{ ship_speed }} m/s'
      questions: [
        {
          stem: 'What is the rest mass? (Short answer)'
          short_stem: 'Enter your answer in kg'
          answers: [
            { credit: 1, value: '{{ ship_mass }}' }
          ]
        }
        {
          stem: 'What is the rest mass?'
          short_stem: 'Enter your answer in kg'
          answers: [
            { credit: 1, value: '{{ ship_mass }}' }
            { credit: 0, value: '{{ ship_mass_grams }}', hint: 'Check the units' }
          ]
        }
        {
          stem: 'What is the force if it slams into a wall?'
          short_stem: 'Enter your answer in N'
          answers: [
            { credit: 1, value: '{{ ship_force }}',          content: '{{ ship_force }} N' }
            { credit: 0, value: '{{ ship_mass_div_speed }}', content: '{{ ship_mass_div_speed }} N', hint: 'Remember 1 Newton (N) is 1 kg*m/s' }
          ]
        }
      ]
    }
    # Fill in the blanks
    {
      background: 'Simple fill-in-the-blank questions'
      questions: [
        { stem: 'Photosynthesis ____ ATP', answers: [{ credit: 1, value: 'creates' }] }
      ]
    }
    {
      background: '''Fill in this table (this is a multi-fill-in-the-blank):

        <table>
          <tr><th>Time</th><th>Distance</th><th>Velocity</th></tr>
          <tr><td>t<sub>0</sub></td><td>____1</td><td>____2</td></tr>
          <tr><td>t<sub>1</sub></td><td>____3</td><td>____4</td></tr>
          <tr><td>t<sub>2</sub></td><td>____5</td><td>____6</td></tr>
        </table>
      '''
      questions: [
        { answers: [{ credit: 1, value: 0 }] }
        { answers: [{ credit: 1, value: -1, content: '{{ ship_mass }}' }] }
        { answers: [{ credit: 1, value: '{{ ship_force }}' }] }
        { answers: [{ credit: 1, value: 10, content: '{{ ship_speed }}' }] }
        { answers: [{ credit: 1, value: 100, content: '{{ ship_force }}' }] }
        { answers: [{ credit: 1, value: 1000, content: '{{ ship_mass_grams }}' }] }
      ]
    }
  ]
