// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { toastr } from 'react-redux-toastr';

import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';
import './styles.scss';

const schema = yup.object({
  code: yup.string().required(),
});

type Props = {
  redeemPromoCode: Function,
  requestUser: Function,
  isLoading: boolean,
};

type State = {
  model: Object,
};

class PromoCodePanel extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      model: {
        code: '',
      },
    };
  }
  componentWillReceiveProps(newProps: Object) {
    const { error, success } = newProps;
    const { isLoading } = this.props;
    if (isLoading && isLoading !== newProps.isLoading) {
      if (!error) {
        toastr.info('', success);
        this.props.requestUser();
      } else {
        toastr.info('', error);
      }
    }
  }
  onChange: Function = (model: Object) => {
    this.setState({ model });
  };
  onSubmit: Function = (e: Object) => {
    this.props.redeemPromoCode(e);
  };
  render() {
    const { isLoading } = this.props;
    return (
      <div className="promoCodePanel">
        <Form
          schema={schema}
          value={this.state.model}
          onChange={this.onChange}
          onSubmit={this.onSubmit}
          className="row align-middle"
        >
          <div className="promoCodePanel__title column small-12 mb-md">
            Enter promo code
          </div>
          <div className="column small-12 medium-9">
            <Field className="accent" name="code" id="code" type="text" />
          </div>
          <div className="column small-12 medium-3">
            <Button
              className="button promoCodePanel__button small secondary"
              type="submit"
              element={Form.Button}
              isLoading={isLoading}
            >
              Redeem
            </Button>
          </div>
          <div className="column small-12 mb-md">
            <ValidationMessage for="code" />
          </div>
        </Form>
      </div>
    );
  }
}

export default PromoCodePanel;
