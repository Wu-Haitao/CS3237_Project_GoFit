/*jshint esversion: 6 */

const mqttOptions = {
  clean: true,
  username: 'GoFitProject',
  password: '12345678',
};

const host =
  'wss://1ac96036d38f4e2b9c0cb8685d7ae015.s1.eu.hivemq.cloud:8884/mqtt';

const fromTopic = 'GoFit/Data';
const toTopic = 'GoFit/Request';

function SetupMQTT() {
  let mqttClient = mqtt.connect(host, mqttOptions);

  // On Connect
  mqttClient.on('connect', function () {
    console.log('MQTT broker connected!');
    mqttClient.subscribe(fromTopic, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log('Topic subscribed!');
      }
    });
  });

  // On Message
  mqttClient.on('message', function (topic, message) {
    if (topic === fromTopic) {
      console.log(`Received message: ${message}`);
      HandelMQTTMessage(message);
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
