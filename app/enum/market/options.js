import { fromJS } from 'immutable';
import DesignIcon from 'images/sprite/graphics-design.svg';
import DigitalMarketingIcon from 'images/sprite/digital-marketing.svg';
import WritingTranslationIcon from 'images/sprite/writing-translation.svg';
import VideoAnimationIcon from 'images/sprite/video-animation.svg';
import MusicAudioIcon from 'images/sprite/music-audio.svg';
import ProgrammingTechIcon from 'images/sprite/code-tech.svg';
import BusinessIcon from 'images/sprite/business.svg';
import FunLifestyleIcon from 'images/sprite/fun-lifestyle.svg';

import GraphicsDesignImg from 'images/category/market/design.png';
import DigitalMarketingImg from 'images/category/market/digital-marketing.png';
import WritingTranslationImg from 'images/category/market/writing.png';
import VideoAnimationImg from 'images/category/market/video.png';
import MusicAudioImg from 'images/category/market/music-audio.png';
import ProgrammingTechImg from 'images/category/market/programming.png';
import BusinessImg from 'images/category/market/business.png';
import FunLifestyleImg from 'images/category/market/fun-lifestyle.png';

const CATEGORY_OPTIONS = fromJS([
  {
    background: GraphicsDesignImg,
    icon: DesignIcon,
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
    background: WritingTranslationImg,
    icon: WritingTranslationIcon,
    name: 'Writing & Translation',
    slug: 'writing-translation',
  },
  {
    background: VideoAnimationImg,
    icon: VideoAnimationIcon,
    name: 'Video & Animation',
    slug: 'video-animation',
  },
  {
    background: MusicAudioImg,
    icon: MusicAudioIcon,
    name: 'Music & Audio',
    slug: 'music-audio',
  },
  {
    background: ProgrammingTechImg,
    icon: ProgrammingTechIcon,
    name: 'Programming & Tech',
    slug: 'programming-tech',
  },
  {
    background: BusinessImg,
    icon: BusinessIcon,
    name: 'Business',
    slug: 'business',
  },
  {
    background: FunLifestyleImg,
    icon: FunLifestyleIcon,
    name: 'Fun & Lifestyle',
    slug: 'fun-lifestyle',
  },
]);

export default {
  CATEGORY_OPTIONS,
};
