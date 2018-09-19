const MAIN_MENU_ITEMS = [
  {
    text: 'Products',
    children: [
      {
        text: 'Explore Strains',
        link: '/strains',
      },
      {
        text: 'Explore Oils',
        link: '/oils',
      },
    ],
  },
  {
    text: 'Businesses',
    children: [
      {
        text: 'Clinics',
        link: '/clinics',
      },
      {
        text: 'Producers',
        link: '/producers',
      },
    ],
  },
  {
    text: 'Reviews',
    children: [
      {
        text: 'Write a review',
        link: '/create-review',
      },
      {
        text: 'Read reviews',
        link: '/reviews',
      },
    ],
  },
  {
    text: 'Rewards',
    link: '/rewards',
  },
  {
    text: 'Magazine',
    link: '/magazine',
  },
  {
    text: 'Learn',
    link: '/cannabis-101',
  },
];

const LP_MENU_ITEMS = [
  {
    text: 'Overview',
    link: '/lp',
    exact: true,
  },
  {
    text: 'Reviews',
    link: '/lp/reviews',
  },
  {
    text: 'Insights',
    link: '/lp/demographics',
  },
  {
    text: 'Products',
    link: '/lp/products',
  },
  {
    text: 'Profile',
    link: '/lp/profile',
  },
];

const LP_MENU_REVIEWS_ITEMS = [
  {
    text: 'Strains',
    link: '/lp/reviews/strains',
  },
  {
    text: 'Oils',
    link: '/lp/reviews/oils',
  },
  {
    text: 'Business',
    link: '/lp/reviews/business',
  },
];

export default {
  MAIN_MENU_ITEMS,
  LP_MENU_ITEMS,
  LP_MENU_REVIEWS_ITEMS,
};
