import { createClient } from 'contentful';
import parseSearch from 'utils/parseSearch';

import CONFIG from '../conf';

const query = window && parseSearch(window.location.search);
const isPreview = query && query.preview;

const ContentFulConfig = CONFIG.CONTENTFUL;

const client = createClient({
  host: isPreview ? ContentFulConfig.PREVIEW.URL : ContentFulConfig.URL,
  space: ContentFulConfig.DEFAULT.SPACE,
  accessToken: isPreview
    ? ContentFulConfig.PREVIEW.ACCESS_TOKEN
    : ContentFulConfig.DEFAULT.ACCESS_TOKEN,
});

const faqClient = createClient({
  space: ContentFulConfig.FAQ.SPACE,
  accessToken: ContentFulConfig.FAQ.ACCESS_TOKEN,
});

export { faqClient };

export default client;
