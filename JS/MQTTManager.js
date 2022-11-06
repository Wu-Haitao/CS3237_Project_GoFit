/*jshint esversion: 6 */

const mqttOptions = {
  clean: true,
  username: 'GoFitProject',
  password: '12345678',
};

const host =
  'wss://1ac96036d38f4e2b9c0cb8685d7ae015.s1.eu.hivemq.cloud:8884/mqtt';

let fromTopic = 'GoFit/Data';
let fromTopicHistorical = 'GoFit/History';
let toTopic = 'GoFit/Request';

function SetupMQTT(userid) {
  let mqttClient = mqtt.connect(host, mqttOptions);

  fromTopic = fromTopic.substring(0, 6) + userid + '/' + fromTopic.substring(6);
  fromTopicHistorical = fromTopicHistorical.substring(0, 6) + userid + '/' +  fromTopicHistorical.substring(6);
  toTopic = toTopic.substring(0, 6) + userid + '/' +  toTopic.substring(6);

  // On Connect
  mqttClient.on('connect', function () {
    console.log('MQTT broker connected!');
    mqttClient.subscribe(fromTopic, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log(`Topic subscribed! - ${fromTopic}`);
      }
    });
    mqttClient.subscribe(fromTopicHistorical, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log(`Topic subscribed! - ${fromTopicHistorical}`);
      }
    });
  });

  // On Message
  mqttClient.on('message', function (topic, message) {
    if (topic === fromTopic) {
      console.log(`Received message: ${message}`);
      HandelMQTTMessage(message);
    }
    else if (topic === fromTopicHistorical) {
      console.log(`Received historical data message`);
      HandelMQTTMessageHistorical(message)
    }
  });

  mqttClient.on('error', function (err) {
    console.log(err);
  });

  return mqttClient;
}

function HandelMQTTMessage(message) {
  let data = JSON.parse(message);
  RefreshWeather(data.temperature, data.humidity);
  RefreshAction(data.actionIndex);
  RefreshProgress(data.target, data.current);
  RefreshHeartRate(data.heartRate);
}

function HandelMQTTMessageHistorical(message) {
  let data = JSON.parse(message);
  RefreshHistoryChart(data.history, data.stand, data.sit, data.walk, data.run);
}

function SendRequest(client, msg) {
  client.publish(toTopic, msg, function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log('Request sent!');
    }
  });
}
