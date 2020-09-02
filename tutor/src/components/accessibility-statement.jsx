import { React, styled } from 'vendor';
import Router from '../helpers/router';
import { Table } from 'react-bootstrap';
import { breakpoint } from 'theme';
import Header from './header';

const Page = styled.div`
  background: #fff;
  line-height: 2rem;
  margin: 0 auto;
  max-width: 1200px;
  padding: 40px 80px;
  ${breakpoint.tablet`
    padding: calc(${breakpoint.margins.mobile} * 2) ${breakpoint.margins.tablet};
  `}
  ${breakpoint.mobile`
    padding: ${breakpoint.margins.mobile};
  `}
  h3 {
    font-size: 1.4rem;
    font-weight: bold;
  }
  p, ul {
    margin-bottom: 2rem;
  }
`;

export default function AccessibilityStatement() {
  const params = Router.currentParams();
  const { courseId } = params;
  const backTo = courseId ? { to: 'dashboard', params: { courseId } } : { to: 'myCourses' };

  return (
    <>
      <Header
        backTo={backTo.to}
        backToParams={backTo.params}
        title="Accessibility Statement"
        unDocked
      />
      <Page>
        <h3>Accessibility</h3>
        <p>
          At OpenStax, we're committed to ensuring that OpenStax Tutor is as accessible as possible to the widest possible audience, including students with disabilities.
        </p>

        <h3>Web accessibility</h3>
        <p>
          Our goal is to ensure that OpenStax Tutor Beta follows accessible web design best practices so that it meets the W3C-WAI Web Content Accessibility Guidelines (WCAG) 2.0 at Level AA and Section 508 of the Rehabilitation Act. The WCAG 2.0 guidelines explain ways to make web content more accessible for people with disabilities and more user-friendly for everyone.
        </p>

        <h3>Our progress</h3>
        <p>
          The text in OpenStax Tutor Beta, including the headers, features, and exercises, is designed to be as reader-friendly as possible on-screen. Math content is rendered in MathML, which is an accessible format that can be read with screen readers and styled with CSS. Though we render some complex mathematical graphics as images, all images are developed with detailed explanatory text.
        </p>
        <p>
          We're working hard to achieve our goal of Level AA accessibility, but we realize there are some areas that still need improving. Our developers are actively working to resolve issues that may hinder accessibility according to the above guidelines.
        </p>

        <h3>Feedback</h3>
        <p>
          You can help us to meet our accessibility goals by letting us know about your experience using OpenStax Tutor Beta by emailing us at support@openstaxtutor.org.
          If you've encountered an accessibility problem with OpenStax Tutor Beta, please provide the following information:
        </p>
        <ul>
          <li>Full name as listed in your OpenStax Account.</li>
          <li>A description of what happened.  What were you unable to accomplish?</li>
          <li>URL  and/or name of the OpenStax Tutor feature where the issue occurs.</li>
          <li>The name of your browser (e.g. Firefox 37, Safari 7, Chrome 42, etc.). If possible, please also provide the version number.</li>
          <li>The name of your operating system (e.g. Windows 7, iOS 6, Android 4.4, etc.). If possible, please also provide the version number.</li>
          <li>Any assistive technology that you are using (e.g. JAWS, VoiceOver, Dragon, etc.).</li>
        </ul>

        <h3>Interactive simulations and videos</h3>
        <p>
          Some learning materials include links to interactive simulations (e.g. PhET physics simulations developed by the University of Colorado) and videos. While simulations are more difficult to make accessible than more conventional static textbook content, an effort to improve the accessibility of many PhET simulations is underway. We strive to make sure that all of our videos have captions. We encourage students to submit support tickets for content that is not captioned appropriately and we will address the matter promptly. As with any OpenStax feature, your feedback about the accessibility of the videos and PhET simulations welcome at <a href="mailto:support@openstaxtutor.org">support@openstaxtutor.org</a>.
        </p>

        <h3>Keyboard navigation</h3>
        <p>
          To navigate OpenStax Tutor Beta by keyboard in Internet Explorer, Chrome, Firefox, Netscape, Opera, or Safari, use the following key equivalents:
        </p>
        <Table>
          <thead>
            <tr className="highlight">
              <th rowSpan="2">If you want to -</th>
              <th colSpan="2">Select -</th>
            </tr>
            <tr>
              <th>For Windows...</th>
              <th>For Macintosh</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Increase font size</td>
              <td>Ctrl +</td>
              <td>⌘ +</td>
            </tr>
            <tr>
              <td>Decrease font size</td>
              <td>Ctrl -</td>
              <td>⌘ -</td>
            </tr>
            <tr>
              <td>Move forward from link to link</td>
              <td>Tab</td>
              <td>Tab</td>
            </tr>
            <tr>
              <td>Move backward from link to link</td>
              <td>Shift + tab</td>
              <td>Shift + tab</td>
            </tr>
            <tr>
              <td>Move from one assignment to the next</td>
              <td>Tab</td>
              <td>Tab</td>
            </tr>
            <tr>
              <td>Go to the next page in a reading</td>
              <td>Right Arrow</td>
              <td>Right Arrow</td>
            </tr>
            <tr>
              <td>Go to the previous page in a reading</td>
              <td>Left Arrow</td>
              <td>Left Arrow</td>
            </tr>
            <tr>
              <td>Selecting answer “a” from a multiple choice question</td>
              <td>a</td>
              <td>a</td>
            </tr>
            <tr>
              <td>Selecting answer “b” from a multiple choice question</td>
              <td>b</td>
              <td>b</td>
            </tr>
            <tr>
              <td>Selecting answer “c” from a multiple choice question</td>
              <td>c</td>
              <td>c</td>
            </tr>
            <tr>
              <td>Selecting answer “d” from a multiple choice question</td>
              <td>d</td>
              <td>d</td>
            </tr>
          </tbody>
        </Table>
      </Page>
    </>
  );
}
