!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Exercise=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var $ex, Compiler, DOMHelper, a, answer, b, background, choices, config, domify, exercise, hooks, i, keepBlankIndex, key, makeDiv, makeInput, makeRadioDiv, nextId, part, partIndex, parts, question, questionIndex, questions, randRange, state, val, _ref, _ref1, _ref2;

config = {
  short_answer: prompt('Do you prefer short answer questions ("" for no, anything else for yes)', '')
};

exercise = {
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
  parts: [
    {
      background: 'The spaceship moves at {{ ship_speed }} m/s',
      questions: [
        {
          stem: 'What is the rest mass? (Short answer)',
          short_stem: 'Enter your answer in kg',
          answers: [
            {
              credit: 1,
              value: '{{ ship_mass }}'
            }
          ]
        }, {
          stem: 'What is the rest mass?',
          short_stem: 'Enter your answer in kg',
          answers: [
            {
              credit: 1,
              value: '{{ ship_mass }}'
            }, {
              credit: 0,
              value: '{{ ship_mass_grams }}',
              hint: 'Check the units'
            }
          ]
        }, {
          stem: 'What is the force if it slams into a wall?',
          short_stem: 'Enter your answer in N',
          answers: [
            {
              credit: 1,
              value: '{{ ship_force }}',
              content: '{{ ship_force }} N'
            }, {
              credit: 0,
              value: '{{ ship_mass_div_speed }}',
              content: '{{ ship_mass_div_speed }} N',
              hint: 'Remember 1 Newton (N) is 1 kg*m/s'
            }
          ]
        }
      ]
    }, {
      background: 'Simple fill-in-the-blank questions',
      questions: [
        {
          stem: 'Photosynthesis ____ ATP',
          answers: [
            {
              credit: 1,
              value: 'creates'
            }
          ]
        }
      ]
    }, {
      background: 'Fill in this table (this is a multi-fill-in-the-blank):\n\n<table>\n  <tr><th>Time</th><th>Distance</th><th>Velocity</th></tr>\n  <tr><td>t<sub>0</sub></td><td>____1</td><td>____2</td></tr>\n  <tr><td>t<sub>1</sub></td><td>____3</td><td>____4</td></tr>\n  <tr><td>t<sub>2</sub></td><td>____5</td><td>____6</td></tr>\n</table>',
      questions: [
        {
          answers: [
            {
              credit: 1,
              value: 0
            }
          ]
        }, {
          answers: [
            {
              credit: 1,
              value: -1,
              content: '{{ ship_mass }}'
            }
          ]
        }, {
          answers: [
            {
              credit: 1,
              value: '{{ ship_force }}'
            }
          ]
        }, {
          answers: [
            {
              credit: 1,
              value: 10,
              content: '{{ ship_speed }}'
            }
          ]
        }, {
          answers: [
            {
              credit: 1,
              value: 100,
              content: '{{ ship_force }}'
            }
          ]
        }, {
          answers: [
            {
              credit: 1,
              value: 1000,
              content: '{{ ship_mass_grams }}'
            }
          ]
        }
      ]
    }
  ]
};

_ref = _dereq_('./htmlbars'), Compiler = _ref.Compiler, DOMHelper = _ref.DOMHelper, hooks = _ref.hooks;

randRange = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

state = {};

_ref1 = exercise.logic.inputs;
for (key in _ref1) {
  val = _ref1[key];
  state[key] = randRange(val.start, val.end);
}

_ref2 = exercise.logic.outputs;
for (key in _ref2) {
  val = _ref2[key];
  val = val(state);
  try {
    val = parseInt(val);
    val = val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  } catch (_error) {
    '';
  }
  state[key] = val;
}

domify = function(source, data) {
  var dom, template;
  template = Compiler.compile(source);
  dom = template(data, {
    hooks: hooks,
    dom: new DOMHelper()
  });
  return dom;
};

