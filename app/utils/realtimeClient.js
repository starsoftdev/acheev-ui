import mqtt from 'mqtt';

const LAST_WILL_TOPIC = 'last-will';
const CLIENT_CONNECTED = 'client-connected';
const CLIENT_DISCONNECTED = 'client-disconnected';

const getNotification = (clientId, username) =>
  JSON.stringify({ clientId, username });

const validateClientConnected = client => {
  if (!client) {
    throw new Error(
      'Client is not connected yet. Call client.connect() first!'
    );
  }
};

export default (presignedURL, clientId, username) => {
  const options = {
    will: {
      topic: LAST_WILL_TOPIC,
      payload: getNotification(clientId, username),
    },
  };
  let client = null;

  const clientWrapper = {};
  clientWrapper.connect = () => {
    client = mqtt.connect(
      presignedURL,
      options
    );
    client.on('connect', () => {
      // console.log('Connected to AWS IoT Broker');
      client.subscribe(`user:${clientId}`);
      client.subscribe(CLIENT_CONNECTED, err => {
        if (!err) {
          const connectNotification = getNotification(clientId, username);
          client.publish(CLIENT_CONNECTED, connectNotification);
          // console.log(
          //   `Sent message: ${CLIENT_CONNECTED} - ${connectNotification}`
          // );
        }
      });
      client.subscribe(CLIENT_DISCONNECTED);
    });
    client.on('close', () => {
      // console.log('Connection to AWS IoT Broker closed');
      client.end();
    });
  };
  clientWrapper.onConnect = callback => {
    validateClientConnected(client);
    client.on('connect', callback);
    return clientWrapper;
  };
  clientWrapper.onDisconnect = callback => {
    validateClientConnected(client);
    client.on('close', callback);
    return clientWrapper;
  };
  clientWrapper.onMessageReceived = callback => {
    validateClientConnected(client);
    client.on('message', (topic, message) => {
      callback(topic, JSON.parse(message.toString('utf8')));
    });
    return clientWrapper;
  };
  clientWrapper.sendMessage = (topic, message) => {
    validateClientConnected(client);
    client.publish(topic, JSON.stringify(message));
    return clientWrapper;
  };
  return clientWrapper;
};
