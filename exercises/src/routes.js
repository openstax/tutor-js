import { merge } from 'lodash';
import { APIHandler, APIActionAdapter } from 'shared';
import Search from './models/search';

const baseUrl = `${window.location.origin}/api`;

const handler = new APIHandler({
  xhr: {
    baseURL: baseUrl,
  },
});

const Adapter = APIActionAdapter(handler);

const {
  connectModelCreate, connectModelRead, connectModelUpdate, connectModelDelete
} = Adapter;


const startAPI = () => {

  connectModelRead(Search, 'perform', { onSuccess: 'onComplete', pattern: 'exercises' });

};

export { startAPI };
