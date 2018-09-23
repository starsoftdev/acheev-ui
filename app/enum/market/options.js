import { fromJS } from 'immutable';
import DigitalMarketingIcon from 'images/sprite/digital-marketing.svg';
import WritingTranslationIcon from 'images/sprite/writing-translation.svg';
import VideoAnimationIcon from 'images/sprite/video-animation.svg';
import MusicAudioIcon from 'images/sprite/music-audio.svg';
import ProgrammingTechIcon from 'images/sprite/code-tech.svg';
import BusinessIcon from 'images/sprite/business.svg';
import FunLifestyleIcon from 'images/sprite/fun-lifestyle.svg';

import DigitalMarketingImg from 'images/category/market/digital-marketing.png';

const CATEGORY_OPTIONS = fromJS([
  {
    background: DigitalMarketingImg,
    icon: DigitalMarketingIcon,
    name: 'Graphics & Design',
    slug: 'graphics-design',
  },
  {
    background: DigitalMarketingImg,
    icon: DigitalMarketingIcon,
    name: 'Digital Marketing',
    slug: 'digital-marketing',
  },
  {
    background: DigitalMarketingImg,
    icon: WritingTranslationIcon,
    name: 'Writing & Translation',
    slug: 'writing-translation',
  },
  {
    background: DigitalMarketingImg,
    icon: VideoAnimationIcon,
    name: 'Video & Animation',
    slug: 'video-animation',
  },
  {
    background: DigitalMarketingImg,
    icon: MusicAudioIcon,
    name: 'Music & Audio',
    slug: 'music-audio',
  },
  {
    background: DigitalMarketingImg,
    icon: ProgrammingTechIcon,
    name: 'Programming & Tech',
    slug: 'programming-tech',
  },
  {
    background: DigitalMarketingImg,
    icon: BusinessIcon,
    name: 'Business',
    slug: 'business',
  },
  {
    background: DigitalMarketingImg,
    icon: FunLifestyleIcon,
    name: 'Fun & Lifestyle',
    slug: 'fun-lifestyle',
  },
]);

export default {
  CATEGORY_OPTIONS,
};
