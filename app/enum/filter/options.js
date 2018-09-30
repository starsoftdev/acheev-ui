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
    sub_cat: [
      {
        label: 'Logo Design',
        value: 'logo-design',
      },
      {
        label: 'Business Cards & Stationery',
        value: 'business-cards-and-stationery',
      },
      {
        label: 'Illustration',
        value: 'illustration',
      },
      {
        label: 'Cartoons & Caricatures',
        value: 'cartoons-caricatures',
      },
      {
        label: 'Flyers & Posters',
        value: 'flyers-posters',
      },
      {
        label: 'Book Covers & Packaging',
        value: 'book-covers-packaging',
      },
      {
        label: 'Web & Mobile Design',
        value: 'web-mobile-design',
      },
      {
        label: 'Social Media Design',
        value: 'social-media-design',
      },
      {
        label: 'Banner Ads',
        value: 'banner-ads',
      },
      {
        label: 'Photoshop Editing',
        value: 'photoshop-editing',
      },
      {
        label: '3D & 2D Models',
        value: '3D-2D-models',
      },
      {
        label: 'T-Shirts',
        value: 't-shirts',
      },
      {
        label: 'Infographics',
        value: 'infographics',
      },
      {
        label: 'Invitations',
        value: 'invitations',
      },
    ],
  },
  {
    label: 'DIGITAL MARKETING',
    value: 'digital-marketing',
    sub_cat: [
      {
        label: 'Social Media Marketing',
        value: 'social-media-marketing',
      },
      {
        label: 'Email Marketing',
        value: 'email-marketing',
      },
      {
        label: 'SEO',
        value: 'SEO',
      },
      {
        label: 'Content Marketing',
        value: 'content-marketing',
      },
      {
        label: 'Video Marketing',
        value: 'video-marketing',
      },
      {
        label: 'Web Analytics',
        value: 'web-analytics',
      },
      {
        label: 'Local Listings',
        value: 'local-listings',
      },
      {
        label: 'Domain Research',
        value: 'domain-research',
      },
      {
        label: 'Search & Display Marketing',
        value: 'search-display-marketing',
      },
      {
        label: 'Marketing Strategy',
        value: 'marketing-strategy',
      },
      {
        label: 'E-commerce Marketing',
        value: 'e-commerce-marketing',
      },
      {
        label: 'Influencer Marketing',
        value: 'influencer-marketing',
      },
      {
        label: 'Web Traffic',
        value: 'web-traffic',
      },
      {
        label: 'Mobile Advertising',
        value: 'mobile-advertising',
      },
      {
        label: 'Music Promotion',
        value: 'music-promotion',
      },
    ],
  },
  {
    label: 'WRITING & TRANSLATION',
    value: 'writing-translation',
    sub_cat: [
      {
        label: 'Articles & Blog Posts',
        value: 'articles-blog-posts',
      },
      {
        label: 'Business Copywriting',
        value: 'business-copywriting',
      },
      {
        label: 'Research & Summaries',
        value: 'research-summaries',
      },
      {
        label: 'Translation',
        value: 'translation',
      },
      {
        label: 'Creative Writing',
        value: 'creative-writing',
      },
      {
        label: 'Proofreading & Editing',
        value: 'proofreading-editing',
      },
      {
        label: 'Press Releases',
        value: 'press-releases',
      },
      {
        label: 'Transcription',
        value: 'transcription',
      },
      {
        label: 'Legal Writing',
        value: 'legal-writing',
      },
    ],
  },
  {
    label: 'MUSIC & AUDIO',
    value: 'music-audio',
    sub_cat: [
      {
        label: 'Voice Over',
        value: 'voice-over',
      },
      {
        label: 'Mixing & Mastering',
        value: 'mixing-mastering',
      },
      {
        label: 'Producers & Composers',
        value: 'producers-composers',
      },
      {
        label: 'Singer Songwriters',
        value: 'singer-songwriters',
      },
      {
        label: 'Session Musicians & Singers',
        value: 'session-musicians-singers',
      },
      {
        label: 'Jingles & Drops',
        value: 'jingles-drops',
      },
      {
        label: 'Sound Effects',
        value: 'Sound-effects',
      },
    ],
  },
  {
    label: 'PROGRAMMING & TECH',
    value: 'programming-tech',
    sub_cat: [
      {
        label: 'Wordpress',
        value: 'Wordpress',
      },
      {
        label: 'Web Programming',
        value: 'web-programming',
      },
      {
        label: 'Ecommerce',
        value: 'ecommerce',
      },
      {
        label: 'Mobile Apps & Web',
        value: 'mobile-apps-web',
      },
      {
        label: 'Website Builders & CMS',
        value: 'website-builders-cms',
      },
      {
        label: 'Desktop Applications',
        value: 'desktop-applications',
      },
      {
        label: 'Data Analytics & Reports',
        value: 'data-analytics-reports',
      },
      {
        label: 'Convert Files',
        value: 'convert-files',
      },
      {
        label: 'Support & IT',
        value: 'support-it',
      },
      {
        label: 'Chatbots',
        value: 'chatbots',
      },
      {
        label: 'Databases',
        value: 'databases',
      },
      {
        label: 'User Testing',
        value: 'user-testing',
      },
      {
        label: 'QA',
        value: 'qa',
      },
    ],
  },
  {
    label: 'BUSINESS',
    value: 'business',
    sub_cat: [
      {
        label: 'Virtual Assistant',
        value: 'virtual-assistant',
      },
      {
        label: 'Market Research',
        value: 'market-research',
      },
      {
        label: 'Business Plans',
        value: 'business-plans',
      },
      {
        label: 'Branding Services',
        value: 'branding-services',
      },
      {
        label: 'Legal Consulting',
        value: 'legal-consulting',
      },
      {
        label: 'Financial Consulting',
        value: 'financial-consulting',
      },
      {
        label: 'Business Tips',
        value: 'business-tips',
      },
      {
        label: 'Presentations',
        value: 'presentations',
      },
      {
        label: 'Career Advice',
        value: 'career-advice',
      },
      {
        label: 'Flyer Distribution',
        value: 'flyer-distribution',
      },
    ],
  },
  {
    label: 'VIDEO & ANIMATION',
    value: 'video-animation',
    sub_cat: [
      {
        label: 'Whiteboard & Animated Explainers',
        value: 'whiteboard-animated-explainers',
      },
      {
        label: 'Intros & Animated Logos',
        value: 'intros-animated-logos',
      },
      {
        label: 'Promotional Videos',
        value: 'promotional-videos',
      },
      {
        label: 'Live Action Explainers',
        value: 'live-action-explainers',
      },
      {
        label: 'Short Video Ads',
        value: 'short-video-ads',
      },
      {
        label: 'Spokesperson Videos',
        value: 'spokesperson-videos',
      },
      {
        label: 'Editing & Post Production',
        value: 'editing-post-production',
      },
      {
        label: 'Lyric & Music Videos',
        value: 'lyric-music-videos',
      },
      {
        label: 'Animated Characters & Modeling',
        value: 'animated-characters-modeling',
      },
    ],
  },
  {
    label: 'FUN & LIFESTYLE',
    value: 'fun-lifestyle',
    sub_cat: [
      {
        label: 'Online Lessons',
        value: 'online-lessons',
      },
      {
        label: 'Arts & Crafts',
        value: 'arts-crafts',
      },
      {
        label: 'Relationship Advice',
        value: 'relationship-advice',
      },
      {
        label: 'Health, Nutrition & Fitness',
        value: 'health-nutrition-fitness',
      },
      {
        label: 'Astrology & Readings',
        value: 'astrology-readings',
      },
      {
        label: 'Spritual & Healing',
        value: 'spritual-healing',
      },
      {
        label: 'Family & Genealogy',
        value: 'family-genealogy',
      },
      {
        label: 'Collectibles',
        value: 'collectibles',
      },
      {
        label: 'Greeting Cards & Videos',
        value: 'greeting-cards-videos',
      },
      {
        label: 'Virtual Videos',
        value: 'virtual-videos',
      },
      {
        label: 'Pranks & Stunts',
        value: 'pranks-stunts',
      },
      {
        label: 'Gaming',
        value: 'gaming',
      },
      {
        label: 'Global Culture',
        value: 'global-culture',
      },
    ],
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
