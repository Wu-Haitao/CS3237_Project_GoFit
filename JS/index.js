/*jshint esversion: 6 */

function ToggleNavbar() {
  let el = $('.nav-list');
  if (el.hasClass('responsive')) el.removeClass('responsive');
  else el.addClass('responsive');
}

function RefreshDateTime() {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ];
  let now = new Date();
  $('#now-day').text(dayNames[now.getDay()]);
  $('#now-date').text(
    `${monthNames[now.getMonth()]} ${now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
    }, ${now.getFullYear()}`
  );
  let timeIcon = now.getHours() >= 6 && now.getHours() <= 18 ? '☀️' : '🌙';
  $('#now-time').text(
    `${now.getHours() < 10 ? '0' + now.getHours() : now.getHours()} : ${now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
    } ${now.getHours() <= 12 ? 'AM' : 'PM'} ${timeIcon}`
  );
}

let global_temperature;
let global_humidity;
function SendWeatherNotificationStatus() {
  const temperature_threshold = 28;
  const humidity_threshold = 75;
  if ((global_temperature >= temperature_threshold) && (global_humidity >= humidity_threshold)) {
    SendNotification('🌡 High temperature & humidity, drink some water!');
    setTimeout(SendWeatherNotificationStatus, 10000);
  }
  else {
    setTimeout(SendWeatherNotificationStatus, 30000);
  }
}

function RefreshWeather(temperature, humidity) {
  $('#temperature').text(`${temperature} °C`);
  $('#humidity').text(`${humidity} %`);
  global_temperature = temperature;
  global_humidity = humidity;
}

function RefreshAction(actionIndex) {
  const actionNames = ['Standing 🧍‍♂️', 'Sitting 🪑', 'Walking 🚶‍♂️', 'Running 🏃‍♂️', 'Jumping 🦘'];
  $('#current-action').text(actionNames[actionIndex]);
}

function RefreshProgress(target, current) {
  let percentage = Math.round((current / target) * 100);
  $('#percent').text(`${percentage}%`);
  $('#progress-target span').text(target);
  $('#progress-current span').text(current);
  $('.progress .svg .bar').css(
    'stroke-dashoffset',
    Math.round(360 - 3.6 * percentage)
  );
  if (percentage < 75) {
    $('#progress-comment').text('Keep going!');
  } else if (percentage < 100) {
    $('#progress-comment').text('Almost there!');
  } else {
    $('#progress-comment').text('Target reached!');
  }
}

function RefreshHeartRate(heartRate) {
  $('#heartrate-number').text(heartRate);
  if (heartRate < 80) {
    $('#heartrate-intensity span').text('Low');
    $('#heartrate-comment').text('Relaxing~');
  } else if (heartRate < 120) {
    $('#heartrate-intensity span').text('Medium');
    $('#heartrate-comment').text('Working-out moderately');
  } else {
    $('#heartrate-intensity span').text('High');
    $('#heartrate-comment').text('Working-out strenuously');
  }
}

function RefreshHistoryChart(historicalData) {
  let ctx = $('#history-chart')[0].getContext('2d');
  let lineColor = getComputedStyle(document.documentElement).getPropertyValue(
    '--theme-color'
  );
  let data = new Array();
  let now = new Date();
  today = now.getDay();
  for (let i = 6; i > today; i--) {
    data[i] = 0;
  }
  let index = 0;
  for (let i = today; i >= 0; i--) {
    data[i] = historicalData[index];
    index++;
  }
  let historyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
      datasets: [
        {
          label: 'Calorie',
          borderColor: lineColor,
          borderWidth: 2,
          data: data,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
    },
  });
}

function UserInput() {
  input = $('.user-input-section input').val();
  $('.user-input-section').addClass('hidden');
  $('.content-section').removeClass('hidden');

  ConnectToMQTT(input)
}

function ConnectToMQTT(userid) {
  let mqttClient = SetupMQTT(userid);
  SendRequest(mqttClient, '1');
  setInterval(SendRequest, 3000, mqttClient, '1');
  SendRequest(mqttClient, '2');
}

$(document).ready(function () {
  $('#nav-toggle').click(ToggleNavbar);
  $('#user-input-button').click(UserInput);

  RefreshDateTime();
  setInterval(RefreshDateTime, 5000);
  //Fake data
  // RefreshWeather(29, 78);
  // RefreshAction(1);
  // RefreshProgress(1600, 1200);
  // RefreshHeartRate(90);

  //Notifications
  GetNotificationPermission();
  SendWeatherNotificationStatus();
  //setInterval(SendWeatherNotificationStatus, 30000);
});

function GetNotificationPermission() {
  if (window.Notification && Notification.permission !== "granted") {
    Notification.requestPermission(function (status) {
      if (Notification.permission !== status) {
        Notification.permission = status
      }
    })
  }
}

navigator.serviceWorker.register('/sw.js').then(function (registration) {
  console.log(registration)
})

let registration = self.registration

function SendNotification(msg) {
  GetNotificationPermission();
  navigator.serviceWorker.getRegistration().then(function (registration) {
    registration.showNotification('GoFit', {
      body: msg
    })
      .then(function () {
        console.log('Notification sent!');
      })
      .catch(function (e) {
        console.log('Error on sending notifications!');
      })
  })
}