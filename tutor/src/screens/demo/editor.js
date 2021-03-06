import { React } from 'vendor';
import { EditableHTML } from '../../components/editor';

const fakeExercise = `
<div>
<p>


How many <span data-math="\\text{km/h}"></span> are equal to <span data-math="1.0\\,\\text{m/s}">1.0\\,\\text{m/s}</span>? Hint: Carry out the explicit steps involved in the conversion.

The speed limit on some interstate highways is roughly <span data-math="100,\\text{km/h}">100\\,\\text{km/h}</span>. How many miles per hour is this if <span data-math="1.0\\,\\text{mile}">1.0\\,\\text{mile}</span> is about <span data-math="1.609,\\text{km}">1.609,\text{km}</span>?

          <img src="https://s3-us-west-2.amazonaws.com/openstax-assets/Ss2Xg59OLfjbgarp-prodtutor/exercises/attachments/large_aeb10979cb1265ae1f928677f271c8e4f0f6154a26723b80e40ca3db913579d3.png" alt="The x-axis is temperature in Celsius degrees, ranging from 0 to 70 degrees in increments of 10 degrees.  The y-axis is rate of reaction and is not numbered.  The curve begins at 0 degrees, where the rate of the reaction is close to zero.  The curve proceeds upwards with a sharp slope until peaking at about 38 degrees, where an indicator line is labeled “optimal temperature.”  The curve is relatively flat for another ten degrees and then drops precipitously  from 50 to 60 degrees, hitting zero again at about 61 degrees." />

</p>


          The graph shows what effect temperature has on the functioning of enzymes.
          What conclusion can be drawn from these data?
          

          <p>
            An experiment investigating the effects of water and fertilizer on plant growth was conducted. Each plant was given the same amount of light per day and was kept at the same temperature. The results are listed in the table.
          </p>
          <table>
            <tbody>
              <tr>
                <th>Day</th>
                <th class="center">Water Only (cm)</th>
                <th class="center">Water and Fertilizer (cm)</th>
              </tr>
              <tr>
                <th>1</th>
                <td>2.0</td>
                <td>2.0</td>
              </tr>
              <tr>
                <th>2</th>
                <td>2.2</td>
                <td>2.3</td>
              </tr>
              <tr>
                <th>3</th>
                <td>2.3</td>
                <td>2.8</td>
              </tr>
              <tr>
                <th>4</th>
                <td>2.5</td>
                <td>3.2</td>
              </tr>
              <tr>
                <th>5</th>
                <td>2.6</td>
                <td>3.8</td>
              </tr>
            </tbody>
          </table>
</div>
`;

const EditorDemo = () => (
    <div className="openstax-question">
        <EditableHTML html={fakeExercise} />
    </div>
);

export default EditorDemo;
