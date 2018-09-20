import yup from 'yup';
import CONFIG from '../conf';

export const RESTART_ON_REMOUNT = '@@saga-injector/restart-on-remount';
export const DAEMON = '@@saga-injector/daemon';
export const ONCE_TILL_UNMOUNT = '@@saga-injector/once-till-unmount';

export const USERNAME_MIN_CHAR = 2;
export const USERNAME_MAX_CHAR = 30;

export const USERNAME_SCHEMA = yup
  .string()
  .min(
    USERNAME_MIN_CHAR,
    `minimum username length is ${USERNAME_MIN_CHAR} characters`
  )
  .max(
    USERNAME_MAX_CHAR,
    `max password length is ${USERNAME_MAX_CHAR} characters`
  )
  .matches(
    /^[a-zA-Z0-9 ]+$/,
    'username can be only alphanumeric and spaces, should not contain other symbols, emojis or characters in other languages'
  )
  .required();

export const API_URL = CONFIG.API.URL;
export const RECO_API_URL = CONFIG.API.RECO_URL;
export const NEWS_API_URL = CONFIG.APP.NEWS_URL;

export const REQUESTED = '_REQUESTED';
export const SUCCEDED = '_SUCCEDED';
export const STARTED = '_STARTED';
export const SKIPPED = '_SKIPPED';
export const FAILED = '_FAILED';
export const ERROR = '_ERROR';
export const CLEAR = '_CLEAR';

export const DEFAULT_LAT = 45.4215;
export const DEFAULT_LONG = -75.6972;

export const GLOBAL_SEARCH_CATEGORY_ORDER = {
  support: 1,
  strains: 2,
  oils: 3,
  accessories: 4,
  producers: 5,
  dispensaries: 6,
  doctors: 7,
  advice: 8,
  news: 9,
};

export const BUSINESS_REVIEW_FIELDS = {
  producer: [
    {
      title: 'Pricing',
      model: 'pricing',
    },
    {
      title: 'Delivery Speed',
      model: 'speedOfDelivery',
    },
    {
      title: 'Helpfulness',
      model: 'helpfulness',
    },
    {
      title: 'Ordering Process',
      model: 'orderingProcess',
    },
  ],
  doctor: [
    {
      title: 'Customer Service',
      model: 'customerService',
    },
    {
      title: 'Knowledge',
      model: 'knowledge',
    },
    {
      title: 'Wait Time',
      model: 'waitTime',
    },
    {
      title: 'Facilities',
      model: 'facilities',
    },
  ],
  dispensary: [
    {
      title: 'Customer Service',
      model: 'customerService',
    },
    {
      title: 'Knowledge',
      model: 'knowledge',
    },
    {
      title: 'Pricing',
      model: 'pricing',
    },
    {
      title: 'Product Selection',
      model: 'productSelection',
    },
  ],
};

export const MAGAZINE_REFERRER_OPTIONS = [
  {
    label: 'Cannabis Clinic',
    value: 'cannabis clinic',
  },
  {
    label: 'Doctor’s Office or Pharmacy',
    value: 'doctor’s office or pharmacy',
  },
  {
    label: 'Licensed Producer',
    value: 'licensed producer',
  },
  {
    label: 'Lift Event (CCAs, Lift Expo, etc)',
    value: 'lift event (CCAs, Lift Expo, etc)',
  },
  {
    label: 'Mailed To My Home',
    value: 'mailed to my home',
  },
];

export const CONTENT_TYPES = {
  AUTHOR: '1kUEViTN4EmGiEaaeC6ouY',
  CATEGORY: '5KMiN6YPvi42icqAUQMCQe',
  PAGE: 'page',
  POST: '2wKn6yEnZewu2SCCkus4as',
  C101HOMEPAGE: 'c101Homepage',
  C101ARTICLE: 'c101Article',
  C101CTA: 'c101Cta',
  PDF: 'pdf',
  TAG: 'tag',
};

export const RECO_PRODUCT_CATEGORY = [
  {
    type: 'strain',
    text: 'Strain',
  },
  {
    type: 'oil',
    text: 'Oil',
  },
];

export const MIN_USER_AGE = 18;

export const PROFILE_COMPLETION_TEMP = 'profile-completion-temp';
