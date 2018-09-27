import IconIndica from 'images/sprite/Icon-Indica.svg';
import IconHybrid from 'images/sprite/Icon-Hybrid.svg';
import IconSativa from 'images/sprite/Icon-Sativa.svg';
import IconOilIndica from 'images/sprite/Icon-Oil-Indica.svg';
import IconOilHybrid from 'images/sprite/Icon-Oil-Hybrid.svg';
import IconOilSativa from 'images/sprite/Icon-Oil-Sativa.svg';
import IconMorning from 'images/sprite/morning.svg';
import IconDaytime from 'images/sprite/daytime.svg';
import IconEvening from 'images/sprite/evening.svg';

const FILTER_SORT_OPTIONS = [
  {
    label: 'Most popular',
    value: '-popularity',
  },
  {
    label: 'Least popular',
    value: 'popularity',
  },
  {
    label: 'Most recent',
    value: '-createdOn',
  },
  {
    label: 'Least recent',
    value: 'createdOn',
  },
  {
    label: 'Most expensive',
    value: '-variants.price',
  },
  {
    label: 'Least expensive',
    value: 'variants.price',
  },
  {
    label: 'Highest CBD',
    value: '-cbdHigh',
  },
  {
    label: 'Highest THC',
    value: '-thcHigh',
  },
];

const BUSINESS_FILTER_SORT_OPTIONS = [
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'Highest Rated',
    value: '-rating',
  },
  {
    label: 'Lowest Rated',
    value: 'rating',
  },
];

const QUESTIONS_FILTER_SORT_OPTIONS = [
  {
    label: 'Most recent',
    value: '-createdOn',
  },
  {
    label: 'Least recent',
    value: 'createdOn',
  },
  {
    label: 'Most Answers',
    value: '-answersCount',
  },
  {
    label: 'Most Views',
    value: '-views',
  },
];

const QUESTIONS_FILTER_STATE_OPTIONS = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Open',
    value: 'open',
  },
  {
    label: 'Closed',
    value: 'closed',
  },
];

const FILTER_PROVINCE_OPTIONS = [
  {
    label: 'All Provinces',
    value: '',
    center: {
      lat: 63,
      lng: -100,
      zoom: 3,
    },
  },
  {
    label: 'Alberta',
    value: 'Alberta',
    center: {
      lat: 51.75,
      lng: -112.95,
      zoom: 6,
    },
  },
  {
    label: 'British Columbia',
    value: 'British Columbia',
    center: {
      lat: 53.56,
      lng: -125.31,
      zoom: 5,
    },
  },
  {
    label: 'Manitoba',
    value: 'Manitoba',
    center: {
      lat: 51.75,
      lng: -98.62,
      zoom: 6,
    },
  },
  {
    label: 'New Brunswick',
    value: 'New Brunswick',
    center: {
      lat: 46.48,
      lng: -66.15,
      zoom: 7,
    },
  },
  {
    label: 'Newfoundland and Labrador',
    value: 'Newfoundland and Labrador',
    center: {
      lat: 49,
      lng: -55.53,
      zoom: 6,
    },
  },
  {
    label: 'Nova Scotia',
    value: 'Nova Scotia',
    center: {
      lat: 45.12,
      lng: -63.29,
      zoom: 7,
    },
  },
  {
    label: 'Nunavut',
    value: 'Nunavut',
    center: {
      lat: 67.6,
      lng: -80.2,
      zoom: 4,
    },
  },
  {
    label: 'Northwest Territories',
    value: 'Northwest Territories',
    center: {
      lat: 64.26,
      lng: -116.87,
      zoom: 5,
    },
  },
  {
    label: 'Ontario',
    value: 'Ontario',
    center: {
      lat: 44.73,
      lng: -78.32,
      zoom: 6,
    },
  },
  {
    label: 'Prince Edward Island',
    value: 'Prince Edward Island',
    center: {
      lat: 46.46,
      lng: -63.36,
      zoom: 8,
    },
  },
  {
    label: 'Quebec',
    value: 'Quebec',
    center: {
      lat: 46.57,
      lng: -73.56,
      zoom: 7,
    },
  },
  {
    label: 'Saskatchewan',
    value: 'Saskatchewan',
    center: {
      lat: 51.75,
      lng: -105.39,
      zoom: 6,
    },
  },
  {
    label: 'Yukon',
    value: 'Yukon',
    center: {
      lat: 63.99,
      lng: -135.15,
      zoom: 5,
    },
  },
];

const CANNABIS_USAGE_PERIOD_OPTIONS = [
  {
    label: '1/2',
    value: '1/2',
  },
  {
    label: '1',
    value: '1',
  },
  {
    label: '2',
    value: '2',
  },
  {
    label: '3',
    value: '3',
  },
  {
    label: '4',
    value: '4',
  },
  {
    label: '5',
    value: '5',
  },
  {
    label: '6',
    value: '6',
  },
  {
    label: '7',
    value: '7',
  },
  {
    label: '8',
    value: '8',
  },
  {
    label: '9',
    value: '9',
  },
  {
    label: '10+',
    value: '10',
  },
];

