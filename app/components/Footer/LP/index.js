// @flow

import * as React from 'react';
import moment from 'moment';

import './styles.scss';

const currentYear = moment().format('YYYY');

const LpFooter = () => <div className="lpFooter">© LIFT CO. {currentYear}</div>;

export default LpFooter;
