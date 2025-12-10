import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

const input = document.querySelector("#datetime-picker");
const startBttn = document.querySelector("[data-start]");

const daysElem = document.querySelector("[data-days]");
const hoursElem = document.querySelector("[data-hours]");
const minutesElem = document.querySelector("[data-minutes]");
const secondsElem = document.querySelector("[data-seconds]");

startBttn.disabled = true;

let userSelectedDate = null;
let timerId = null;

flatpickr(input, {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const pickedDate = selectedDates[0];

            if (pickedDate <= new Date()) {
                iziToast.error({
                    message: "Please choose a future date",
                    position: "topRight",
                });
                startBttn.disabled = true;
                return;
            }

            userSelectedDate = pickedDate;
            startBttn.disabled = false;
        },
});
    
startBttn.addEventListener("click", () => {
    if (!userSelectedDate) return;

    startBttn.disabled = true;
    input.disabled = true;

    timerId = setInterval(() => {
        const now = new Date();
        const diff = userSelectedDate - now;

        if (diff <= 0) {
            clearInterval(timerId);
            updateTimer(0, 0, 0, 0);
            input.disabled = false;
            return;
        }

        const { days, hours, minutes, seconds } = convertMs(diff);
        updateTimer(days, hours, minutes, seconds);
    }, 1000);
});

    function updateTimer(days, hours, minutes, seconds) {
        daysElem.textContent = addLeadingZero(days);
        hoursElem.textContent = addLeadingZero(hours);
        minutesElem.textContent = addLeadingZero(minutes);
        secondsElem.textContent = addLeadingZero(seconds);
    }
    function addLeadingZero(value) {
        return String(value).padStart(2, "0");
    }

    function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
