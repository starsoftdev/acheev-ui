// @flow

import * as React from 'react';
import Link from 'components/Link';
import { generate } from 'shortid';
import moment from 'moment';

import Icon from 'components/Icon';
import Logo from 'images/sprite/logo-white.svg';
import InstagramIcon from 'images/sprite/instagram.svg';
import TwitterIcon from 'images/sprite/twitter.svg';
import FacebookIcon from 'images/sprite/facebook.svg';
import './styles.scss';

const socialLinks = [
  {
    href: 'https://www.instagram.com/liftandco',
    glyph: InstagramIcon,
  },
  {
    href: 'https://twitter.com/liftandco',
    glyph: TwitterIcon,
  },
  {
    href: 'https://www.facebook.com/liftcann',
    glyph: FacebookIcon,
  },
];

const currentYear = moment().format('YYYY');

const Footer = () => (
  <div className="footer">
    <div className="footer__top">
      <div className="row">
        <div className="footer__logoContainer small-12 medium-shrink column">
          <div className="row">
            <div className="column medium-12">
              <Icon
                glyph={Logo}
                width={100}
                height={35}
                className="footer__logo"
              />
            </div>
            <div className="column medium-12">
              {socialLinks.map(({ href, glyph }) => (
                <a
                  className="footer__socialItem"
                  key={generate()}
                  href={href}
                  target="_blank"
                >
                  <Icon glyph={glyph} width={18} height={18} fill="white" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="column">
          <div className="row footer__menuContainer">
            <div className="small-6 medium-shrink column">
              <ul className="footer__menu">
                <li className="footer__menuTitle">Products</li>
                <li>
                  <Link className="footer__menuItem" to="/strains">
                    Explore Strains
                  </Link>
                </li>
                <li>
                  <Link className="footer__menuItem" to="/oils">
                    Explore Oils
                  </Link>
                </li>
              </ul>
            </div>

            <div className="small-6 medium-shrink column">
              <ul className="footer__menu">
                <li className="footer__menuTitle">Businesses</li>
                <li>
                  <Link className="footer__menuItem" to="/clinics">
                    Clinics
                  </Link>
                </li>
                <li>
                  <Link className="footer__menuItem" to="/producers">
                    Producers
                  </Link>
                </li>
                <li>
                  <a
                    className="footer__menuItem"
                    href="https://liftexpo.ca/"
                    target="_blank"
                  >
                    Events
                  </a>
                </li>
              </ul>
            </div>

            <div className="small-6 medium-shrink column">
              <ul className="footer__menu">
                <li className="footer__menuTitle">Features</li>
                <li>
                  <Link className="footer__menuItem" to="/magazine">
                    Magazine
                  </Link>
                </li>
                <li>
                  <Link className="footer__menuItem" to="/rewards">
                    Lift Rewards
                  </Link>
                </li>
                <li>
                  <Link className="footer__menuItem" to="/faq">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link className="footer__menuItem" to="/forum">
                    Forum
                  </Link>
                </li>
                <li>
                  <Link className="footer__menuItem" to="/patient-guide">
                    Patient Guide
                  </Link>
                </li>
              </ul>
            </div>

            <div className="small-6 medium-shrink column">
              <ul className="footer__menu">
                <li className="footer__menuTitle">Company</li>
                <li>
                  <a
                    className="footer__menuItem"
                    href="https://home.lift.co/about-us"
                    target="_blank"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    className="footer__menuItem"
                    href="https://jobs.lift.co"
                    target="_blank"
                  >
                    Jobs
                  </a>
                </li>
                <li className="footer__menuTitle mt-md">For Business</li>
                <li>
                  <a className="footer__menuItem" href="https://lift.co/lp">
                    LP Login/Sign Up
                  </a>
                </li>
                <li>
                  <a className="footer__menuItem" href="http://retail.lift.co">
                    Retail Solutions
                  </a>
                </li>
              </ul>
            </div>

            <div className="small-6 medium-shrink column show-for-small-only">
              <ul className="footer__menu">
                <li className="footer__menuButton footer__menuButton--white">
                  <Link className="c-secondary" to="/register">
                    Join
                  </Link>
                </li>
              </ul>
            </div>

            <div className="small-6 medium-shrink column show-for-small-only">
              <ul className="footer__menu">
                <li className="footer__menuButton">
                  <Link to="/login">Login</Link>
                </li>
              </ul>
            </div>

            <div className="small-12 medium-6 medium-shrink column hide-for-small-only">
              <ul className="footer__menu">
                <li className="footer__menuButton footer__menuButton--white">
                  <Link className="" to="/register">
                    Join
                  </Link>
                </li>
                <li className="footer__menuButton">
                  <Link to="/login">Login</Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="footer__note">
      <div className="row">
        <div className="column small-12 c-white">
          Important Notice: Content on this website is intended strictly for
          informational purposes and may only be used by medical cannabis
          patients with a valid medical document. By accessing this website, you
          confirm that you are a medical cannabis patient with a valid medical
          document. Lift does not promote any product or represent that the
          products mentioned on Lift&apos;s website are treatment for any kind
          of medical condition. Lift cannot guarantee that information provided
          is error-free or complete and is not responsible for the quality of
          the information provided by users. Lift does not endorse any user
          reported information, any particular strain, product, producer,
          organization, treatment or therapy. Lift does not make representations
          regarding the use of cannabis and does not provide any of its own
          views on the use of cannabis, its benefits, or promotes its use.
        </div>
      </div>
    </div>
    <div className="footer__bottom">
      <div className="row">
        <div className="footer__copy column">
          <span className="footer__copy--item c-white td-n">
            37 Bulwer St, Toronto, ON M5T 1A1
          </span>
          <span>&nbsp;|&nbsp;</span>
          <a
            href="mailto:hello@lift.co"
            className="footer__copy--item c-white td-n"
          >
            hello@lift.co
          </a>
          <span>&nbsp;|&nbsp;</span>
          <span className="footer__copy--item">
            <Link className="footer__terms" to="/privacy">
              Privacy Policy
            </Link>
          </span>
          <span>&nbsp;|&nbsp;</span>
          <span className="footer__copy--item">
            <Link className="footer__terms" to="/terms-and-conditions">
              Terms And Conditions
            </Link>
          </span>
        </div>
        <div className="footer__copy medium-shrink column small-12">
          <span className="footer__companyName">
            &#64;
            {currentYear} LIFT CO. LTD
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
