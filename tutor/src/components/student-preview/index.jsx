import React from 'react';
import Router from '../../helpers/router';

import { Grid, Row, Col } from 'react-bootstrap';
import YouTube from 'react-youtube';
import BackButton from '../buttons/back-button';

export default function StudentPreview() {
  const params = Router.currentParams();
  const { courseId } = params;
  const backLink = courseId ? { to: 'dashboard', text: 'Back to Dashboard', params: { courseId } } :
                   { to: 'myCourses', text: 'Back to My Courses' };

  return (
    <Grid className="student-preview">
      <header>
        <h1>Preview the Student Experience</h1>
        <BackButton fallbackLink={backLink} />
      </header>

      <Row className="section">
        <Col sm={6}>
          <h3>Student dashboard</h3>
          <p>
            The dashboard gives students an overview of the course, assignments, progress, and performance. Students can see when assignments are due, start current assignments, review past work, and access their textbook. The student Performance Forecast shows students their performance within each section of the textbook, highlights their weaker areas, and lets them practice on their own.
          </p>
        </Col>
        <Col sm={6}>
          <YouTube
            videoId="AEUgriQUjPc"
            opts={{
              width: '100%',
            }}
          />
        </Col>
      </Row>

      <Row className="section">
        <Col sm={6}>
          <h3>Reading assignment</h3>
          <p>
            OpenStax Tutor Beta reading assignments present the textbook to students in manageable chunks and engage students with videos, case studies, and interactive elements. As students read, each section is followed by personalized, two-step questions that give immediate feedback.
          </p>
        </Col>
        <Col sm={6}>
          <YouTube
            videoId="emjbBoV0Ixs"
            opts={{
              width: '100%',
            }}
          />
        </Col>
      </Row>

      <Row className="section">
        <Col sm={6}>
          <h3>Homework assignment</h3>
          <p>
            After students work instructor-assigned questions, OpenStax Tutor Beta will unlock personalized and spaced practice questions chosen specifically for each student. These two-step questions prompt students to recall the answer from memory before selecting a multiple choice option.
          </p>
        </Col>
        <Col sm={6}>
          <YouTube
            videoId="Aoco1IRixZA"
            opts={{
              width: '100%',
            }}
          />
        </Col>
      </Row>


      <Row className="section">
        <Col sm={6}>
          <h3>Performance forecast</h3>
          <p>
            Catch mouse and gave it as a present cat snacks. Sit on human. Peer out window, chatter at birds, lure them to mouth sniff other cat's butt and hang jaw half open thereafter yet kitty kitty i am the best. Sit and stare claw drapes. Throwup on your pillow roll on the floor purring your whiskers off so lick butt. Attack the dog then pretend like nothing happened. Poop on grasses find empty spot in cupboard and sleep all day purr when being pet, and pet right here, no not there, here, no fool, right here that other cat smells funny you should really give me all the treats because i smell the best and omg you finally got the right spot and i love you right now stand in front of the computer screen, and favor packaging over toy so fall asleep on the washing machine. The dog smells bad destroy couch as revenge, pounce on unsuspecting person and make meme, make cute face lick butt, and flee in terror at cucumber discovered on floor. Roll on the floor purring your whiskers off russian blue poop in a handbag look delicious and drink the soapy mopping up water then puke giant foamy fur-balls lick the curtain just to be annoying and hide when guests come over. Chew on cable scratch the furniture, cat slap dog in face cats secretly make all the worlds muffins curl up and sleep on the freshly laundered towels, poop on grasses roll on the floor purring your whiskers off. Mew nap all day attack feet kitty power. Eats owners hair then claws head hiss and stare at nothing then run suddenly away yet drink water out of the faucet so purr for no reason or stare at wall turn and meow stare at wall some more meow again continue staring but meowing non stop for food i could pee on this if i had the energy. Pushes butt to face cat slap dog in face love and coo around boyfriend who purrs and makes the perfect moonlight eyes so i can purr and swat the glittery gleaming yarn to him (the yarn is from a $125 sweater) chase red laser dot. Cat is love, cat is life vommit food and eat it again meow to be let out man running from cops stops to pet cats, goes to jail scratch at the door then walk away.
          </p>
        </Col>
        <Col sm={6}>
          <YouTube
            videoId="oMRX0ZOeM84"
            opts={{
              width: '100%',
            }}
          />
        </Col>
      </Row>

      <Row className="section">
        <Col sm={6}>
          <h3>Viewing progress</h3>
          <p>
            Rub whiskers on bare skin act innocent stare at wall turn and meow stare at wall some more meow again continue staring leave fur on owners clothes lick butt. Loved it, hated it, loved it, hated it i like big cats and i can not lie and love to play with owner's hair tie. Hunt by meowing loudly at 5am next to human slave food dispenser scratch the postman wake up lick paw wake up owner meow meow yet fall over dead (not really but gets sypathy) fall over dead (not really but gets sypathy) and eat half my food and ask for more you call this cat food purr. Scratch the postman wake up lick paw wake up owner meow meow stares at human while pushing stuff off a table stares at human while pushing stuff off a table chirp at birds. Meow loudly just to annoy owners kitty loves pigs. Mark territory need to chase tail, but swat turds around the house when in doubt, wash for chase imaginary bugs. Play time. Leave fur on owners clothes leave dead animals as gifts. Knock over christmas tree
          </p>
        </Col>
        <Col sm={6}>
          <YouTube
            videoId="mONaiXV6-no"
            opts={{
              width: '100%',
            }}
          />
        </Col>
      </Row>

    </Grid>
  );
}
