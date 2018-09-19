// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import PageBanner from 'components/PageBanner';
import InvestorSignUpForm from 'components/InvestorSignUpForm';
import Icon from 'components/Icon';

import { registerInvestor } from 'containers/App/sagas';

import IconLogo from 'images/sprite/logo.svg';
import InvestorsBanner from './banner.png';
import Matei from './matei.png';
import Craig from './craig.png';
import Josh from './josh.png';
import Kl from './kl.png';
import Linkedin from './linkedin.png';

import './styles.scss';

const teams = fromJS([
  {
    name: 'Matei Olaru',
    position: 'Chief Executive Officer',
    desc:
      'Matei Olaru is the Chief Executive Officer (CEO) of Lift. A corporate lawyer and consultant by trade, Matei has been the CEO of Lift since 2016. Under his leadership, Lift has raised $4-million in private funding, tripled to more than 40 employees, and launched several key products, all in one year’s time. Previously, Matei helped advise international governments on business and investment policy as a consultant with the World Bank in Washington D.C., and practiced law on Bay Street with a focus on cannabis and corporate work. Matei is a sought-after thought leader, speaking at numerous domestic and international cannabis conferences and appearing regularly on BNN, CBC, in Forbes, the Financial Post, the Toronto Star, and Maclean’s.  Matei holds a law degree from the University of Western Ontario, and a commerce degree from the Smith School of Business at Queen’s University.',
    img: Matei,
    linkedin: 'https://www.linkedin.com/in/mateiolaru/',
  },
  {
    name: 'Craig Hudson',
    position: 'Chief Financial Officer',
    desc:
      'Craig Hudson is the Chief Financial Officer (CFO) of Lift. A Chartered Accountant (CA) and Chartered Financial Analyst (CFA), Craig joined Lift in August 2017, bringing over 17 years of finance and operations experience, most recently as Vice President of Digital Operations at Indigo (TSX: IDG), Canada’s largest book, gift, and specialty retailer. At Indigo, Craig led multiple initiatives to increase efficiencies, support growth, and drive profitability, including as Head of Indigo’s Business Intelligence teams. Previously, Craig worked for 10 years with global accounting firm KPMG, leading audits in Vancouver and London (UK), and managing over 40 financial due diligence engagements for a range of clients and industries. Craig has a Bachelor of Commerce degree from the University of British Columbia. He is also a strategic advisor for an eCommerce start-up, and has been a Board Chair and Treasurer for not-for-profits in the Toronto Arts scene.',
    img: Craig,
    linkedin: 'https://www.linkedin.com/in/craig-hudson-ca-cfa-3847968/',
  },
  {
    name: 'Kerri-Lynn McAllister',
    position: 'Chief Marketing Officer',
    desc:
      'Kerri-Lynn McAllister is the Chief Marketing Officer (CMO) of Lift. Previously, Kerri-Lynn was a member of the founding team at Ratehub.ca, Canada’s leading financial product comparison platform, serving more than five million users annually. During her tenure as CMO, Ratehub.ca secured $12-million in series A financing. Kerri-Lynn is also an early-stage investor in Zoocasa, and remains an advisor to this and other notable real-estate tech companies. A graduate of the Smith School of Business at Queen’s University, Kerri-Lynn regularly shares her insights into digital marketing and technology at conferences and meetups including the Richard Ivey School of Business, OneEleven, and Elevate Toronto.',
    img: Kl,
    linkedin: 'https://www.linkedin.com/in/klmcallister/',
  },
  {
    name: 'Josh Kerbel',
    position: 'Chief Technical Officer',
    desc:
      'Josh Kerbel is the Chief Technical Officer (CTO) of Lift. Josh brings over 15 years of entrepreneurial experience in technology and product management. Josh has worked across a range of sectors and technology domains with previous roles at Extreme Innovations, r/ally, Waygoz, and other companies with a focus on machine learning, mobile applications, and IoT. Josh has managed multiple multinational teams, raised capital for early-stage start-ups, and implemented numerous ROI-driven development processes. Josh has an MBA from the Schulich School of Business at York University, and a Bachelor of Arts from the University of Western Ontario. Josh was recently a Mentor at The Entrepreneurship Hatchery at the University of Toronto’s Faculty of Applied Science and Technology.',
    img: Josh,
    linkedin: 'https://www.linkedin.com/in/joshkerbel/',
  },
]);

type Props = {
  isLoading: boolean,
  error: string,
  registerInvestor: Function,
};

