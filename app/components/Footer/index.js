// @flow

import * as React from 'react';
import Link from 'components/Link';
import { generate } from 'shortid';
import moment from 'moment';

import Icon from 'components/Icon';
import InstagramIcon from 'images/sprite/instagram.svg';
import TwitterIcon from 'images/sprite/twitter.svg';
import FacebookIcon from 'images/sprite/facebook.svg';
import LinkedInIcon from 'images/sprite/linkedin.svg';
import GooglePlusIcon from 'images/sprite/gplus.svg';

import './styles.scss';

const socialLinks = [
  {
    href: 'https://www.facebook.com/',
    glyph: FacebookIcon,
  },
  {
    href: 'https://twitter.com/',
    glyph: TwitterIcon,
  },
  {
    href: 'https://www.google.com/',
    glyph: GooglePlusIcon,
  },
  {
    href: 'https://www.linkedin.com/',
    glyph: LinkedInIcon,
  },
  {
    href: 'https://www.instagram.com/',
    glyph: InstagramIcon,
  },
];

const currentYear = moment().format('YYYY');

const Footer = () => (
  <div className="footer">
    <div className="footer__top">
      <div className="row">
        <div className="column large-7">
          <div className="row footer__menuContainer">
            <div className="small-6 medium-3 column">
              <ul className="footer__menu">
                <li className="footer__menuTitle">Acheev</li>
                <li>
                  <Link className="footer__menuItem" to="/">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link className="footer__menuItem" to="/">
                    Press
                  </Link>
                </li>
                <li>
                  <Link className="footer__menuItem" to="/">
                    Help
                  </Link>
                </li>
              </ul>
            </div>

            <div className="small-6 medium-3 column">
              <ul className="footer__menu">
                <li className="footer__menuTitle">Services</li>
                <li>
                  <Link className="footer__menuItem" to="/">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link className="footer__menuItem" to="/">
                    Terms of Use
                  </Link>
                </li>
                <li>
                  <Link className="footer__menuItem" to="/">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            <div className="small-6 medium-3 column">
              <ul className="footer__menu">
                <li className="footer__menuTitle">About</li>
                <li>
                  <Link className="footer__menuItem" to="/">
                    Who We Are
                  </Link>
                </li>
                <li>
                  <Link className="footer__menuItem" to="/">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link className="footer__menuItem" to="/">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            <div className="small-6 medium-3 column">
              <ul className="footer__menu">
                <li className="footer__menuTitle">Get the App</li>
                <li>
                  <Link className="footer__menuItem" to="/">
                    For Android
                  </Link>
                </li>
                <li>
                  <Link className="footer__menuItem" to="/">
                    For iOS
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer__logoContainer small-12 medium-shrink column">
          <ul className="footer__menu">
            <li className="footer__menuTitle">Find Us</li>
            <li>
              {socialLinks.map(({ href, glyph }) => (
                <a
                  className="footer__socialItem"
                  key={generate()}
                  href={href}
                  target="_blank"
                >
                  <Icon glyph={glyph} width={30} height={30} fill="white" />
                </a>
              ))}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div className="row column">
      <div className="footer__divider" />
    </div>
    <div className="footer__bottom">
      <div className="row">
        <div className="footer__copy medium-shrink column small-12">
          <span className="footer__companyName">
            &#64;
            {currentYear} Acheev Inc. All Right Reserved
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default Footer;
