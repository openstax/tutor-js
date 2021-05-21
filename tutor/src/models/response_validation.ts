import {
    BaseModel, action, field, modelize,
} from 'shared/model';
import urlFor from '../api'

const Config = {
    url: '',
    is_enabled: false,
    is_ui_enabled: false,
};

export class ResponseValidation extends BaseModel {

    static bootstrap(config: typeof Config) {
        Object.assign(Config, config);
    }

    @field bad_word_count = 0;
    @field common_word_count = 0;
    @field computation_time = 0;
    @field domain_word_count = 0;
    @field inner_product = 0;
    @field innovation_word_count = 0;
    @field processed_response = '';
    @field remove_nonwords = false;
    @field remove_stopwords = false;
    @field response = '';
    @field spelling_correction = 'auto'
    @field spelling_correction_used = false
    @field num_spelling_correction = 0;
    @field tag_numeric = false;
    @field tag_numeric_input = 'auto';
    @field uid_found = false;
    @field uid_used = '';
    @field valid = false;

    config: typeof Config

    constructor() {
        super();
        modelize(this)
        this.config = Object.assign({}, Config);
    }

    get isEnabled() {
        return Boolean(this.config.url && this.config.is_enabled);
    }

    get isUIEnabled() {
        return Boolean(this.config.is_ui_enabled);
    }

    async validate({ response, uid = '' }: { response: string, uid?: string }) {
        if (!this.isEnabled) { return }

        const data = await this.api.request(
            urlFor('responseValidation', {}, { uid, response }, { url: this.config.url }),
            { origin: false, ignoreErrors: true },
        )
        this.onValidationComplete(data)
    }

    @action onValidationComplete(data: any) {
        this.update(data);
    }

}
