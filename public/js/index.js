// Import Main Sass File For Webpack
import "../sass/main.scss";

(function App() {
  // Declarations
  const listItems = document.querySelectorAll(".navbar__link");
  const preloader = document.querySelector(".preloader");
  const alertsSuccess = document.querySelectorAll(".alert--success");
  const sidebarLinks = document.querySelectorAll(".sidebar__link");
  const adminLinks = document.querySelectorAll(".admin__link");
  const inputs = document.querySelectorAll(".form__input-file");
  const imgs = document.querySelectorAll(".admin__post-image");
  const fileField = document.querySelector(".form__control__file");

  // Remove Preloader After Window Load
  window.addEventListener("load", () => {
    document.body.removeChild(preloader);

    // Remove Alert After 3 seconds
    setTimeout(function() {
      if (alertsSuccess) {
        alertsSuccess.forEach(element => {
          element.style.display = "none";
        });
      }
    }, 3000);
  });

  // Set Active Class on Load
  if (listItems.length) {
    listItems.forEach(item => {
      const link = item.getAttribute("data-link");
      if (window.location.pathname == link) {
        item.classList.add("active");
      }
    });
  }

  if (sidebarLinks) {
    sidebarLinks.forEach(item => {
      const link = item.getAttribute("data-link");
      if (window.location.pathname == link) {
        item.classList.add("active");
      }
    });
  }

  if (adminLinks) {
    adminLinks.forEach(item => {
      const link = item.getAttribute("data-link");
      if (window.location.pathname == link) {
        item.classList.add("active");
      }
    });
  }

  if (inputs.length) {
    [...inputs].map(input => {
      [...imgs].map(img => {
        input.addEventListener("change", function(e) {
          const file = e.target.files[0];
          const fileReader = new FileReader();
          fileReader.addEventListener("load", function() {
            img.src = this.result;
          });
          fileField.value = file.name;
          fileReader.readAsDataURL(file);
        });
      });
    });
  }
})();
