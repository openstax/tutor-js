import { React, PropTypes, styled } from 'vendor';
import ApexChart from 'react-apexcharts';

const ChartWrapper = styled.div`
  margin-top: 1rem;
  .apexcharts-title-text {
    font-weight: bolder;
  }
  flex: 1;
  min-width: 300px;
  flex-basis: ${props => props.fullWidth ? '100%' : '50%'};
`;

export default
class Chart extends React.Component {

  static propTypes = {
    data: PropTypes.array,
    series: PropTypes.array,
    fullWidth: PropTypes.bool,
    property: PropTypes.oneOf([
      PropTypes.string, PropTypes.array,
    ]),
    label: PropTypes.string,
    title: PropTypes.string.isRequired,
  };


  options = {
    chart: {
      stacked: false,
      zoom: {
        type: 'x',
        enabled: true,
        autoScaleYaxis: true,
      },
      toolbar: {
        autoSelected: 'zoom',
      },
    },
    plotOptions: {
      line: {
        curve: 'smooth',
      },
    },
    dataLabels: {
      enabled: false,
    },
    title: {
      text: this.props.title,
      align: 'center',
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100],
      },
    },
    xaxis: {
      type: 'datetime',
    },
  }

  get series() {
    return this.props.series.map(s => ({
      name: s.label || this.props.title,
      data: this.props.data.map(row => [
        row.ends_at,
        row.stats[s.property],
      ]),
    }));
  }

  render() {
    return (
      <ChartWrapper fullWidth={this.props.fullWidth}>
        <ApexChart
          options={this.options}
          series={this.series}
          type="area"
          height="350"
        />
      </ChartWrapper>
    );
  }
}
