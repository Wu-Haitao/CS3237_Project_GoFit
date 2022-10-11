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
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  let now = new Date();
  $('#now-day').text(dayNames[now.getDay()]);
  $('#now-date').text(
    `${monthNames[now.getMonth()]} ${
      now.getDate() < 10 ? '0' + now.getDate() : now.getDate()
    }, ${now.getFullYear()}`
  );
  let timeIcon = now.getHours() >= 6 && now.getHours() <= 18 ? '☀️' : '🌙';
  $('#now-time').text(
    `${now.getHours() < 10 ? '0' + now.getHours() : now.getHours()} : ${
      now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes()
    } ${now.getHours() <= 12 ? 'AM' : 'PM'} ${timeIcon}`
  );
}

function RefreshWeather(temperature, humidity) {
  $('#temperature').text(`${temperature} °C`);
  $('#humidity').text(`${humidity} %`);
}

function RefreshAction(actionIndex) {
  const actionNames = ['Standing 🧍‍♂️', 'Walking 🚶‍♂️', 'Running 🏃‍♂️'];
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

function RefreshHistoryChart() {
  let ctx = $('#history-chart')[0].getContext('2d');
  let lineColor = getComputedStyle(document.documentElement).getPropertyValue(
    '--theme-color'
  );
  let historyChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'],
      datasets: [
        {
          label: 'Cal',
          borderColor: lineColor,
          borderWidth: 2,
          data: [1200, 1900, 300, 500, 200, 300, 900],
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
    },
  });
}

$(document).ready(function () {
  $('#nav-toggle').click(ToggleNavbar);

  RefreshDateTime();
  setInterval(RefreshDateTime, 5000);
  //Fake data
  RefreshWeather(26, 78);
  RefreshAction(1);
  RefreshProgress(1600, 1200);
  RefreshHeartRate(90);

  RefreshHistoryChart();

  let mqttClient = SetupMQTT();
});
