// @flow

import * as React from 'react';
import { generate } from 'shortid';

import BorderedTitle from 'components/BorderedTitle';

import Matei from 'images/headshots/matei.jpg';
import MateiAnimated from 'images/headshots/matei.gif';
import Tyler from 'images/headshots/tyler.jpg';
import TylerAnimated from 'images/headshots/tyler.gif';
import Nicole from 'images/headshots/nicole.jpg';
import NicoleAnimated from 'images/headshots/nicole.gif';
import Nick from 'images/headshots/nick.jpg';
import NickAnimated from 'images/headshots/nick.gif';
import Derek from 'images/headshots/derek.jpg';
import DerekAnimated from 'images/headshots/derek.gif';
import Yan from 'images/headshots/yan.jpg';
import YanAnimated from 'images/headshots/yan.gif';
import Kayla from 'images/headshots/kayla.jpg';
import KaylaAnimated from 'images/headshots/kayla.gif';
import Dan from 'images/headshots/dan.jpg';
import DanAnimated from 'images/headshots/dan.gif';
import Craig from 'images/headshots/craig.jpg';
import CraigAnimated from 'images/headshots/craig.gif';
import DanLam from 'images/headshots/dan-lam.jpg';
import DanLamAnimated from 'images/headshots/dan-lam.gif';
import Ben from 'images/headshots/ben.jpg';
import BenAnimated from 'images/headshots/ben.gif';
import Mark from 'images/headshots/mark.jpg';
import MarkAnimated from 'images/headshots/mark.gif';
import Kerri from 'images/headshots/kerri.jpg';
import KerriAnimated from 'images/headshots/kerri.gif';
import Josh from 'images/headshots/josh.jpg';
import JoshAnimated from 'images/headshots/josh.gif';
import Danielle from 'images/headshots/danielle.jpg';
import DanielleAnimated from 'images/headshots/danielle.gif';
import Dylan from 'images/headshots/dylan.jpg';
import DylanAnimated from 'images/headshots/dylan.gif';
import Keesha from 'images/headshots/keesha.jpg';
import KeeshaAnimated from 'images/headshots/keesha.gif';
import Kim from 'images/headshots/kim.jpg';
import KimAnimated from 'images/headshots/kim.gif';
import Kate from 'images/headshots/kate.png';
import KateAnimated from 'images/headshots/kate.gif';
import KaylaReyes from 'images/headshots/kayla-reyes.png';
import KaylaReyesAnimated from 'images/headshots/kayla-reyes.gif';

import './styles.scss';

