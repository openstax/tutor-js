import { React, PropTypes, observer, computed, modelize } from 'vendor';
import { ArbitraryHtmlAndMath } from 'shared';


@observer
class QuestionPreview extends React.Component {
    static propTypes = {
        className: PropTypes.string,
        question: PropTypes.object.isRequired,
    }

    constructor(props) {
        super(props);
        modelize(this);
    }

    @computed get html() {
        const content = document.createElement('span');
        content.innerHTML = this.props.question.stem_html;
        Array.from(content.querySelectorAll('img,iframe')).forEach((el) => {
            if (el.nextSibling) {
                el.remove();
            } else {
                if (el.parentElement) el.parentElement.remove();
            }
        });
        return content.innerHTML;
    }

    render() {
        return <ArbitraryHtmlAndMath html={this.html} className={this.props.className} />;
    }
}

export default QuestionPreview;