makeDiv = function(name, text, children) {
  if (children == null) {
    children = [];
  }
  text = text.replace(/____(\d+)?/g, '<input type="text"/>');
  return "<div class='" + name + "'>" + text + (children.join('')) + "</div>";
};

makeInput = function(name, text) {
  text = text.replace(/____(\d+)?/g, '<input type="text"/>');
  return "<input type='text' class='" + name + "' placeholder=\"" + text + "\"/>";
};

nextId = 0;

makeRadioDiv = function(questionId, name, value, text) {
  var id;
  id = "id-" + (nextId++);
  text = text.replace(/____(\d+)?/g, '<input type="text"/>');
  return "<div class='" + name + "'><input type='radio' name='" + questionId + "' id='" + id + "' value='" + value + "'/> <label for='" + id + "'>" + text + "</label></div>";
};

parts = (function() {
  var _i, _j, _len, _len1, _ref3, _ref4, _results;
  _ref3 = exercise.parts;
  _results = [];
  for (partIndex = _i = 0, _len = _ref3.length; _i < _len; partIndex = ++_i) {
    part = _ref3[partIndex];
    if (part.background && part.background.split('____').length > 2 && config.short_answer) {
      background = part.background;
      keepBlankIndex = randRange(0, part.questions.length - 1);
      _ref4 = part.questions;
      for (i = _j = 0, _len1 = _ref4.length; _j < _len1; i = ++_j) {
        question = _ref4[i];
        if (i !== keepBlankIndex) {
          answer = question.answers[0].content || question.answers[0].value;
          background = background.replace("____" + (i + 1), answer);
        }
      }
      _results.push(makeDiv('part', background));
    } else {
      questions = (function() {
        var _k, _len2, _ref5, _results1;
        _ref5 = part.questions;
        _results1 = [];
        for (questionIndex = _k = 0, _len2 = _ref5.length; _k < _len2; questionIndex = ++_k) {
          question = _ref5[questionIndex];
          if (/____(\d+)?/.test(question.stem)) {
            _results1.push(makeDiv('question', question.stem));
          } else if (question.answers.length > 1 && !config.short_answer) {
            choices = (function() {
              var _l, _len3, _ref6, _results2;
              _ref6 = question.answers;
              _results2 = [];
              for (_l = 0, _len3 = _ref6.length; _l < _len3; _l++) {
                answer = _ref6[_l];
                if (answer.content) {
                  _results2.push(makeRadioDiv("id-" + partIndex + "-" + questionIndex, 'choice', answer.value, answer.content));
                } else {
                  _results2.push(makeRadioDiv("id-" + partIndex + "-" + questionIndex, 'choice', answer.value, answer.value));
                }
              }
              return _results2;
            })();
            _results1.push(makeDiv('question', question.stem, choices));
          } else {
            if (question.short_stem) {
              a = makeDiv('question', question.stem);
              b = makeInput('question', question.short_stem);
              _results1.push("" + a + b);
            } else if (question.stem) {
              a = makeDiv('question', question.stem);
              b = makeInput('question', '');
              _results1.push("" + a + b);
            } else {
              _results1.push('');
            }
          }
        }
        return _results1;
      })();
      _results.push(makeDiv('part', part.background, questions));
    }
  }
  return _results;
})();

$ex = document.getElementById('exercise');

$ex.innerHTML = '';

