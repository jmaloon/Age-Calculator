const form = document.querySelector("form");

const dayLabelElement = document.querySelector("label[for='day']");
const monthLabelElement = document.querySelector("label[for='month']");
const yearLabelElement = document.querySelector("label[for='year']");

const dayInputElement = document.querySelector("input#day");
const monthInputElement = document.querySelector("input#month");
const yearInputElement = document.querySelector("input#year");

const dayErrorElement = document.querySelector("input#day + span");
const monthErrorElement = document.querySelector("input#month + span");
const yearErrorElement = document.querySelector("input#year + span");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = getFormData();
  const formErrors = getFormErrors(formData);

  const hasErrors = Object.keys(formErrors).length !== 0;
  if (hasErrors) {
    setHtmlErrors(formErrors);
    setResults();
    return;
  }

  setHtmlErrors();
  const results = calculateAge(formData);
  setResults(results);
});

function getFormData() {
  const formData = new FormData(form);
  const formEntries = Object.fromEntries(formData);

  return {
    day: formEntries.day.trim(),
    month: formEntries.month.trim(),
    year: formEntries.year.trim(),
  };
}

function getFormErrors({ day, month, year }) {
  const currentDate = new Date();
  const errors = {};

  if (day === "") {
    errors.day = "This field is required";
  } else {
    const daysInMonth = getDaysInMonth(year, month - 1);
    const isValidDay = isValidInRange(day, { min: 1, max: daysInMonth });
    if (!isValidDay) {
      errors.day = "Must be a valid day";
    }
  }

  if (month === "") {
    errors.month = "This field is required";
  } else {
    const isValidMonth = isValidInRange(month, { min: 1, max: 12 });
    if (!isValidMonth) {
      errors.month = "Must be a valid month";
    }
  }

  if (year === "") {
    errors.year = "This field is required";
  } else {
    const currentYear = currentDate.getFullYear();
    const isValidYear = isValidInRange(year, { min: 1, max: currentYear });
    if (!isValidYear) {
      errors.year = "Must be in the past";
    }
  }

  return errors;
}

function isValidInRange(value, { min, max }) {
  const integer = parseInt(value);
  if (isNaN(integer)) return false;

  if (min && integer < min) return false;
  if (max && integer > max) return false;
  return true;
}

function setHtmlErrors(errors = {}) {
  if (errors.day) {
    dayLabelElement.classList.add("error");
    dayInputElement.classList.add("error");
  } else {
    dayLabelElement.classList.remove("error");
    dayInputElement.classList.remove("error");
  }
  if (errors.month) {
    monthLabelElement.classList.add("error");
    monthInputElement.classList.add("error");
  } else {
    monthLabelElement.classList.remove("error");
    monthInputElement.classList.remove("error");
  }
  if (errors.year) {
    yearLabelElement.classList.add("error");
    yearInputElement.classList.add("error");
  } else {
    yearLabelElement.classList.remove("error");
    yearInputElement.classList.remove("error");
  }

  dayErrorElement.textContent = errors.day;
  monthErrorElement.textContent = errors.month;
  yearErrorElement.textContent = errors.year;
}

function calculateAge(formData) {
  const currentDate = new Date();
  const formDataMonth = formData.month - 1; // month is 0-indexed
  const formDate = new Date(formData.year, formDataMonth, formData.day);

  let yearDifference = currentDate.getFullYear() - formDate.getFullYear();
  let monthDifference = currentDate.getMonth() - formDate.getMonth();
  if (monthDifference < 0) {
    month += 12;
    yearDifference -= 1;
  }

  let dayDifference = currentDate.getDate() - formDate.getDate();
  if (dayDifference < 0) {
    const daysInMonth = getDaysInMonth(formData.year, formDataMonth);
    dayDifference += daysInMonth;
    monthDifference -= 1;

    if (monthDifference < 0) {
      month += 12;
      yearDifference -= 1;
    }
  }

  return {
    day: dayDifference,
    month: monthDifference,
    year: yearDifference,
  };
}

function setResults(
  { day, month, year } = { day: "--", month: "--", year: "--" }
) {
  const [yearsParagraph, monthsParagraph, daysParagraph] =
    document.querySelectorAll(".result p");

  yearsParagraph.firstChild.textContent = year;
  monthsParagraph.firstChild.textContent = month;
  daysParagraph.firstChild.textContent = day;
}

function getDaysInMonth(year, month) {
  // Create a new date object for the first day of the next month
  const date = new Date(year, month + 1, 0);
  console.log(date);

  // Get the day of the month from the new date object, which gives us the number of days in the month
  const daysInMonth = date.getDate();

  return daysInMonth;
}
