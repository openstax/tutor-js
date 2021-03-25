import {
    BaseModel, action, field,
} from 'shared/model';

const Config = {
    url: '',
    is_enabled: false,
    is_ui_enabled: false,
};

class ResponseValidation extends BaseModel {

    static bootstrap(config) {
        Object.assign(Config, config);
    }

  @field bad_word_count;
  @field common_word_count;
  @field computation_time;
  @field domain_word_count;
  @field inner_product;
  @field innovation_word_count;
  @field processed_response;
  @field remove_nonwords;
  @field remove_stopwords;
  @field response;
  @field spelling_correction;
  @field spelling_correction_used;
  @field num_spelling_correction;
  @field tag_numeric;
  @field tag_numeric_input;
  @field uid_found;
  @field uid_used;
  @field valid;

  constructor() {
      super();
      this.config = Object.assign({}, Config);
  }

  get isEnabled() {
      return Boolean(this.config.url && this.config.is_enabled);
  }

  get isUIEnabled() {
      return Boolean(this.config.is_ui_enabled);
  }

  validate({ response, uid = '' }) {
      if (!this.isEnabled) { return 'ABORT'; }

      return {
          url: this.config.url,
          query: {
              uid,
              response,
          },
      };
  }

  onFailure(error) {
      console.warn(error); // eslint-disable-line no-console
      // signal not to display error modal
      error.isRecorded = true;
  }

  @action onValidationComplete({ data }) {
      this.update(data);
  }

}

export default ResponseValidation;
