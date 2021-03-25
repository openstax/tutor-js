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
        id: PropTypes.string.isRequired,
        data: PropTypes.array,
        series: PropTypes.array,
        fullWidth: PropTypes.bool,
        property: PropTypes.oneOf([
            PropTypes.string, PropTypes.array,
        ]),
        label: PropTypes.string,
        title: PropTypes.string.isRequired,
        onZoom: PropTypes.func,
    };

    options = {
        chart: {
            id: this.props.id,
            group: 'stats',
            stacked: false,
            toolbar: {
                autoSelected: 'zoom',
            },
            events: {
                zoomed: this.props.onZoom,
            },
        },
        plotOptions: {
            line: {
                curve: 'smooth',
            },
        },
        tooltip: {
            x: {
                format: 'MMM d, yyyy',
            },
            // z: {
            //   formatter(value, a, b) {
            //     console.log(a,b)
            //     return moment.unix(value).format('MMM Do, ’YY');
            //   },
            // },
            y: {
                formatter(value) {
                    return parseInt(value);
                },
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
        yaxis: {
            labels: { minWidth: 6 },
        },
    }

    get series() {
        return this.props.series.map(s => ({
            name: s.label || this.props.title,
            data: this.props.data.map(row => [
                row.ends_at,
                parseInt(row.stats[s.property] || 0),
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
