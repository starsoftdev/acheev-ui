// @flow
import React from 'react';
import Icon from 'components/Icon';
import Link from 'components/Link';

import ChevronLeft from 'images/sprite/chevron-left.svg';
import Logo from 'images/sprite/logo.svg';
import Restart from 'images/sprite/restart.svg';

import './styles.scss';

type Props = {
  history: { push: (path: string) => void, goBack: () => void },
};

class RecommendationHeader extends React.Component<Props> {
  render() {
    return (
      <div className="recommendationHeader">
        <div className="row align-middle">
          <div className="shrink column">
            <div
              className="row align-middle cp"
              onClick={() => this.props.history.goBack()}
              role="button"
            >
              <div className="shrink column npr">
                <Icon glyph={ChevronLeft} size={10} />
              </div>
              <div className="column pl-sm">Back</div>
            </div>
          </div>
          <div className="column">
            <div className="row align-center">
              <div className="shrink column">
                <Link to="/">
                  <Icon glyph={Logo} width={77} height={26} />
                </Link>
              </div>
            </div>
          </div>
          <div className="shrink column">
            <div
              className="row align-middle cp"
              onClick={() => this.props.history.push('/')}
              role="button"
            >
              <div className="shrink column npr">
                <Icon glyph={Restart} size={18} />
              </div>
              <div className="column pl-sm">Start over</div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RecommendationHeader;