const teamMembers: Array<Object> = [
  {
    name: 'Matei Olaru',
    title: 'Chief Executive Officer',
    bio: 'Yogi, fearless leader, snack pirate',
    headshot: Matei,
    headshotAnimated: MateiAnimated,
  },
  {
    name: 'Tyler Sookochoff',
    title: 'Founder',
    bio: 'Pretty good at some stuff',
    headshot: Tyler,
    headshotAnimated: TylerAnimated,
  },
  {
    name: 'Craig Hudson',
    title: 'Chief Financial Officer',
    bio: 'Excel wizard. Dad-joke savant. Operations guy.',
    headshot: Craig,
    headshotAnimated: CraigAnimated,
  },
  {
    name: 'Kerri-Lynn McAllister',
    title: 'Chief Marketing Officer',
    bio: 'Bachelor fanatic, #movethedial supporter, Dog mom',
    headshot: Kerri,
    headshotAnimated: KerriAnimated,
  },
  {
    name: 'Josh Kerbel',
    title: 'Chief Technology Officer',
    bio:
      'Collection of oddly colored pants, Runs towards the crazy, A closeted nihilist',
    headshot: Josh,
    headshotAnimated: JoshAnimated,
  },
  {
    name: 'Nick Pateras',
    title: 'Vice President of Growth',
    bio: 'Humanoid creature, bipedal, cantankerous in the mornings',
    headshot: Nick,
    headshotAnimated: NickAnimated,
  },
  {
    name: 'Nicole Orlowski',
    title: 'Art Director',
    bio: 'Adobe! Sans Serif! Paint!',
    headshot: Nicole,
    headshotAnimated: NicoleAnimated,
  },
  {
    name: 'Danielle Babineau',
    title: 'Director of Events',
    bio: 'A doer of things. Event creator. Logistics ninja.',
    headshot: Danielle,
    headshotAnimated: DanielleAnimated,
  },
  {
    name: 'Derek Braid',
    title: 'Lead Developer',
    bio: 'Natural Resource. Wet and dry code',
    headshot: Derek,
    headshotAnimated: DerekAnimated,
  },
  {
    name: 'Mark Doerr',
    title: 'Account Executive',
    bio: "Monkey Dad, open-faced sandwiches, world's greatest whistler",
    headshot: Mark,
    headshotAnimated: MarkAnimated,
  },
  {
    name: 'Ben Gottlieb',
    title: 'Product Marketing Manager',
    bio: 'Kanye apologist, rec league all star, Seth Cohen act-alike',
    headshot: Ben,
    headshotAnimated: BenAnimated,
  },
  {
    name: 'Dan Lam',
    title: 'Senior Designer',
    bio: 'Pixel pusher, dog whisperer, banh mi boy',
    headshot: DanLam,
    headshotAnimated: DanLamAnimated,
  },
  {
    name: 'Dan Lee',
    title: 'Digital Content Producer',
    bio: 'Director, producer, food consumer',
    headshot: Dan,
    headshotAnimated: DanAnimated,
  },
  {
    name: 'Kayla Keip',
    title: 'Customer Experience Representative​',
    bio: 'Adventure seeker, travel enthusiast, nature lover',
    headshot: Kayla,
    headshotAnimated: KaylaAnimated,
  },
  {
    name: 'Yan Takushevich',
    title: 'Software Development Team Lead​',
    bio: 'Coder, thinker, adventurer',
    headshot: Yan,
    headshotAnimated: YanAnimated,
  },
  {
    name: 'Dylan Cowley',
    title: 'Product Manager',
    bio: 'Tall hair enthusiast, Wicked sense of humour, Excels at Excel',
    headshot: Dylan,
    headshotAnimated: DylanAnimated,
  },
  {
    name: 'Keesha Williams',
    title: 'Executive Assistant',
    bio: 'Curious, Calm and Caring',
    headshot: Keesha,
    headshotAnimated: KeeshaAnimated,
  },
  {
    name: 'Kim Kong',
    title: 'Digital Marketing Manager',
    bio:
      'Creative technology, Shared economy, Cheesy Bollywood films, Proper plank form',
    headshot: Kim,
    headshotAnimated: KimAnimated,
  },
  {
    name: 'Kate Robertson',
    title: 'Managing Editor',
    bio: 'Records, Shows, Journalism',
    headshot: Kate,
    headshotAnimated: KateAnimated,
  },
  {
    name: 'Kayla Reyes',
    title: 'Senior Digital Marketing Manager',
    bio: 'Raptors frenemy, Carbaholic, Over-obsessive auntie',
    headshot: KaylaReyes,
    headshotAnimated: KaylaReyesAnimated,
  },
];

const Team = () => (
  <div className="row column mb-xxl">
    <div className="team">
      <div className="row">
        <div className="small-12 column">
          <BorderedTitle centered>Meet our team</BorderedTitle>
        </div>
        {teamMembers.map(member => (
          <div
            className="team__member small-12 medium-3 column mb-lg"
            key={generate()}
          >
            <div className="team__picture">
              <img
                className="team__staticPicture"
                src={member.headshot}
                alt={member.name}
              />
              <img
                className="team__animatedPicture"
                src={member.headshotAnimated}
                alt={member.name}
              />
            </div>
            <div className="team__name mt-md">{member.name}</div>
            <p className="mb-mx">
              <strong>{member.title}</strong>
            </p>
            <p>{member.bio}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default Team;