const REVIEW_SORT_OPTIONS = [
  {
    label: 'Latest',
    value: '-createdOn',
  },
  {
    label: 'Oldest',
    value: 'createdOn',
  },
  {
    label: 'Ratings Best To Worst',
    value: '-rating',
  },
  {
    label: 'Ratings Worst To Best',
    value: 'rating',
  },
];

const REVIEW_TYPE_OPTIONS = [
  {
    label: 'Business',
    value: 'business',
  },
  {
    label: 'Product',
    value: 'product',
  },
];

const STRAIN_TYPE_OPTIONS = [
  {
    label: 'All',
    value: '',
  },
  {
    label: 'Sativa',
    value: 'sativa',
  },
  {
    label: 'Indica',
    value: 'indica',
  },
  {
    label: 'Hybrid',
    value: 'hybrid',
  },
];

const STRAIN_ICON_TYPE_OPTIONS = [
  {
    label: 'Sativa',
    value: 'sativa',
    icon: IconSativa,
  },
  {
    label: 'Indica',
    value: 'indica',
    icon: IconIndica,
  },
  {
    label: 'Hybrid',
    value: 'hybrid',
    icon: IconHybrid,
  },
];

const OIL_ICON_TYPE_OPTIONS = [
  {
    label: 'Sativa',
    value: 'sativa',
    icon: IconOilSativa,
  },
  {
    label: 'Indica',
    value: 'indica',
    icon: IconOilIndica,
  },
  {
    label: 'Hybrid',
    value: 'hybrid',
    icon: IconOilHybrid,
  },
];

const RATING_OPTIONS = ['5', '4', '3', '2', '1'];

const STRAIN_ICON_TIME_OPTIONS = [
  {
    label: 'Morning',
    value: 'morning',
    icon: IconMorning,
  },
  {
    label: 'Daytime',
    value: 'daytime',
    icon: IconDaytime,
  },
  {
    label: 'Evening',
    value: 'evening',
    icon: IconEvening,
  },
];

const MONTH_OPTIONS = [
  {
    label: 'Jan',
    value: '1',
  },
  {
    label: 'Feb',
    value: '2',
  },
  {
    label: 'Mar',
    value: '3',
  },
  {
    label: 'Apr',
    value: '4',
  },
  {
    label: 'May',
    value: '5',
  },
  {
    label: 'Jun',
    value: '6',
  },
  {
    label: 'Jul',
    value: '7',
  },
  {
    label: 'Aug',
    value: '8',
  },
  {
    label: 'Sep',
    value: '9',
  },
  {
    label: 'Oct',
    value: '10',
  },
  {
    label: 'Nov',
    value: '11',
  },
  {
    label: 'Dec',
    value: '12',
  },
];

const CATEGORY_OPTIONS = [
  {
    label: 'GRAPHICS & DESIGN',
    value: 'graphics-design',
  },
  {
    label: 'DIGITAL MARKETING',
    value: 'digital-marketing',
  },
  {
    label: 'WRITING & TRANSLATION',
    value: 'writing-translation',
  },
  {
    label: 'MUSIC & AUDIO',
    value: 'music-audio',
  },
  {
    label: 'PROGRAMMING & TECH',
    value: 'programming-tech',
  },
  {
    label: 'BUSINESS',
    value: 'business',
  },
  {
    label: 'VIDEO & ANIMATION',
    value: 'video-animation',
  },
  {
    label: 'FUN & LIFESTYLE',
    value: 'fun-lifestyle',
  },
];

const FILTER_SHOW_OPTIONS = [8, 16, 32];
const PRODUCT_FILTER_SHOW_OPTIONS = [9, 12, 15];

export default {
  FILTER_SORT_OPTIONS,
  BUSINESS_FILTER_SORT_OPTIONS,
  QUESTIONS_FILTER_SORT_OPTIONS,
  QUESTIONS_FILTER_STATE_OPTIONS,
  FILTER_PROVINCE_OPTIONS,
  CANNABIS_USAGE_PERIOD_OPTIONS,
  REVIEW_SORT_OPTIONS,
  REVIEW_TYPE_OPTIONS,
  STRAIN_TYPE_OPTIONS,
  STRAIN_ICON_TYPE_OPTIONS,
  OIL_ICON_TYPE_OPTIONS,
  RATING_OPTIONS,
  STRAIN_ICON_TIME_OPTIONS,
  MONTH_OPTIONS,
  FILTER_SHOW_OPTIONS,
  PRODUCT_FILTER_SHOW_OPTIONS,
  CATEGORY_OPTIONS,
};
