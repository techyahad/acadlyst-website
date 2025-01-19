// normal user's through login-page
document.addEventListener("DOMContentLoaded", () => {
    const userInfo = localStorage.getItem("userInfo");
    const loginBtn = document.getElementById("login-btn");
    const userDropdownBtn = document.getElementById("user-dropdown-btn");
    const userDropdown = document.getElementById("user-dropdown");
    const userName = document.getElementById("user-name");
    const userEmail = document.getElementById("user-email");
    const logoutBtn = document.getElementById("logout-btn");
    if (userInfo) {
      const { name, email } = JSON.parse(userInfo);
      userName.textContent = `${name}`;
      userEmail.textContent = `${email}`;
      loginBtn.style.display = "none";
      document.getElementById("user-info").style.display = "block";
    }
    userDropdownBtn.addEventListener("click", () => {
      userDropdown.style.display =
        userDropdown.style.display === "block" ? "none" : "block";
      userDropdownBtn.classList.toggle("active");
    });
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userInfo");
      window.location.href = "index.html";
    });
    document.addEventListener("click", (event) => {
      if (
        !userDropdownBtn.contains(event.target) &&
        !userDropdown.contains(event.target)
      ) {
        userDropdown.style.display = "none";
        userDropdownBtn.classList.remove("active");
      }
    });
  });


  // Google User
  document.addEventListener("DOMContentLoaded", () => {
    const userProfile = JSON.parse(localStorage.getItem("userProfile"));
    const userInfoDiv = document.getElementById("google-user-info");
    const googleLogoutBtn = document.getElementById("google-logout-btn");
    const googleUserPic = document.getElementById("google-user-pic");
    const googleUserName = document.getElementById("google-user-name");
    const googleUserEmail = document.getElementById("google-user-email");
    const googleDropdownBtn = document.getElementById("google-user-dropdown-btn");
    const googleDropdown = document.getElementById("google-user-dropdown");
    const loginBtn = document.getElementById("login-btn");
    if (userProfile) {
      googleUserPic.src = userProfile.picture;
      googleUserName.textContent = userProfile.name;
      googleUserEmail.textContent = userProfile.email;
      userInfoDiv.style.display = "flex";
      loginBtn.style.display = "none";
    }
    if (googleLogoutBtn) {
      googleLogoutBtn.addEventListener("click", () => {
        localStorage.removeItem("userProfile");
        userInfoDiv.style.display = "none";
        loginBtn.style.display = "inline-block";
      });
    }
    if (googleDropdownBtn) {
      googleDropdownBtn.addEventListener("click", () => {
        googleDropdown.style.display =
          googleDropdown.style.display === "block" ? "none" : "block";
      });
    }
    const userDropdownBtn = document.getElementById("user-dropdown-btn");
    const userDropdown = document.getElementById("user-dropdown");
    if (userDropdownBtn) {
      userDropdownBtn.addEventListener("click", () => {
        userDropdown.style.display =
          userDropdown.style.display === "block" ? "none" : "block";
      });
    }
  });
  
