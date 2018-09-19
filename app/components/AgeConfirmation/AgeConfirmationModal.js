// @flow
import * as React from 'react';
import ReactModal from 'react-modal';

import Button from 'components/Button';
import Link from 'components/Link';

import './styles.scss';

if (document && document.getElementById('app')) {
  ReactModal.setAppElement('#app');
}

type Props = {
  onYesAnswer: () => void,
  onNoAnswer: () => void,
  isOpen: boolean,
};

const AgeConfirmationModal = ({ onYesAnswer, onNoAnswer, isOpen }: Props) => (
  <ReactModal
    overlayClassName="ageConfirmation__layout row-fluid"
    className="ageConfirmation__content medium-6 small-12 columns"
    isOpen={isOpen}
  >
    <h1 className="ageConfirmation__title">Can we see some ID?</h1>

    <p className="ageConfirmation__text">
      Are you the age of majority in your province (19+, or 18+ in Alberta and
      Quebec)?
    </p>

    <div className="ageConfirmation__buttons">
      <Button className="secondary mr-md" onClick={onYesAnswer}>
        Yes
      </Button>
      <Button className="secondary hollow" onClick={onNoAnswer}>
        No
      </Button>
    </div>

    <p className="ageConfirmation__text">
      By entering our site you are agreeing to our <br />
      <Link
        target="_blank"
        className="ageConfirmation__link"
        to="/terms-and-conditions"
      >
        Terms & Conditions
      </Link>{' '}
      and{' '}
      <Link target="_blank" className="ageConfirmation__link" to="/privacy">
        Privacy Policy
      </Link>
    </p>
  </ReactModal>
);

export default AgeConfirmationModal;