class InvestorsPage extends Component<Props> {
  render() {
    return (
      <div className="investorsPage">
        <PageBanner
          bg={InvestorsBanner}
          title="Investor Relations"
          titleLarge
          expanded
        />
        <div className="investorsPage__descPanel row column text-center">
          <h2 className="mb-md">Lift powers the modern cannabis industry</h2>
          <p>
            Lift brings media and data together to empower cannabis businesses
            and consumers with unique knowledge and insights to make
            better-informed decisions. For consumers, Lift operates
            Canada&rsquo;s largest cannabis product-comparison platform, an
            unrivalled loyalty program, and North America’s largest consumer
            cannabis tradeshows. For businesses, Lift provides unique market,
            product, and consumer insights while connecting businesses and
            consumers through Canada&rsquo;s most-adopted consumer channels.
            Together, Lift’s assets power the modern cannabis industry by
            connecting brands, consumers, and retailers all in one place.
          </p>
        </div>
        <div className="investorsPage__diagram">
          <div className="row column text-center">
            <Icon glyph={IconLogo} width="100%" height={60} />
          </div>
          <div className="row ps-relative hide-for-small-only">
            <div className="column small-12 medium-6">
              <h2 className="fs-mx text-center c-darker-gray">
                Media &amp; Product Discovery
              </h2>
            </div>
            <div className="column small-12 medium-6">
              <h2 className="fs-mx text-center c-darker-gray">
                Market Data and Insights
              </h2>
            </div>
            <div className="investorsPage__diagramVerticalLine" />
          </div>
          <div className="row hide-for-small-only">
            <div className="column small-12 medium-3 np">
              <div className="investorsPage__diagramLine investorsPage__diagramLine--left" />
            </div>
            <div className="column small-12 medium-3 np">
              <div className="investorsPage__diagramLine investorsPage__diagramLine--left" />
            </div>
            <div className="column small-12 medium-3 np">
              <div className="investorsPage__diagramLine investorsPage__diagramLine--right" />
            </div>
            <div className="column small-12 medium-3 np">
              <div className="investorsPage__diagramLine investorsPage__diagramLine--right" />
            </div>
          </div>
          <div className="row">
            <div className="column small-12 medium-3">
              <div className="investorsPage__diagramMiddleLine show-for-small-only" />
              <h2 className="fs-mx text-center c-darker-gray show-for-small-only mt-mn mb-mn">
                Media &amp; Product Discovery
              </h2>
              <div className="investorsPage__diagramMiddleLine show-for-small-only" />
              <div className="investorsPage__diagramCard">
                <h2 className="fs-xl c-secondary">Live</h2>
                <h3 className="fs-mx">Events</h3>
                <p>
                  North America&rsquo;s largest cannabis&nbsp;
                  <a href="https://liftexpo.ca/">consumer tradeshow</a> attracts
                  tens of thousands from around the globe every year. The&nbsp;
                  <a href="https://canadiancannabisawards.com/">
                    Canadian Cannabis Awards
                  </a>, made over 18M media impressions in 2017.
                </p>
              </div>
            </div>
            <div className="column small-12 medium-3">
              <div className="investorsPage__diagramMiddleLine show-for-small-only" />
              <div className="investorsPage__diagramCard">
                <h2 className="fs-xl c-secondary">Link</h2>
                <h3 className="fs-mx">Web</h3>
                <p>
                  Leading&nbsp;
                  <a href="https://lift.co/">
                    product-comparison platform and content hub
                  </a>
                  &nbsp;providing information only available at Lift.
                </p>
              </div>
              <div className="investorsPage__diagramMiddleLine show-for-small-only" />
            </div>
            <div className="column small-12 medium-3">
              <h2 className="fs-mx text-center c-darker-gray show-for-small-only mt-mn mb-mn">
                Market Data and Insights
              </h2>
              <div className="investorsPage__diagramMiddleLine show-for-small-only" />
              <div className="investorsPage__diagramCard">
                <h2 className="fs-xl c-secondary">Loyalty</h2>
                <h3 className="fs-mx">Data</h3>
                <p>
                  <a href="https://lift.co/rewards">Lift Rewards</a>,
                  Canada&rsquo;s leading loyalty program with over 70% market
                  penetration, powers loyal users and unique consumer insights
                  across Canada.
                </p>
              </div>
              <div className="investorsPage__diagramMiddleLine show-for-small-only" />
            </div>
            <div className="column small-12 medium-3">
              <div className="investorsPage__diagramCard">
                <h2 className="fs-xl c-secondary">Learn</h2>
                <h3 className="fs-mx">Retail Training</h3>
                <p>
                  Retail Staff Training designed in an exclusive collaboration
                  with MADD Canada and powers tomorrow’s retailers with
                  best-in-class content and Lift’s proprietary product insights.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="investorsPage__team">
          <div className="investorsPage__teamHeader row column text-center">
            <h2 className="mb-md">Our Team</h2>
            <p className="mb-xl">
              Lift is backed by a team of venture capital, cannabis industry
              pioneers, and Canada&rsquo;s best technology talent. Our team of
              engineers, marketers, and data scientists have built exceptional
              teams and products, and boast an impressive track record of
              success.
            </p>
          </div>
          <div className="bc-lighter-gray">
            {teams.entrySeq().map(([key, member]) => (
              <div className="row" key={key}>
                <div className="column medium-5 small-12 mb-md">
                  <img
                    src={member.get('img', '')}
                    alt={member.get('name', '')}
                  />
                </div>
                <div className="column medium-7 small-12">
                  <h2 className="fs-hg c-secondary">
                    {member.get('name', '')}
                    <a
                      className="investorsPage__linkedin"
                      href={member.get('linkedin', '')}
                      target="_blank"
                    >
                      <img
                        src={Linkedin}
                        alt={member.get('name', '')}
                        width={30}
                      />
                    </a>
                  </h2>
                  <h3 className="fs-xl">{member.get('position', '')}</h3>
                  <p>{member.get('desc', '')}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="investorsPage__form">
          <InvestorSignUpForm {...this.props} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['app', 'isLoading']),
  error: state.getIn(['app', 'error']),
});

const mapDispatchToProps = dispatch => ({
  registerInvestor: payload => dispatch(registerInvestor(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvestorsPage);
