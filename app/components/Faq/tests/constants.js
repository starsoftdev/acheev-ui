import { fromJS } from 'immutable';
import IconBeginner from 'images/sprite/Beginner.svg';
import IconCommunity from 'images/sprite/Community.svg';
import IconEvents from 'images/sprite/Events.svg';
import IconInfo from 'images/sprite/Info.svg';
import IconLiftPoints from 'images/sprite/LiftPoints.svg';
import IconMedia from 'images/sprite/Media.svg';
import IconNavigate from 'images/sprite/Navigate.svg';
import IconResource from 'images/sprite/Resource.svg';
import IconReviews from 'images/sprite/Reviews.svg';
import IconTraining from 'images/sprite/Training.svg';

export const FAQ_TOPICS = fromJS([
  {
    label: 'Lift Explained',
    value: 'explained',
    icon: IconInfo,
  },
  {
    label: 'Lift Events',
    value: 'events',
    icon: IconEvents,
  },
  {
    label: 'Cannabis for beginners',
    value: 'beginners',
    icon: IconBeginner,
  },
  {
    label: 'Lift Rewards Points',
    value: 'rewards',
    icon: IconLiftPoints,
  },
  {
    label: 'Site Navigation',
    value: 'navigation',
    icon: IconNavigate,
  },
  {
    label: 'Lift Reviews',
    value: 'reviews',
    icon: IconReviews,
  },
  {
    label: 'Lift Community',
    value: 'community',
    icon: IconCommunity,
  },
  {
    label: 'Lift Retail Training Course',
    value: 'training',
    icon: IconTraining,
  },
  {
    label: 'Lift Media',
    value: 'media',
    icon: IconMedia,
  },
  {
    label: 'Lift Resource Centers',
    value: 'resource',
    icon: IconResource,
  },
]);

export const FAQ_QUESTIONS = fromJS([
  {
    question: 'How do reviews benefit me and the rest of the community?',
    answer:
      "By writing reviews, you earn Lift Points that can be put towards a discount on a future purchase of medical cannabis, as well as accessories available through our Lift Store or other Lift Rewards. A review can also be featured in our Reviews of the Week (hyperlink), earning bonus points. By sharing your experiences with medical cannabis, you're directly helping other patients choose the right products for their own symptom relief.",
    topic: 'explained',
    section: 'lift_community',
  },
  {
    question: 'Question 2',
    answer:
      "By writing reviews, you earn Lift Points that can be put towards a discount on a future purchase of medical cannabis, as well as accessories available through our Lift Store or other Lift Rewards. A review can also be featured in our Reviews of the Week (hyperlink), earning bonus points. By sharing your experiences with medical cannabis, you're directly helping other patients choose the right products for their own symptom relief.",
    topic: 'explained',
    section: 'lift_community',
  },
]);

export const FAQ_SECTION = fromJS({
  label: 'Lift Community',
  value: 'lift_community',
});

export const FAQ_SECTIONS = fromJS([
  {
    label: 'Lift Community',
    value: 'lift_community',
  },
  {
    label: 'Accounts',
    value: 'accounts',
  },
  {
    label: 'User conduct rules',
    value: 'user_contact_rules',
  },
]);
