# Possible formats = [
#   'matching'
#   'multiple-choice'
#   'multiple-select'
#   'short-answer'
#   'true-false'
#   'fill-in-the-blank'
# ]

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
          formats: ['short-answer']
          stem: 'What is the rest mass in kg?'
          answers: [
            { value: '{{ ship_mass }}' }
          ]
        }
        {
          formats: ['multiple-choice', 'short-answer']
          stem: 'What is the force if it slams into a wall?'
          short_stem: 'Enter your answer in N'
          answers: [
            { id: 'id1', value: '{{ ship_force }}',          content: '{{ ship_force }} N' }
            { id: 'id2', value: '{{ ship_mass }}', content: '{{ ship_mass }} N', hint: 'Remember 1 Newton (N) is 1 kg*m/s' }
          ]
          # This would be populated by Tutor
          correct: 'id1'
        }
        {
          formats: ['multiple-select', 'multiple-choice', 'short-answer']
          stem: 'What is the force if it slams into a wall? (this has (a) and (b) options)'
          short_stem: 'Enter your answer in N'
          answers: [
            { id: 'wrong', value: '0' }
            { id: 'wrong2', value: '1' }
            { id: 'id123', value: '{{ ship_force }}',  content: '{{ ship_force }} N' }
            { id: 'id456', value: '0{{ ship_force }}', content: '{{ ship_force }} + 0 <br/> + 0 <br/> + 0 N' }
            { value: ['id456', 'id123'] }
          ]
          # This would be populated by Tutor
          correct: ['id123', 'id456']
        }
      ]
    }
    # Fill in the blanks
    {
      background: 'Simple fill-in-the-blank questions'
      questions: [
        {
          formats: ['fill-in-the-blank', 'true-false', 'multiple-choice']
          stem: 'If the ship is traveling {{ ship_speed }} m/s and slams into a wall, the impact force is ____ N.'
          answers: [
            { value: '{{ ship_force }}' }
            { value: '{{ ship_mass_div_speed }}', hint: 'Remember 1 Newton (N) is 1 kg*m/s' }
          ]
          correct: '{{ ship_force }}'
        }
        {
          formats: ['fill-in-the-blank', 'true-false']
          stem: 'Photosynthesis ____ ATP'
          answers: [
            { value: 'creates' }
            { value: 'smells like' }
          ]
          correct: 'creates'
        }
      ]
    }
    {
      background: 'Matching question (for draw-a-line-to-match)'
      questions: [
        {
          formats: ['matching']
          stem: 'Match the words on the left with words on the right by drawing a line'
          items: ['foot', 'head', 'hand']
          answers: [
            { credit: 1, value: 'sock' }
            { credit: 1, value: 'hat'}
            { credit: 1, value: 'glove'}
            { credit: 0, value: 'rocket ship'}
          ]
        }
      ]
    } # End part

    {
      background: 'These questions have aleady been answered by the student and are meant to test that the Exercise knows not to render radio buttons, input boxes, etc'
      questions: [
        {
          formats: ['short-answer']
          stem: 'What is 2+2?'
          answer: '42'
        }
        {
          formats: ['fill-in-the-blank']
          stem: '2+2 is ____'
          answer: '0'
          correct: '4'
        }
        {
          formats: ['multiple-choice']
          stem: 'What is 2+2?'
          answers: [
            {id: 'id1', value: '4'}
            {id: 'id2', value: '42'}
          ]
          correct: 'id1'
          answer: 'id1'
        }

      ]
    }
    # {
    #   background: '''Fill in this table (this is a multi-fill-in-the-blank):
    #
    #     <table>
    #       <tr><th>Time</th><th>Distance</th><th>Velocity</th></tr>
    #       <tr><td>t<sub>0</sub></td><td>____1</td><td>____2</td></tr>
    #       <tr><td>t<sub>1</sub></td><td>____3</td><td>____4</td></tr>
    #       <tr><td>t<sub>2</sub></td><td>____5</td><td>____6</td></tr>
    #     </table>
    #   '''
    #   questions: [
    #     { answers: [{ credit: 1, value: 0 }] }
    #     { answers: [{ credit: 1, value: -1, content: '{{ ship_mass }}' }] }
    #     { answers: [{ credit: 1, value: '{{ ship_force }}' }] }
    #     { answers: [{ credit: 1, value: 10, content: '{{ ship_speed }}' }] }
    #     { answers: [{ credit: 1, value: 100, content: '{{ ship_force }}' }] }
    #     { answers: [{ credit: 1, value: 1000, content: '{{ ship_mass_grams }}' }] }
    #   ]
    # }
  ]
