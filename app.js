function toggleSetupGuideStepsBody() {
  const contentDiv = document.querySelector(".setup-guide-steps-body-div");
  const computedStyle = getComputedStyle(contentDiv);
  if (computedStyle.display === "none") {
    contentDiv.style.display = "block";
    document.querySelector(
      ".setup-guide-upper-grid-dropdown-arrow-button > svg:nth-child(1)"
    ).style.display = "none";
    document.querySelector(
      ".setup-guide-upper-grid-dropdown-arrow-button > svg:nth-child(2)"
    ).style.display = "block";
  } else {
    contentDiv.style.display = "none";
    document.querySelector(
      ".setup-guide-upper-grid-dropdown-arrow-button > svg:nth-child(2)"
    ).style.display = "none";
    document.querySelector(
      ".setup-guide-upper-grid-dropdown-arrow-button > svg:nth-child(1)"
    ).style.display = "block";
  }
}

function displaySetupGuideEachStepDiv(number) {
  const allDivs = document.querySelectorAll(".setup-guide-each-step-div");

  allDivs.forEach((div, index) => {
    const isActive = index + 1 === number;
    div.classList.toggle("active-setup-guide-each-step-div", isActive);
    const guideStepBody = div.querySelector(".setup-guide-each-step-body-div");
    const guideStepImage = div.querySelector(".setup-guide-each-step-image");
    guideStepBody.style.display = isActive ? "block" : "none";
    guideStepImage.style.display = isActive ? "block" : "none";
    const fontWeight = isActive ? "600" : "500";
    div.querySelector(".setup-guide-each-step-toggle-button").style.fontWeight =
      fontWeight;
    if (number === 1) {
      document.querySelector(".setup-progress-div").style.marginBottom = "22px";
    } else
      document.querySelector(".setup-progress-div").style.marginBottom = "30px";
  });
}

function displayNotificationMenu() {
  const notificationMenuDiv = document.querySelector(
    ".notification-dropdown-menu"
  );
  const computedStyle = getComputedStyle(notificationMenuDiv);
  if (computedStyle.display === "none") {
    const merchantMenuDiv = document.querySelector(".merchant-dropdown-menu");
    const computedStyle = getComputedStyle(merchantMenuDiv);
    if (computedStyle.display === "block") {
      merchantMenuDiv.style.display = "none";
    }
    notificationMenuDiv.style.display = "block";
  } else {
    notificationMenuDiv.style.display = "none";
  }
  toggleAriaExpanded("header-notification-button");
}

function toggleAriaExpanded(id) {
  const menuTriggerButton = document.querySelector(`#${id}`);
  const expansionState = menuTriggerButton.getAttribute("aria-expanded");
  if (expansionState === "true") {
    menuTriggerButton.setAttribute("aria-expanded", "false");
  } else {
    menuTriggerButton.setAttribute("aria-expanded", "true");
  }
}

function menuEscapeKeyPress(event, menuDiv, menuTriggerButton) {
  if (event.key === "Escape") {
    menuDiv.style.display = "none";
    document.querySelector(`.${menuTriggerButton}`).focus();
  }
}

function menuArrowKeyPress(event, menuItemIndex, menuItems) {
  if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
    if (menuItemIndex === 0) {
      menuItems.item(menuItems.length - 1).focus();
    } else {
      menuItems.item(menuItemIndex - 1).focus();
    }
  } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
    if (menuItemIndex === menuItems.length - 1) {
      menuItems.item(0).focus();
    } else {
      menuItems.item(menuItemIndex + 1).focus();
    }
  }
}

function displayMerchantDropdownMenu() {
  const merchantMenuDiv = document.querySelector("#merchant-dropdown-menu");
  const computedStyle = getComputedStyle(merchantMenuDiv);
  if (computedStyle.display === "none") {
    const notificationMenuDiv = document.querySelector(
      ".notification-dropdown-menu"
    );
    const computedStyle = getComputedStyle(notificationMenuDiv);
    if (computedStyle.display === "block") {
      notificationMenuDiv.style.display = "none";
    }
    merchantMenuDiv.style.display = "block";
  } else {
    merchantMenuDiv.style.display = "none";
  }
  toggleAriaExpanded("header-merchant-profile-button");
  const menuItems = merchantMenuDiv.querySelectorAll("[role='menuitem']");
  menuItems.item(0).focus();
  merchantMenuDiv.addEventListener("keyup", (event) =>
    menuEscapeKeyPress(event, merchantMenuDiv, "header-merchant-profile-button")
  );
  menuItems.forEach((menuItem, menuItemIndex) => {
    menuItem.addEventListener("keyup", (event) =>
      menuArrowKeyPress(event, menuItemIndex, menuItems)
    );
  });
}

