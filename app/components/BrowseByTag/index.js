// @flow

import React, { Component } from 'react';
import { fromJS } from 'immutable';
import { generate } from 'shortid';

import BorderedTitle from 'components/BorderedTitle';

import './styles.scss';

const tags = fromJS([
  'AMA',
  'Business Development',
  'EOS',
  'Influenchers',
  'Korean',
  'Podcast',
  'Social Media',
  'UI/UX',
  'Advice',
  'Chinese',
  'Facebook marketing',
  'Infographics',
  'Linkedin Marketing',
  'Product Design',
  'Solidity',
  'Video Production',
  'Android',
  'Competitive Analysis',
  'Google Adwords',
  'Japanese',
  'Offline Events',
  'Russian',
  'Token Economics',
  'Video Reviews',
  'Branding',
  'Due Diligence',
  'iOS',
  'KYS',
  'Paid Blogging',
  'Securities Law',
  'Twitter Marketing',
  'Web Design',
]);

class BrowseByTag extends Component {
  render() {
    return (
      <div className="browseByTag">
        <div className="row">
          <div className="column">
            <BorderedTitle centered>Browse by Tag</BorderedTitle>
          </div>
        </div>
        <div className="browseByTag__tagList row">
          {tags.map(tag => (
            <div
              className="browseByTag__tag column large-3 small-12"
              key={generate()}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default BrowseByTag;
