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
  // let cardClassName = `g${now.getHours()}`;
  // for (let i = 0; i <= 23; i++) {
  //   $('#time-card').removeClass(`g${i}`);
  // }
  // $('#time-card').addClass(cardClassName);
}

let temperature = 26;
let humidity = 78;
function RefreshWeather() {
  $('#temperature').text(`${temperature} °C`);
  $('#humidity').text(`${humidity} %`);

  // let SetBackgroundColor = function (temp) {
  //   const cardClassName = ['hot', 'warm', 'cool', 'cold'];
  //   let weather_card = $('#weather-card');
  //   cardClassName.forEach((c) => {
  //     weather_card.removeClass(c);
  //   });
  //   if (temp >= 30) {
  //     weather_card.addClass('hot');
  //   } else if (temp >= 25) {
  //     weather_card.addClass('warm');
  //   } else if (temp >= 20) {
  //     weather_card.addClass('cool');
  //   } else {
  //     weather_card.addClass('cold');
  //   }
  // };

  // SetBackgroundColor(temperature);
}

let sportType = "Walking🚶‍♂️";
function RefreshSport() {
  $("#current-action").text(sportType);
}

function RefreshDashboardCards() {
  RefreshDateTime();
  RefreshWeather();
  RefreshSport();
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
  /* Navbar action */
  $('#nav-toggle').click(ToggleNavbar);
  setInterval(RefreshDashboardCards, 1000);
  RefreshHistoryChart();
});