function dismissSelectPlan() {
  document.querySelector(".select-a-plan-div").style.display = "none";
}

const stepCompletionStatus = [false, false, false, false, false];

function completeSetupGuideStep(number) {
  if (stepCompletionStatus[number - 1]) {
    displaySetupGuideEachStepDiv(number);
  } else {
    const nextIncompleteStep = findNextIncompleteStep(number);

    if (nextIncompleteStep !== -1) {
      displaySetupGuideEachStepDiv(nextIncompleteStep);
    }
  }
  stepCompletionStatus[number - 1] = !stepCompletionStatus[number - 1];

  updateProgressBar();
}

function updateProgressBar() {
  const completedSteps = stepCompletionStatus.filter((status) => status).length;
  document.querySelector(
    ".setup-progress-div span"
  ).textContent = `${completedSteps} / 5 completed`;
  const completionPercentage = (completedSteps / 5) * 100;
  document.querySelector(
    ".setup-progress-bar-inner-div"
  ).style.width = `${completionPercentage}%`;
}

window.onload = function () {
  updateProgressBar();
};

function findNextIncompleteStep(currentStep) {
  for (let i = currentStep; i < stepCompletionStatus.length; i++) {
    if (!stepCompletionStatus[i]) {
      return i + 1;
    }
  }
  return -1;
}

function toggleActiveClass(checkbox, number) {
  const currentStep = checkbox.closest(".setup-guide-each-step-div");
  const clickedInputImages = currentStep.querySelectorAll(
    ".completion-check-image"
  );

  if (checkbox.checked) {
    let index = 0;
    const intervalId = setInterval(() => {
      if (index > 0) {
        clickedInputImages[index - 1].classList.remove("active");
      }
      clickedInputImages[index].classList.add("active");
      index++;
      if (index === clickedInputImages.length) {
        clearInterval(intervalId);
      }
    }, 100);
    setTimeout(() => {
      completeSetupGuideStep(number);
    }, 500);
  } else {
    clickedInputImages.forEach((image, index) => {
      if (index > 0) {
        image.classList.remove("active");
      } else {
        image.classList.add("active");
      }
    });
    completeSetupGuideStep(number);
  }
}

function handleCheckKeyDown(event, number) {
  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    const checkbox = document.getElementById("checkInput" + number);
    checkbox.checked = !checkbox.checked;
    toggleActiveClass(checkbox, number);
  }
}

// function to open and close alerts
const openAlert = () => {
  let alertPanel = document.querySelector(".alerts");
  let buttonPanel = document.querySelector("header .notifications button");

  alertPanel.classList.toggle("active");
  buttonPanel.classList.toggle("started");

  document.onclick = function (e) {
    if (!alertPanel.contains(e.target) && !buttonPanel.contains(e.target)) {
      alertPanel.classList.remove("active");
      buttonPanel.classList.remove("started");
    }
  };
};

// function to open and close drop down menu
const openMenu = () => {
  let dropDown = document.querySelector(".drop-down");
  let buttonDown = document.querySelector("header nav button");

  dropDown.classList.toggle("active-two");
  buttonDown.classList.toggle("started-two");

  document.onclick = function (e) {
    if (!dropDown.contains(e.target) && !buttonDown.contains(e.target)) {
      dropDown.classList.remove("active-two");
      buttonDown.classList.remove("started-two");
    }
  };
};

// function to close first section AD
const closePromo = () => {
  let promo = document.querySelector(".promo");
  promo.style.opacity = "0";
};

// function to open and close setup dashboard
const openDash = () => {
  let dashboard = document.querySelector(".setup-guide");
  let dashboardButton = document.querySelector(".arrow-one");
  let dashboardButtonTwo = document.querySelector(".arrow-two");

  dashboard.classList.toggle("expand");
  dashboardButton.classList.toggle("expand-one");
  dashboardButtonTwo.classList.toggle("expand-two");
};
