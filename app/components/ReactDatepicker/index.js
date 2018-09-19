// @flow

import React, { Component } from 'react';

import DatePicker from 'react-datepicker';

import './stylesheets/datepicker.scss';

type Props = {
  dateFormat?: string,
  popperModifiers?: Object,
};

class ReactDatepicker extends Component<Props> {
  static defaultProps = {
    dateFormat: 'll',
    popperModifiers: {
      preventOverflow: {
        enabled: true,
        escapeWithReference: false, // force popper to stay in viewport (even when input is scrolled out of view)
        boundariesElement: 'viewport',
      },
    },
  };
  render() {
    return <DatePicker {...this.props} />;
  }
}

export default ReactDatepicker;
