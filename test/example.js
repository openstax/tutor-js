window.config = {
  logic: {
    inputs: {
      scale: {
        start: 1,
        end: 3
      },
      mass: {
        start: 1,
        end: 3
      },
      speed: {
        start: 1,
        end: 3
      }
    },
    outputs: {
      ship_mass: function(_arg) {
        var mass, scale, speed;
        scale = _arg.scale, mass = _arg.mass, speed = _arg.speed;
        return scale * Math.pow(100, mass);
      },
      ship_speed: function(_arg) {
        var mass, scale, speed;
        scale = _arg.scale, mass = _arg.mass, speed = _arg.speed;
        return scale * Math.pow(10, speed);
      },
      ship_force: function(_arg) {
        var mass, scale, speed;
        scale = _arg.scale, mass = _arg.mass, speed = _arg.speed;
        return scale * Math.pow(100, mass) * scale * Math.pow(10, speed);
      },
      ship_mass_grams: function(_arg) {
        var mass, scale, speed;
        scale = _arg.scale, mass = _arg.mass, speed = _arg.speed;
        return scale * Math.pow(100, mass) * 1000;
      },
      ship_mass_div_speed: function(_arg) {
        var mass, scale, speed;
        scale = _arg.scale, mass = _arg.mass, speed = _arg.speed;
        return scale * Math.pow(100, mass) / scale * Math.pow(10, speed);
      }
    }
  },
  background: 'This exercise has many parts. Each one is a different type of question. Einstein makes a {{ ship_mass }} kg spaceship',
      questions: [
        {
          formats: ['short-answer'],
          background: 'The spaceship moves at <span data-math="{{ ship_speed }}">{{ ship_speed }}</span> m/s',
          stem: 'What is the rest mass in kg?',
          answers: [
            {
              content_html: '{{ ship_mass }}'
            }
          ]
        }, {
          formats: ['multiple-choice', 'multiple-select', 'short-answer'],
          stem: 'What is the force if it slams into a wall?',
          short_stem: 'Enter your answer in N',
          answers: [
            {
              id: 'id1',
              value: '{{ ship_force }}',
              content: '{{ ship_force }} N'
            }, {
              id: 'id2',
              value: '{{ ship_mass }}',
              content: '{{ ship_mass }} N',
              hint: 'Remember 1 Newton (N) is 1 kg*m/s'
            }
          ],
          correct: 'id1'
        }, {
          formats: ['multiple-select', 'multiple-choice', 'short-answer'],
          stem: 'What is the force if it slams into a wall? (this has (a) and (b) options)',
          short_stem: 'Enter your answer in N',
          answers: [
            {
              id: 'wrong',
              value: '0'
            }, {
              id: 'wrong2',
              value: '1'
            }, {
              id: 'id123',
              value: '{{ ship_force }}',
              content: '{{ ship_force }} N'
            }, {
              id: 'id456',
              value: '0{{ ship_force }}',
              content: '{{ ship_force }} + 0 <br/> + 0 <br/> + 0 N'
            }, {
              id: 'id567',
              value: ['id456', 'id123']
            }
          ],
          correct: 'id567'
        },
        {
          formats: ['fill-in-the-blank', 'true-false', 'multiple-choice'],
          background: 'Simple fill-in-the-blank questions',
          stem: 'If the ship is traveling {{ ship_speed }} m/s and slams into a wall, the impact force is ____ N.',
          answers: [
            {
              value: '{{ ship_force }}'
            }, {
              value: '{{ ship_mass_div_speed }}',
              hint: 'Remember 1 Newton (N) is 1 kg*m/s'
            }
          ],
          correct: '{{ ship_force }}'
        }, {
          formats: ['fill-in-the-blank', 'true-false'],
          stem: 'Photosynthesis ____ ATP',
          answers: [
            {
              value: 'creates'
            }, {
              value: 'smells like'
            }
          ],
          correct: 'creates'
        },
        {
          formats: ['matching'],
          background: 'Matching question (for draw-a-line-to-match)',
          stem: 'Match the words on the left with words on the right by drawing a line',
          items: ['foot', 'head', 'hand'],
          answers: [
            {
              credit: 1,
              value: 'sock'
            }, {
              credit: 1,
              value: 'hat'
            }, {
              credit: 1,
              value: 'glove'
            }, {
              credit: 0,
              value: 'rocket ship'
            }
          ]
        },
        {
          formats: ['short-answer'],
          background: 'These questions have aleady been answered by the student and are meant to test that the Exercise knows not to render radio buttons, input boxes, etc',
          stem: 'What is 2+2?',
          answer: '42'
        }, {
          formats: ['fill-in-the-blank'],
          stem: '2+2 is ____',
          answer: '0',
          correct: '4'
        }, {
          formats: ['multiple-choice'],
          stem: 'What is 2+2?',
          answers: [
            {
              id: 'id1',
              value: '4'
            }, {
              id: 'id2',
              value: '42'
            }
          ],
          correct: 'id1',
          answer: 'id1'
        }
      ]
};