$ex.appendChild(domify(makeDiv('background', exercise.background, parts), state));



},{"./htmlbars":2}],2:[function(_dereq_,module,exports){
var Compiler, DOMHelper, hooks;

Compiler = requireModule('htmlbars-compiler/compiler');

hooks = requireModule('htmlbars-runtime').hooks;

DOMHelper = requireModule('morph').DOMHelper;

module.exports = {
  Compiler: Compiler,
  hooks: hooks,
  DOMHelper: DOMHelper
};



},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9Vc2Vycy9waGlsL2dpdGh1Yi9vcGVuc3RheC9leGVyY2lzZS1tYWtlci1qcy9ub2RlX21vZHVsZXMvZ3J1bnQtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3BoaWwvZ2l0aHViL29wZW5zdGF4L2V4ZXJjaXNlLW1ha2VyLWpzL3NyYy9leGVyY2lzZS5jb2ZmZWUiLCIvVXNlcnMvcGhpbC9naXRodWIvb3BlbnN0YXgvZXhlcmNpc2UtbWFrZXItanMvc3JjL2h0bWxiYXJzLmNvZmZlZSJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUEscVFBQUE7O0FBQUEsTUFBQSxHQUNFO0FBQUEsRUFBQSxZQUFBLEVBQWMsTUFBQSxDQUFPLHlFQUFQLEVBQWtGLEVBQWxGLENBQWQ7Q0FERixDQUFBOztBQUFBLFFBSUEsR0FDRTtBQUFBLEVBQUEsS0FBQSxFQUNFO0FBQUEsSUFBQSxNQUFBLEVBQ0U7QUFBQSxNQUFBLEtBQUEsRUFBTztBQUFBLFFBQUUsS0FBQSxFQUFPLENBQVQ7QUFBQSxRQUFZLEdBQUEsRUFBSyxDQUFqQjtPQUFQO0FBQUEsTUFDQSxJQUFBLEVBQU87QUFBQSxRQUFFLEtBQUEsRUFBTyxDQUFUO0FBQUEsUUFBWSxHQUFBLEVBQUssQ0FBakI7T0FEUDtBQUFBLE1BRUEsS0FBQSxFQUFPO0FBQUEsUUFBRSxLQUFBLEVBQU8sQ0FBVDtBQUFBLFFBQVksR0FBQSxFQUFLLENBQWpCO09BRlA7S0FERjtBQUFBLElBSUEsT0FBQSxFQUNFO0FBQUEsTUFBQSxTQUFBLEVBQVcsU0FBQyxJQUFELEdBQUE7QUFBMEIsWUFBQSxrQkFBQTtBQUFBLFFBQXhCLGFBQUEsT0FBTyxZQUFBLE1BQU0sYUFBQSxLQUFXLENBQUE7ZUFBQSxLQUFBLEdBQVEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxHQUFULEVBQWMsSUFBZCxFQUFsQztNQUFBLENBQVg7QUFB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LENBQUMsV0FBSixDQUFnQixNQUFBLENBQU8sT0FBQSxDQUFRLFlBQVIsRUFBc0IsUUFBUSxDQUFDLFVBQS9CLEVBQTJDLEtBQTNDLENBQVAsRUFBMEQsS0FBMUQsQ0FBaEIsQ0FyS0EsQ0FBQTs7Ozs7QUNNQSxJQUFBLDBCQUFBOztBQUFBLFFBQUEsR0FBVyxhQUFBLENBQWMsNEJBQWQsQ0FBWCxDQUFBOztBQUFBLFFBQ1UsYUFBQSxDQUFjLGtCQUFkLEVBQVQsS0FERCxDQUFBOztBQUFBLFlBRWMsYUFBQSxDQUFjLE9BQWQsRUFBYixTQUZELENBQUE7O0FBQUEsTUFJTSxDQUFDLE9BQVAsR0FBaUI7QUFBQSxFQUFDLFVBQUEsUUFBRDtBQUFBLEVBQVcsT0FBQSxLQUFYO0FBQUEsRUFBa0IsV0FBQSxTQUFsQjtDQUpqQixDQUFBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbmZpZyA9XG4gIHNob3J0X2Fuc3dlcjogcHJvbXB0KCdEbyB5b3UgcHJlZmVyIHNob3J0IGFuc3dlciBxdWVzdGlvbnMgKFwiXCIgZm9yIG5vLCBhbnl0aGluZyBlbHNlIGZvciB5ZXMpJywgJycpXG4gICAjbXVsdGlwbGVfY2hvaWNlOiB0cnVlXG5cbmV4ZXJjaXNlID1cbiAgbG9naWM6XG4gICAgaW5wdXRzOlxuICAgICAgc2NhbGU6IHsgc3RhcnQ6IDEsIGVuZDogMyB9XG4gICAgICBtYXNzOiAgeyBzdGFydDogMSwgZW5kOiAzIH1cbiAgICAgIHNwZWVkOiB7IHN0YXJ0OiAxLCBlbmQ6IDMgfVxuICAgIG91dHB1dHM6XG4gICAgICBzaGlwX21hc3M6ICh7c2NhbGUsIG1hc3MsIHNwZWVkfSkgLT4gc2NhbGUgKiBNYXRoLnBvdygxMDAsIG1hc3MpXG4gICAgICBzaGlwX3NwZWVkOiAoe3NjYWxlLCBtYXNzLCBzcGVlZH0pIC0+IHNjYWxlICogTWF0aC5wb3coMTAsIHNwZWVkKVxuICAgICAgc2hpcF9mb3JjZTogKHtzY2FsZSwgbWFzcywgc3BlZWR9KSAtPiBzY2FsZSAqIE1hdGgucG93KDEwMCwgbWFzcykgKiBzY2FsZSAqIE1hdGgucG93KDEwLCBzcGVlZClcbiAgICAgIHNoaXBfbWFzc19ncmFtczogKHtzY2FsZSwgbWFzcywgc3BlZWR9KSAtPiBzY2FsZSAqIE1hdGgucG93KDEwMCwgbWFzcykgKiAxMDAwXG4gICAgICBzaGlwX21hc3NfZGl2X3NwZWVkOiAoe3NjYWxlLCBtYXNzLCBzcGVlZH0pIC0+IHNjYWxlICogTWF0aC5wb3coMTAwLCBtYXNzKSAvIHNjYWxlICogTWF0aC5wb3coMTAsIHNwZWVkKVxuXG4gIGJhY2tncm91bmQ6ICdUaGlzIGV4ZXJjaXNlIGhhcyBtYW55IHBhcnRzLiBFYWNoIG9uZSBpcyBhIGRpZmZlcmVudCB0eXBlIG9mIHF1ZXN0aW9uLiBFaW5zdGVpbiBtYWtlcyBhIHt7IHNoaXBfbWFzcyB9fSBrZyBzcGFjZXNoaXAnXG4gIHBhcnRzOiBbXG4gICAge1xuICAgICAgYmFja2dyb3VuZDogJ1RoZSBzcGFjZXNoaXAgbW92ZXMgYXQge3sgc2hpcF9zcGVlZCB9fSBtL3MnXG4gICAgICBxdWVzdGlvbnM6IFtcbiAgICAgICAge1xuICAgICAgICAgIHN0ZW06ICdXaGF0IGlzIHRoZSByZXN0IG1hc3M/IChTaG9ydCBhbnN3ZXIpJ1xuICAgICAgICAgIHNob3J0X3N0ZW06ICdFbnRlciB5b3VyIGFuc3dlciBpbiBrZydcbiAgICAgICAgICBhbnN3ZXJzOiBbXG4gICAgICAgICAgICB7IGNyZWRpdDogMSwgdmFsdWU6ICd7eyBzaGlwX21hc3MgfX0nIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgIHN0ZW06ICdXaGF0IGlzIHRoZSByZXN0IG1hc3M/J1xuICAgICAgICAgIHNob3J0X3N0ZW06ICdFbnRlciB5b3VyIGFuc3dlciBpbiBrZydcbiAgICAgICAgICBhbnN3ZXJzOiBbXG4gICAgICAgICAgICB7IGNyZWRpdDogMSwgdmFsdWU6ICd7eyBzaGlwX21hc3MgfX0nIH1cbiAgICAgICAgICAgIHsgY3JlZGl0OiAwLCB2YWx1ZTogJ3t7IHNoaXBfbWFzc19ncmFtcyB9fScsIGhpbnQ6ICdDaGVjayB0aGUgdW5pdHMnIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgICAge1xuICAgICAgICAgIHN0ZW06ICdXaGF0IGlzIHRoZSBmb3JjZSBpZiBpdCBzbGFtcyBpbnRvIGEgd2FsbD8nXG4gICAgICAgICAgc2hvcnRfc3RlbTogJ0VudGVyIHlvdXIgYW5zd2VyIGluIE4nXG4gICAgICAgICAgYW5zd2VyczogW1xuICAgICAgICAgICAgeyBjcmVkaXQ6IDEsIHZhbHVlOiAne3sgc2hpcF9mb3JjZSB9fScsICAgICAgICAgIGNvbnRlbnQ6ICd7eyBzaGlwX2ZvcmNlIH19IE4nIH1cbiAgICAgICAgICAgIHsgY3JlZGl0OiAwLCB2YWx1ZTogJ3t7IHNoaXBfbWFzc19kaXZfc3BlZWQgfX0nLCBjb250ZW50OiAne3sgc2hpcF9tYXNzX2Rpdl9zcGVlZCB9fSBOJywgaGludDogJ1JlbWVtYmVyIDEgTmV3dG9uIChOKSBpcyAxIGtnKm0vcycgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgICAjIEZpbGwgaW4gdGhlIGJsYW5rc1xuICAgIHtcbiAgICAgIGJhY2tncm91bmQ6ICdTaW1wbGUgZmlsbC1pbi10aGUtYmxhbmsgcXVlc3Rpb25zJ1xuICAgICAgcXVlc3Rpb25zOiBbXG4gICAgICAgIHsgc3RlbTogJ1Bob3Rvc3ludGhlc2lzIF9fX18gQVRQJywgYW5zd2VyczogW3sgY3JlZGl0OiAxLCB2YWx1ZTogJ2NyZWF0ZXMnIH1dIH1cbiAgICAgIF1cbiAgICB9XG4gICAge1xuICAgICAgYmFja2dyb3VuZDogJycnRmlsbCBpbiB0aGlzIHRhYmxlICh0aGlzIGlzIGEgbXVsdGktZmlsbC1pbi10aGUtYmxhbmspOlxuXG4gICAgICAgIDx0YWJsZT5cbiAgICAgICAgICA8dHI+PHRoPlRpbWU8L3RoPjx0aD5EaXN0YW5jZTwvdGg+PHRoPlZlbG9jaXR5PC90aD48L3RyPlxuICAgICAgICAgIDx0cj48dGQ+dDxzdWI+MDwvc3ViPjwvdGQ+PHRkPl9fX18xPC90ZD48dGQ+X19fXzI8L3RkPjwvdHI+XG4gICAgICAgICAgPHRyPjx0ZD50PHN1Yj4xPC9zdWI+PC90ZD48dGQ+X19fXzM8L3RkPjx0ZD5fX19fNDwvdGQ+PC90cj5cbiAgICAgICAgICA8dHI+PHRkPnQ8c3ViPjI8L3N1Yj48L3RkPjx0ZD5fX19fNTwvdGQ+PHRkPl9fX182PC90ZD48L3RyPlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgJycnXG4gICAgICBxdWVzdGlvbnM6IFtcbiAgICAgICAgeyBhbnN3ZXJzOiBbeyBjcmVkaXQ6IDEsIHZhbHVlOiAwIH1dIH1cbiAgICAgICAgeyBhbnN3ZXJzOiBbeyBjcmVkaXQ6IDEsIHZhbHVlOiAtMSwgY29udGVudDogJ3t7IHNoaXBfbWFzcyB9fScgfV0gfVxuICAgICAgICB7IGFuc3dlcnM6IFt7IGNyZWRpdDogMSwgdmFsdWU6ICd7eyBzaGlwX2ZvcmNlIH19JyB9XSB9XG4gICAgICAgIHsgYW5zd2VyczogW3sgY3JlZGl0OiAxLCB2YWx1ZTogMTAsIGNvbnRlbnQ6ICd7eyBzaGlwX3NwZWVkIH19JyB9XSB9XG4gICAgICAgIHsgYW5zd2VyczogW3sgY3JlZGl0OiAxLCB2YWx1ZTogMTAwLCBjb250ZW50OiAne3sgc2hpcF9mb3JjZSB9fScgfV0gfVxuICAgICAgICB7IGFuc3dlcnM6IFt7IGNyZWRpdDogMSwgdmFsdWU6IDEwMDAsIGNvbnRlbnQ6ICd7eyBzaGlwX21hc3NfZ3JhbXMgfX0nIH1dIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cblxue0NvbXBpbGVyLCBET01IZWxwZXIsIGhvb2tzfSA9IHJlcXVpcmUoJy4vaHRtbGJhcnMnKVxuXG5cbnJhbmRSYW5nZSA9IChtaW4sIG1heCkgLT5cbiAgTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbiArIDEpKSArIG1pblxuXG4jIEdlbmVyYXRlIHRoZSB2YXJpYWJsZXNcbnN0YXRlID0ge31cbmZvciBrZXksIHZhbCBvZiBleGVyY2lzZS5sb2dpYy5pbnB1dHNcbiAgc3RhdGVba2V5XSA9IHJhbmRSYW5nZSh2YWwuc3RhcnQsIHZhbC5lbmQpXG5cbmZvciBrZXksIHZhbCBvZiBleGVyY2lzZS5sb2dpYy5vdXRwdXRzXG4gIHZhbCA9IHZhbChzdGF0ZSlcbiAgdHJ5XG4gICAgdmFsID0gcGFyc2VJbnQodmFsKVxuICAgICMgSW5qZWN0IGNvbW1hc1xuICAgIHZhbCA9IHZhbC50b1N0cmluZygpLnJlcGxhY2UoL1xcQig/PShcXGR7M30pKyg/IVxcZCkpL2csICcsJylcbiAgY2F0Y2hcbiAgICAnJ1xuICBzdGF0ZVtrZXldID0gdmFsXG5cblxuXG5kb21pZnkgPSAoc291cmNlLCBkYXRhKSAtPlxuICB0ZW1wbGF0ZSAgICAgPSBDb21waWxlci5jb21waWxlKHNvdXJjZSlcbiAgZG9tICAgICAgICAgID0gdGVtcGxhdGUoZGF0YSwge2hvb2tzOiBob29rcywgZG9tOiBuZXcgRE9NSGVscGVyKCl9KVxuICBkb21cblxuIyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4jIEdlbmVyYXRlIHRoZSBIVE1MXG5cbiMgVW5lc2NhcGUgYSBzdHJpbmcgd2l0aCBoYW5kbGViYXJzIGB7eyAuLi4gfX1gIHRlbXBsYXRlc1xubWFrZURpdiA9IChuYW1lLCB0ZXh0LCBjaGlsZHJlbj1bXSkgLT5cbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvX19fXyhcXGQrKT8vZywgJzxpbnB1dCB0eXBlPVwidGV4dFwiLz4nKVxuICBcIjxkaXYgY2xhc3M9JyN7bmFtZX0nPiN7dGV4dH0je2NoaWxkcmVuLmpvaW4oJycpfTwvZGl2PlwiXG5cbm1ha2VJbnB1dCA9IChuYW1lLCB0ZXh0KSAtPlxuICB0ZXh0ID0gdGV4dC5yZXBsYWNlKC9fX19fKFxcZCspPy9nLCAnPGlucHV0IHR5cGU9XCJ0ZXh0XCIvPicpXG4gIFwiPGlucHV0IHR5cGU9J3RleHQnIGNsYXNzPScje25hbWV9JyBwbGFjZWhvbGRlcj1cXFwiI3t0ZXh0fVxcXCIvPlwiXG5cbm5leHRJZCA9IDBcbm1ha2VSYWRpb0RpdiA9IChxdWVzdGlvbklkLCBuYW1lLCB2YWx1ZSwgdGV4dCkgLT5cbiAgaWQgPSBcImlkLSN7bmV4dElkKyt9XCJcbiAgdGV4dCA9IHRleHQucmVwbGFjZSgvX19fXyhcXGQrKT8vZywgJzxpbnB1dCB0eXBlPVwidGV4dFwiLz4nKVxuICBcIjxkaXYgY2xhc3M9JyN7bmFtZX0nPjxpbnB1dCB0eXBlPSdyYWRpbycgbmFtZT0nI3txdWVzdGlvbklkfScgaWQ9JyN7aWR9JyB2YWx1ZT0nI3t2YWx1ZX0nLz4gPGxhYmVsIGZvcj0nI3tpZH0nPiN7dGV4dH08L2xhYmVsPjwvZGl2PlwiXG5cblxuXG5wYXJ0cyA9IGZvciBwYXJ0LCBwYXJ0SW5kZXggaW4gZXhlcmNpc2UucGFydHNcbiAgaWYgcGFydC5iYWNrZ3JvdW5kIGFuZCBwYXJ0LmJhY2tncm91bmQuc3BsaXQoJ19fX18nKS5sZW5ndGggPiAyIGFuZCBjb25maWcuc2hvcnRfYW5zd2VyXG4gICAgYmFja2dyb3VuZCA9IHBhcnQuYmFja2dyb3VuZFxuICAgIGtlZXBCbGFua0luZGV4ID0gcmFuZFJhbmdlKDAsIHBhcnQucXVlc3Rpb25zLmxlbmd0aCAtIDEpXG4gICAgZm9yIHF1ZXN0aW9uLCBpIGluIHBhcnQucXVlc3Rpb25zXG4gICAgICBpZiBpIGlzbnQga2VlcEJsYW5rSW5kZXhcbiAgICAgICAgYW5zd2VyID0gcXVlc3Rpb24uYW5zd2Vyc1swXS5jb250ZW50IG9yIHF1ZXN0aW9uLmFuc3dlcnNbMF0udmFsdWVcbiAgICAgICAgIyBhbnN3ZXIgPSBtYWtlRGl2KCdhbnN3ZXInLCBhbnN3ZXIpXG4gICAgICAgIGJhY2tncm91bmQgPSBiYWNrZ3JvdW5kLnJlcGxhY2UoXCJfX19fI3tpICsgMX1cIiwgYW5zd2VyKVxuXG4gICAgbWFrZURpdigncGFydCcsIGJhY2tncm91bmQpXG5cbiAgZWxzZVxuICAgIHF1ZXN0aW9ucyA9IGZvciBxdWVzdGlvbiwgcXVlc3Rpb25JbmRleCBpbiBwYXJ0LnF1ZXN0aW9uc1xuICAgICAgaWYgL19fX18oXFxkKyk/Ly50ZXN0KHF1ZXN0aW9uLnN0ZW0pXG4gICAgICAgIG1ha2VEaXYoJ3F1ZXN0aW9uJywgcXVlc3Rpb24uc3RlbSlcblxuICAgICAgZWxzZSBpZiBxdWVzdGlvbi5hbnN3ZXJzLmxlbmd0aCA+IDEgYW5kIG5vdCBjb25maWcuc2hvcnRfYW5zd2VyXG4gICAgICAgICMgTXVsdGlwbGUgQ2hvaWNlXG4gICAgICAgIGNob2ljZXMgPSBmb3IgYW5zd2VyIGluIHF1ZXN0aW9uLmFuc3dlcnNcbiAgICAgICAgICBpZiBhbnN3ZXIuY29udGVudFxuICAgICAgICAgICAgbWFrZVJhZGlvRGl2KFwiaWQtI3twYXJ0SW5kZXh9LSN7cXVlc3Rpb25JbmRleH1cIiwgJ2Nob2ljZScsIGFuc3dlci52YWx1ZSwgYW5zd2VyLmNvbnRlbnQpXG4gICAgICAgICAgZWxzZVxuICAgICAgICAgICAgbWFrZVJhZGlvRGl2KFwiaWQtI3twYXJ0SW5kZXh9LSN7cXVlc3Rpb25JbmRleH1cIiwgJ2Nob2ljZScsIGFuc3dlci52YWx1ZSwgYW5zd2VyLnZhbHVlKVxuICAgICAgICBtYWtlRGl2KCdxdWVzdGlvbicsIHF1ZXN0aW9uLnN0ZW0sIGNob2ljZXMpXG4gICAgICBlbHNlXG4gICAgICAgIGlmIHF1ZXN0aW9uLnNob3J0X3N0ZW1cbiAgICAgICAgICBhID0gbWFrZURpdigncXVlc3Rpb24nLCBxdWVzdGlvbi5zdGVtKVxuICAgICAgICAgIGIgPSBtYWtlSW5wdXQoJ3F1ZXN0aW9uJywgcXVlc3Rpb24uc2hvcnRfc3RlbSlcbiAgICAgICAgICBcIiN7YX0je2J9XCJcbiAgICAgICAgZWxzZSBpZiBxdWVzdGlvbi5zdGVtXG4gICAgICAgICAgYSA9IG1ha2VEaXYoJ3F1ZXN0aW9uJywgcXVlc3Rpb24uc3RlbSlcbiAgICAgICAgICBiID0gbWFrZUlucHV0KCdxdWVzdGlvbicsICcnKVxuICAgICAgICAgIFwiI3thfSN7Yn1cIlxuICAgICAgICBlbHNlXG4gICAgICAgICAgJydcblxuICAgIG1ha2VEaXYoJ3BhcnQnLCBwYXJ0LmJhY2tncm91bmQsIHF1ZXN0aW9ucylcblxuXG4kZXggPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZXhlcmNpc2UnKVxuJGV4LmlubmVySFRNTCA9ICcnXG4kZXguYXBwZW5kQ2hpbGQoZG9taWZ5IG1ha2VEaXYoJ2JhY2tncm91bmQnLCBleGVyY2lzZS5iYWNrZ3JvdW5kLCBwYXJ0cyksIHN0YXRlKVxuIiwiIyBIVE1MQmFycyBpcyBhIGJpdCBhbm5veWluZyB0byBzaGltIGluIHRvIGJyb3dzZXJpZnk6XG4jIC0gaXQgY29uY2F0ZW5hdGVzIHNldmVyYWwgbW9kdWVzIGludG8gb25lIGZpbGUgKGRlYW1kaWZ5IGRvZXMgbm90IGxpa2UgdGhhdClcbiMgLSBpdCB1c2VzIGEgY3VzdG9tIGxvYWRlclxuXG4jIFdoZW4gY29uY2F0ZW5hdGluZyB0aGUgZmlsZXMgdG9nZXRoZXIgeW91IHdpbGwgbmVlZCB0byBpbmNsdWRlIHRoZSBsb2FkZXIgYW5kIGh0bWxiYXJzIGZpbGVzIGFoZWFkIG9mIHRpbWVcblxuQ29tcGlsZXIgPSByZXF1aXJlTW9kdWxlKCdodG1sYmFycy1jb21waWxlci9jb21waWxlcicpXG57aG9va3N9ID0gcmVxdWlyZU1vZHVsZSgnaHRtbGJhcnMtcnVudGltZScpXG57RE9NSGVscGVyfSA9IHJlcXVpcmVNb2R1bGUoJ21vcnBoJylcblxubW9kdWxlLmV4cG9ydHMgPSB7Q29tcGlsZXIsIGhvb2tzLCBET01IZWxwZXJ9XG4iXX0=
(1)
});
