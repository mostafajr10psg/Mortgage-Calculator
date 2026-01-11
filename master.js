const amountInput = document.querySelector(".amount input");
const termInput = document.querySelector(".term input");
const rateInput = document.querySelector(".rate input");
const repaymentInput = document.getElementById("repayment");
const interestInput = document.getElementById("interest");
const mortgageTypeError = document.querySelector(".mortgage-type .error-msg");
const emptyResult = document.querySelector(".empty-result");
const showResult = document.querySelector(".show-result");
const result = document.querySelector(".result");

function numberFormatter(num) {
  return new Intl.NumberFormat("en-US").format(num);
}

function filterInput(e) {
  if (e.inputType.startsWith("delete")) return;
  if (!/\d/.test(e.data)) e.preventDefault();
}

amountInput.addEventListener("beforeinput", filterInput);
termInput.addEventListener("beforeinput", filterInput);
rateInput.addEventListener("beforeinput", (e) => {
  if (e.inputType.startsWith("delete")) return;
  if (!/[\d,.]/.test(e.data)) e.preventDefault();
});

amountInput.addEventListener("input", (e) => {
  if (e.target.value.length > 1) {
    e.target.value = numberFormatter(e.target.value.replaceAll(",", ""));
  }
});

function checkInputsValidation() {
  let inputsValid = true;

  for (let input of [amountInput, termInput, rateInput]) {
    if (input.value === "" || input.value == "0") {
      input.parentElement.nextElementSibling.classList.remove("hidden");
      input.closest(".mortgage-input").classList.add("invalid-input");
      inputsValid = false;
    } else {
      input.parentElement.nextElementSibling.classList.add("hidden");
      input.closest(".mortgage-input").classList.remove("invalid-input");
    }
  }

  if (repaymentInput.checked || interestInput.checked) {
    mortgageTypeError.classList.add("hidden");
  } else {
    mortgageTypeError.classList.remove("hidden");
    inputsValid = false;
  }

  return inputsValid ? true : false;
}

document.querySelector(".calc-repayments").addEventListener("click", () => {
  if (!checkInputsValidation()) return;

  emptyResult.classList.add("hidden");
  showResult.classList.remove("hidden");
  result.classList.remove("d-flex-center");

  function setMortgageAmount(monthly, n) {
    document.querySelector(".monthly-repayments .amount").textContent = `£${numberFormatter(monthly.toFixed(2))}`;
    document.querySelector(".total .amount").textContent = `£${numberFormatter((monthly * n).toFixed(2))}`;
  }

  const amount = amountInput.value.replaceAll(",", "");
  const r = rateInput.value / 100 / 12;
  const n = termInput.value * 12;

  if (repaymentInput.checked) {
    let monthly = (amount * (r * (1 + r) ** n)) / ((1 + r) ** n - 1);
    setMortgageAmount(monthly, n);
  } else {
    let monthly = amount * r;
    setMortgageAmount(monthly, n);
  }
});

document.querySelector(".clear-all").addEventListener("click", () => {
  document.querySelectorAll(".mortgage-input input").forEach((input) => (input.value = ""));
  document.querySelectorAll(".mortgage-type input").forEach((input) => (input.checked = false));
  emptyResult.classList.remove("hidden");
  showResult.classList.add("hidden");
  result.classList.add("d-flex-center");
});
