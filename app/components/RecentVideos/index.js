// @flow

import React, { Component } from 'react';
import YouTube from 'react-youtube';

import Preloader from 'components/Preloader';

import './styles.scss';

type Props = {
  data: Object,
};

type State = {
  currentVideoId: string,
  player: Object,
};

class RecentVideos extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      currentVideoId: '',
      player: {},
    };
  }
  componentWillReceiveProps(newProps: Props) {
    const { data } = newProps;
    this.setState({
      currentVideoId: data.getIn([
        'data',
        'items',
        0,
        'snippet',
        'resourceId',
        'videoId',
      ]),
    });
  }
  onReady = (event: Object) => {
    this.setState({
      player: event.target,
    });
  };
  onPause = () => {
    this.state.player.pauseVideo();
  };
  onPlayerStateChange = () => {
    if (this.state.player.getVideoData().title === '') {
      this.state.player.playVideo();
    }
  };
  changeVideo = (videoId: string) => {
    this.setState({
      currentVideoId: videoId,
    });
  };
  render() {
    const { data } = this.props;
    let items = data.getIn(['data', 'items']);
    if (items && items.size > 4) {
      items = items.deleteIn([items.size - 1]);
    }
    return (
      <div className="row column">
        <div className="recentVideos mb-xl">
          <div className="row">
            <div className="column-12 column">
              <h2 className="mb-mn">Recent Videos</h2>
            </div>
          </div>
          {data.get('isLoading') ? (
            <div className="row">
              <div className="column">
                <Preloader height={423} />
              </div>
            </div>
          ) : (
            <div>
              <div className="row">
                <div className="column">
                  {this.state.currentVideoId && (
                    <div className="recentVideos__playerContainer hide-for-small-only">
                      <YouTube
                        videoId={this.state.currentVideoId}
                        onReady={this.onReady}
                        onPause={this.onPause}
                        onStateChange={this.onPlayerStateChange}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="row">
                {items &&
                  items.entrySeq().map(([key, value]) => (
                    <div className="column medium-3 small-12" key={key}>
                      <div
                        className="recentVideos__thumbnail hide-for-small-only"
                        onClick={() => {
                          this.changeVideo(
                            value.getIn(['snippet', 'resourceId', 'videoId'])
                          );
                        }}
                        role="button"
                      >
                        <img
                          className="mb-mn"
                          src={value.getIn([
                            'snippet',
                            'thumbnails',
                            'high',
                            'url',
                          ])}
                          alt={value.getIn(['snippet', 'title'])}
                        />
                        <h6 className="nm">
                          <strong>{value.getIn(['snippet', 'title'])}</strong>
                        </h6>
                      </div>
                      <div className="recentVideos__smallPlayer mb-sm show-for-small-only">
                        <YouTube
                          videoId={value.getIn([
                            'snippet',
                            'resourceId',
                            'videoId',
                          ])}
                        />
                      </div>
                      <h6 className="c-secondary mb-md show-for-small-only">
                        <strong>{value.getIn(['snippet', 'title'])}</strong>
                      </h6>
                    </div>
                  ))}
              </div>
            </div>
          )}
          <div className="row">
            <div className="column-12 column">
              <div className="bb-light-gray mt-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RecentVideos;
