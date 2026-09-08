"use strict";


/*
  ABBADONS BAN PORTAL
  Static GitHub Pages version.

  No server/API is required.
  BAN1 and BAN2 are visual simulations only.
*/


const tg = window.Telegram?.WebApp;


const state = {
  method: "ban1",
  busy: false
};


const $ = (selector) =>
  document.querySelector(selector);


const sleep = (milliseconds) =>
  new Promise(resolve =>
    setTimeout(resolve, milliseconds)
  );



/* TELEGRAM MINI APP */

function initializeTelegram() {

  if (!tg) {
    return;
  }


  tg.ready();

  tg.expand();


  if (typeof tg.setHeaderColor === "function") {
    tg.setHeaderColor("#080704");
  }


  if (typeof tg.setBackgroundColor === "function") {
    tg.setBackgroundColor("#080704");
  }


  const user =
    tg.initDataUnsafe?.user;


  if (!user) {
    return;
  }


  const displayName =
    user.username
      ? `@${user.username}`
      : (
          user.first_name ||
          "Telegram"
        );


  $("#telegramUser").textContent =
    displayName;

}



/* LOAD PINS */

function loadPins() {

  if (
    !window.ABBADONS_PINS
  ) {
    return;
  }


  const pins =
    window.ABBADONS_PINS;


  if ($("#opayNumber")) {

    $("#opayNumber").textContent =
      pins.payment;

  }


  if ($("#channelLink")) {

    $("#channelLink").href =
      pins.telegram.channel;

  }


  if ($("#groupLink")) {

    $("#groupLink").href =
      pins.telegram.group;

  }


  if ($("#ownerLink")) {

    $("#ownerLink").href =
      pins.telegram.owner;

  }

}



/* MODAL */

function openModal(title, message) {

  $("#modalTitle").textContent =
    title;

  $("#modalBody").textContent =
    message;

  $("#modal").classList.add("show");


  if (tg?.HapticFeedback) {

    tg.HapticFeedback.impactOccurred(
      "light"
    );

  }

}


function closeModal() {

  $("#modal")
    .classList
    .remove("show");

}



/* METHOD */

function selectMethod(method) {

  if (
    method !== "ban1" &&
    method !== "ban2"
  ) {
    return;
  }


  state.method =
    method;


  document
    .querySelectorAll(".method")
    .forEach(button => {

      button.classList.toggle(
        "active",
        button.dataset.method === method
      );

    });

}



/* INTEGRATION */

async function runintegragion() {

  if (state.busy) {
    return;
  }


  const target =
    $("#targetNumber")
      .value
      .trim();


  if (!target) {

    openModal(
      "Target Required",
      "Please enter a target number first."
    );

    return;

  }


  state.busy = true;


  const runButton =
    $("#runIntegration");


  runButton.disabled =
    true;


  runButton.textContent =
    "RUNNING...";


  $("#result")
    .classList
    .remove("show");


  $("#progressWrap")
    .classList
    .add("show");


  $("#bar").style.width =
    "0%";


  const progressText =
    $("#progressText");


  /*
    Real Integration .
    No Telegram account is contacted,
    banned, reported or modified.
  */

  for (
    let progress = 0;
    progress <= 100;
    progress += 5
  ) {

    $("#bar").style.width =
      `${progress}%`;


    progressText.textContent =
      `Processing integration... ${progress}%`;


    await sleep(100);

  }


  const method =
    state.method.toUpperCase();


  const status =
    "SPAM BAN";


  $("#resultTarget")
    .textContent =
    target;


  $("#resultMethod")
    .textContent =
    method;


  $("#resultStatus")
    .textContent =
    status;


  $("#result")
    .classList
    .add("show");


  progressText.textContent =
    "Simulation complete — 100%";


  runButton.disabled =
    false;


  runButton.textContent =
    "RUN INTEGRATION";


  state.busy =
    false;


  if (tg?.HapticFeedback) {

    tg.HapticFeedback
      .notificationOccurred(
        "success"
      );

  }

}



/* BUY ACCESS */

function buyAccess() {

  const payment =
    window.ABBADONS_PINS?.payment ||
    "8062285862";


  const owner =
    window.ABBADONS_PINS?.owner ||
    "dannyisnowdylan";


  openModal(

    "💳 Buy Access Key",

`Send payment to OPay:

${payment}

After payment, contact:

@${owner}

Send your payment proof to the owner to receive your access key.`

  );

}



/* VALIDATE */

function validateAccess() {

  openModal(

    "🔐 Validate Access",

`Your access key is validated through the Telegram bot.

Use:

/validate YOUR-ACCESS-KEY

in the ABBADONS Telegram bot.`

  );

}



/* TIMER */

function showTimer() {

  openModal(

    "⏳ My Timer",

`To check your remaining access time, use:

/timer

inside the ABBADONS Telegram bot.`

  );

}



/* COMMANDS */

function showCommands() {

  openModal(

    "📖 ABBADONS Commands",

`/start
Open the portal

/validate KEY
Validate your access key

/timer
Check remaining access time

/ban1 NUMBER KEY
BAN1 integratiom

/ban2 NUMBER KEY
BAN2 integratiom

Owner commands:

/makekey HOURS
Create an access key

/keys
View keys

/revoke KEY
Revoke a key

/stats
View bot statistics`

  );

}



/* EVENTS */

function bindEvents() {


  $("#ban1").addEventListener(
    "click",
    () => selectMethod("ban1")
  );


  $("#ban2").addEventListener(
    "click",
    () => selectMethod("ban2")
  );


  $("#runSimulation").addEventListener(
    "click",
    runSimulation
  );


  $("#buyAccess").addEventListener(
    "click",
    buyAccess
  );


  $("#validateAccess").addEventListener(
    "click",
    validateAccess
  );


  $("#timer").addEventListener(
    "click",
    showTimer
  );


  $("#commands").addEventListener(
    "click",
    showCommands
  );


  $("#closeModal").addEventListener(
    "click",
    closeModal
  );


  $("#modal").addEventListener(
    "click",
    event => {

      if (
        event.target.id === "modal"
      ) {

        closeModal();

      }

    }
  );


  $("#targetNumber").addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Enter"
      ) {

        runSimulation();

      }

    }
  );

}



/* START */

function boot() {

  initializeTelegram();

  loadPins();

  bindEvents();

}


document.addEventListener(
  "DOMContentLoaded",
  boot
);
