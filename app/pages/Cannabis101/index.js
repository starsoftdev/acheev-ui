// @flow

import React, { Component } from 'react';
import type { Map } from 'immutable';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectSagas from 'utils/injectSagas';
import { getIn } from 'utils/immutable';
import { matchPath } from 'react-router';

import Link from 'components/Link';
import Preloader from 'components/Preloader';
import Icon from 'components/Icon';
import Button from 'components/Button';
import Modal from 'components/Cannabis101/Modal';

import Download from 'images/sprite/download-inline.svg';
import pdfImage from 'images/pdf.jpg';

import Routes from './routes';
import saga, {
  reducer,
  requestChapters,
  requestCheckEmail,
  requestCTA,
  requestPDF,
} from './sagas';
import './styles.scss';

type Props = {
  match: Object,
  location: Object,
  chaptersLoading: boolean,
  emailLoading: boolean,
  emailSuccess: ?string,
  emailError: ?string,
  chapters: Map<*, *>,
  commonCta: Map<*, *>,
  user: Map<*, *>,
  pdf: string,
  requestChapters: Function,
  requestCheckEmail: Function,
  requestCTA: Function,
  requestPDF: Function,
};

type State = {
  modalOpen: boolean,
};

class Cannabis101 extends Component<Props, State> {
  state = {
    modalOpen: false,
  };
  componentDidMount() {
    const { commonCta, chapters, pdf } = this.props;
    if (!chapters) this.props.requestChapters();
    if (!commonCta) this.props.requestCTA();
    if (!pdf) this.props.requestPDF();
  }

  openModal = () => {
    this.setState({ modalOpen: true });
  };

  closeModal = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    const {
      location: { pathname },
      match: { url },
      chapters,
      commonCta,
      chaptersLoading,
      user,
      pdf,
      emailError,
      emailLoading,
      emailSuccess,
    } = this.props;
    const chapterSlug = getIn(
      matchPath(pathname, {
        path: '/cannabis-101/:chapter',
      }),
      ['params', 'chapter']
    );
    const currentChapter =
      chapters &&
      chapters.find(i => getIn(i, ['fields', 'slug']) === chapterSlug);
    const currentChapterId = getIn(currentChapter, ['sys', 'id']);
    const currentChapterIndex =
      chapters &&
      chapters.findIndex(i => getIn(i, ['sys', 'id']) === currentChapterId);
    const cta = getIn(
      chapters,
      [currentChapterIndex, 'fields', 'cta', 'fields'],
      commonCta
    );
    return (
      <div className="c101 row">
        <div className="small-12 medium-4 large-3 column">
          {chaptersLoading ? (
            <Preloader />
          ) : (
            <div className="c101__sidebar">
              <div className="c101__sidebarPanel">
                <h3 className="c101__sidebarTitle">Contents</h3>
                <ul className="c101__sidebarList mb-md">
                  {chapters &&
                    chapters.map((chapter, i) => {
                      const articles = getIn(chapter, ['fields', 'articles']);
                      const slug = getIn(chapter, ['fields', 'slug']);
                      return (
                        <li key={getIn(chapter, ['sys', 'id'])}>
                          <Link
                            className="c101__sidebarLink plain-link"
                            activeClassName="c101__sidebarLink--active"
                            to={`${url}/${slug}`}
                          >
                            <strong>
                              {i + 1}
                              .0
                            </strong>{' '}
                            {getIn(chapter, ['fields', 'title'])}
                          </Link>
                          {articles && (
                            <ul className="c101__sidebarList c101__sidebarList--nested">
                              {articles.map((article, j) => (
                                <li key={getIn(article, ['sys', 'id'])}>
                                  <Link
                                    className="c101__sidebarLink plain-link"
                                    activeClassName="c101__sidebarLink--active"
                                    to={`${url}/${slug}/${getIn(article, [
                                      'fields',
                                      'slug',
                                    ])}`}
                                  >
                                    <strong>
                                      {i + 1}.{j + 1}
                                    </strong>{' '}
                                    {getIn(article, ['fields', 'title'])}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      );
                    })}
                </ul>
                <img
                  src={pdfImage}
                  alt="Download PDF"
                  className="c101__downloadImg"
                />
                <div className="row column t-nt fs-md">
                  <Link className="d-if align-middle" onClick={this.openModal}>
                    <div className="mr-sm">Download PDF</div>
                    <Icon glyph={Download} width={20} height={14} />
                  </Link>
                </div>
                <Modal
                  user={user}
                  pdf={pdf}
                  emailError={emailError}
                  requestCheckEmail={this.props.requestCheckEmail}
                  emailLoading={emailLoading}
                  closeModal={this.closeModal}
                  emailSuccess={emailSuccess}
                  isOpen={this.state.modalOpen}
                />
              </div>
              {cta && (
                <div>
                  <h3 className="c101__ctaTitle">{getIn(cta, ['title'])}</h3>
                  <div
                    className="c101__ctaContent"
                    dangerouslySetInnerHTML={{
                      __html: getIn(cta, ['content']),
                    }}
                  />
                  <Button
                    className="c101__ctaButton secondary"
                    element={Link}
                    to={getIn(cta, ['buttonLink'])}
                  >
                    {getIn(cta, ['buttonText'])}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="small-12 medium-8 large-9 column">
          <Routes url={url} currentChapterIndex={currentChapterIndex} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  chaptersLoading: state.getIn(['c101', 'chapters', 'isLoading']),
  emailLoading: state.getIn(['c101', 'email', 'isLoading']),
  emailSuccess: state.getIn(['c101', 'email', 'success']),
  emailError: state.getIn(['c101', 'email', 'error']),
  chapters: state.getIn(['c101', 'chapters', 'data']),
  commonCta: state.getIn(['c101', 'cta', 'data', 0, 'fields']),
  pdf: state.getIn([
    'c101',
    'pdf',
    'data',
    'items',
    0,
    'fields',
    'media',
    'fields',
    'file',
    'url',
  ]),
  user: state.getIn(['app', 'user']),
});

const mapDispatchToProps = dispatch => ({
  requestChapters: () => dispatch(requestChapters()),
  requestCTA: () => dispatch(requestCTA()),
  requestPDF: () => dispatch(requestPDF()),
  requestCheckEmail: (email, newsletters) =>
    dispatch(requestCheckEmail(email, newsletters)),
});

export default compose(
  injectSagas({ key: 'c101', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(Cannabis101);
