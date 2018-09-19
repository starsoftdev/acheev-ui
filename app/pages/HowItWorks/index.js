// @flow

import React, { Component } from 'react';
import { fromJS } from 'immutable';
import { generate } from 'shortid';

import Breadcrumbs from 'components/Breadcrumbs';
import BorderedTitle from 'components/BorderedTitle';
import PageBanner from 'components/PageBanner';
import Button from 'components/Button';
import Panel from 'components/Panel';
import Icon from 'components/Icon';
import Link from 'components/Link';

import DoctorImg from 'images/sprite/doctor.svg';
import ProducerImg from 'images/sprite/producer.svg';
import AccessoryImg from 'images/sprite/vape.svg';
import NewsImg from 'images/sprite/news.svg';
import QuestionImg from 'images/sprite/question.svg';
import EventImg from 'images/sprite/event.svg';

import Banner from './banner.jpg';
import SignUpImg from './sign-up.jpg';
import ReviewImg from './review.jpg';
import UnlockImg from './unlock.jpg';

const features: Array<Object> = [
  {
    img: DoctorImg,
    text: 'Locate a doctor',
    link: '/clinics',
  },
  {
    img: AccessoryImg,
    text: 'Explore accessories',
    link: '/accessories',
  },
  {
    img: ProducerImg,
    text: 'Choose the right Licensed Producer',
    link: '/producers',
  },
  {
    img: NewsImg,
    text: 'Read the latest cannabis news',
    link: 'https://news.lift.co/',
  },
  {
    img: QuestionImg,
    text: 'Ask questions in our forum',
    link: '/forum',
  },
  {
    img: EventImg,
    text: 'Find cannabis events in your area',
    link: 'https://events.lift.co/',
  },
];

class HowItWorksPage extends Component<{}> {
  render() {
    const breadcrumbPath = fromJS([
      {
        title: 'How it works',
      },
    ]);
    return (
      <div>
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          bg={Banner}
          title="How it works"
          titleLarge
          subtitle="Cannabis is complicated. Lift makes it simple."
          bottomComponent={
            <Button
              className="secondary semiSpacious"
              element={Link}
              to="/register"
            >
              Sign Up Now
            </Button>
          }
          expanded
        />
        <div className="row align-middle mb-xl">
          <div className="small-order-2 small-12 large-order-1 large-shrink column text-center">
            <img alt="" src={SignUpImg} role="banner" />
          </div>
          <div className="small-order-1 large-order-2 column pl-lg">
            <BorderedTitle>Sign up</BorderedTitle>
            <p>
              By registering on Lift, you’ll enjoy unlimited access to Canada’s
              largest database of cannabis product reviews left by medical
              patients. Explore strains, oils and accessories to find the right
              product for your condition. Plus, we’ll offer you bonus Lift
              Points just for signing up and completing your profile! &nbsp;
              <Link to="/register" className="fs-base t-nt">
                Sign up.
              </Link>
            </p>
          </div>
        </div>

        <div className="row align-middle mb-xl">
          <div className="column pl-lg">
            <BorderedTitle>Lift Points</BorderedTitle>
            <p>
              Points can be used towards great cannabis rewards, including
              prescription cannabis itself*. Earn points by writing product
              reviews, completing short surveys or attending Lift events. The
              more points you earn, the more perks you can access. At the same
              time, you’ll be actively contributing to the cannabis community,
              and helping other patients find their ideal strains. &nbsp;
              <Link to="/create-review" className="fs-base t-nt">
                Leave a review.
              </Link>
            </p>
          </div>
          <div className="small-12 large-shrink column text-center">
            <img alt="" src={ReviewImg} role="banner" />
          </div>
        </div>

        <div className="row align-middle mb-hg pb-xl has-b-b">
          <div className="small-order-2 small-12 large-order-1 large-shrink column text-center">
            <img alt="" src={UnlockImg} role="banner" />
          </div>
          <div className="small-order-1 large-order-2 column pl-lg pr-lg">
            <BorderedTitle>Unlock Lift Rewards</BorderedTitle>
            <p>
              Lift Rewards is Canada’s most comprehensive cannabis loyalty
              program. Your points can be redeemed on amazing rewards, including
              discounts on medical cannabis, accessories and events, with more
              new perks added regularly.Lift Rewards is Canada’s most
              comprehensive cannabis loyalty program. Your points can be
              redeemed on amazing rewards, including discounts on medical
              cannabis, accessories and events, with more new perks added
              regularly. &nbsp;
              <Link to="/rewards" className="fs-base t-nt">
                Explore your rewards.
              </Link>
            </p>
          </div>
          <div className="small-order-3 small-12 column text-center mt-md">
            <p>
              *Available to prescription-holding patients at participating
              licensed producers.
            </p>
          </div>
        </div>

        <div className="row column">
          <BorderedTitle centered>Other Features</BorderedTitle>
        </div>
        <div className="row mb-xl">
          {features.map(item => (
            <Link
              className="small-12 medium-6 column mb-mn c-inherit td-n"
              key={generate()}
              to={item.link}
            >
              <div className="row align-middle">
                <div className="shrink column npr">
                  <Icon glyph={item.img} size={30} />
                </div>
                <div className="column">
                  <h5 className="nm">
                    <strong>{item.text}</strong>
                  </h5>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <Panel theme="dark">
          <div className="row">
            <div className="small-12 large-shrink column">
              <h3>
                Are you a cannabis business looking to raise your brand’s
                profile?
              </h3>
            </div>
            <div className="shrink column">
              <Button className="secondary semiSpacious">
                <a className="contactLink" href="mailto:hello@lift.co">
                  Contact us
                </a>
              </Button>
            </div>
          </div>
        </Panel>
      </div>
    );
  }
}

export default HowItWorksPage;
