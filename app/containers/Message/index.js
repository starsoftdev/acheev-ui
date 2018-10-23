// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Map } from 'immutable';
import { generate } from 'shortid';
import cx from 'classnames';

import Preloader from 'components/Preloader';
import Icon from 'components/Icon';

import SendMessageIcon from 'images/sprite/send-message.svg';

import {
  requestIoTPresignedURL,
  requestChannels,
} from 'containers/Message/sagas';
import RealtimeClient from 'utils/realtimeClient';

import './styles.scss';

type Props = {
  user: Object,
  presignedURL: string,
  channels: Map<*, *>,
  isChannelsLoading: boolean,
  channelsError: string,
  requestIoTPresignedURL: Function,
  requestChannels: Function,
};

type State = {
  message: string,
  messages: Array<Object>,
  currentChannel: Object,
};

class MessageContainer extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props) {
    return {
      currentChannel: nextProps.channels.get(0),
    };
  }
  state = {
    message: '',
    messages: [],
    currentChannel: {},
  };
  componentDidMount() {
    this.props.requestIoTPresignedURL();
    this.props.requestChannels();
  }
  componentDidUpdate() {
    const { presignedURL, user } = this.props;
    if (presignedURL && !this.client) {
      this.client = new RealtimeClient(
        presignedURL,
        user.get('_id'),
        user.get('username')
      );
      this.client.connect();
      this.client.onConnect(() => {});
      this.client.onMessageReceived((topic, message) => {
        if (topic === 'client-connected') {
          // this.setState({ users: [...this.state.users, message] });
        } else if (topic === 'client-disconnected') {
          // this.setState({
          //   users: this.state.users.filter(
          //     user => user.clientId !== message.clientId
          //   ),
          // });
        } else if (topic === `user:${user.get('_id')}`) {
          this.setState(
            state => ({
              messages: [...state.messages, message],
            }),
            () => {
              if (this.chatBox) {
                this.chatBox.scrollTop =
                  this.chatBox.scrollHeight - this.chatBox.clientHeight;
              }
            }
          );
        } else {
          // this.setState({ messages: [...this.state.messages, message] });
        }
      });
    }
  }
  handleInputChange = e => {
    this.setState({
      message: e.target.value,
    });
  };
  sendMessage = () => {
    const { user } = this.props;
    const { message, currentChannel } = this.state;
    const opponent =
      currentChannel.getIn(['subscribers', 0, '_id']) !== user.get('_id')
        ? currentChannel.getIn(['subscribers', 0])
        : currentChannel.getIn(['subscribers', 1]);
    this.client.sendMessage(`user:${opponent.get('_id')}`, {
      content: message,
      senderId: user.get('_id'),
      read_by: [user.get('_id')],
    });
    this.setState(
      state => ({
        message: '',
        messages: [
          ...state.messages,
          {
            content: message,
            senderId: user.get('_id'),
            read_by: [user.get('_id')],
          },
        ],
      }),
      () => {
        if (this.chatBox) {
          this.chatBox.scrollTop =
            this.chatBox.scrollHeight - this.chatBox.clientHeight;
        }
      }
    );
  };
  client: Object;
  chatBox: ?HTMLElement;
  render() {
    const { channels, user, isChannelsLoading, channelsError } = this.props;
    const { message, messages, currentChannel } = this.state;
    return (
      <div className="message row">
        <div className="column large-4 np message__leftPanel">
          {isChannelsLoading && <Preloader height={200} />}
          {!isChannelsLoading &&
            channels &&
            channels.size > 0 &&
            channels.map(channel => {
              const opponent =
                channel.getIn(['subscribers', 0, '_id']) !== user.get('_id')
                  ? channel.getIn(['subscribers', 0])
                  : channel.getIn(['subscribers', 1]);
              const name =
                opponent.get('first_name') && opponent.get('last_name')
                  ? `${opponent.get('first_name')} ${opponent.get('last_name')}`
                  : opponent.get('username');
              return (
                <div
                  key={channel.get('_id')}
                  className={cx('message__channelCard', {
                    'message__channelCard--current':
                      currentChannel.get('_id') === channel.get('_id'),
                  })}
                >
                  <div className="row">
                    <div className="column shrink">
                      <div
                        className="message__avatar"
                        style={{
                          backgroundImage: `url('${opponent.getIn([
                            'image',
                            'src',
                          ])}')`,
                        }}
                      />
                    </div>
                    <div className="column">
                      <h1 className="message__username">{name}</h1>
                    </div>
                  </div>
                </div>
              );
            })}
          {channelsError}
        </div>
        <div className="column large-8 np">
          <div
            className="message__chatContent"
            ref={node => {
              this.chatBox = node;
            }}
          >
            {messages.map(msg => (
              <div
                key={generate()}
                className={cx('message__bubbleWrapper', {
                  'message__bubbleWrapper--incoming':
                    msg.senderId !== user.get('_id'),
                  'message__bubbleWrapper--outgoing':
                    msg.senderId === user.get('_id'),
                })}
              >
                <div
                  className={cx('message__bubble', {
                    'message__bubble--incoming':
                      msg.senderId !== user.get('_id'),
                    'message__bubble--outgoing':
                      msg.senderId === user.get('_id'),
                  })}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>
          <div className="message__inputWrapper">
            <input
              className="accent message__input"
              type="text"
              value={message}
              onChange={this.handleInputChange}
              onKeyPress={e => e.key === 'Enter' && this.sendMessage()}
            />
            <Icon
              className="message__sendIcon"
              glyph={SendMessageIcon}
              width={22}
              height={20}
              onClick={this.sendMessage}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  presignedURL: state.getIn(['message', 'presignedURL']),
  isLoading: state.getIn(['message', 'isLoading']),
  error: state.getIn(['message', 'error']),
  channels: state.getIn(['message', 'channels']),
  isChannelsLoading: state.getIn(['message', 'isChannelsLoading']),
  channelsError: state.getIn(['message', 'channelsError']),
});

const mapDispatchToProps = dispatch => ({
  requestIoTPresignedURL: () => dispatch(requestIoTPresignedURL()),
  requestChannels: () => dispatch(requestChannels()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MessageContainer);
