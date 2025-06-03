// Registration function
function registerUser(email, password, name, isAdmin = false) {
  utils.showLoader();
  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      return db
        .collection("users")
        .doc(user.uid)
        .set({
          email: email,
          name: name,
          role: isAdmin ? "admin" : "user",
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
    })
    .then(() => {
      logger.log(`User registered: ${email}`);
      utils.showSuccess("Registration successful!");
      utils.hideLoader();
      if (isAdmin) {
        showAdminContent();
      } else {
        showUserContent();
      }
    })
    .catch((error) => {
      logger.log(`Registration error: ${error.message}`, "error");
      utils.showError(error.message);
      utils.hideLoader();
    });
}

// Login function
function loginUser(email, password) {
  utils.showLoader();
  auth
    .signInWithEmailAndPassword(email, password)
    .then(() => {
      logger.log(`User logged in: ${email}`);
      utils.hideLoader();
    })
    .catch((error) => {
      logger.log(`Login error: ${error.message}`, "error");
      utils.showError(error.message);
      utils.hideLoader();
    });
}

// Logout function
function logoutUser() {
  auth
    .signOut()
    .then(() => {
      logger.log("User logged out");
      showPublicContent();
    })
    .catch((error) => {
      logger.log(`Logout error: ${error.message}`, "error");
      utils.showError("Error logging out. Please try again.");
    });
}

// Event listeners for auth forms
document.getElementById("register-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("register-email").value;
  const password = document.getElementById("register-password").value;
  const name = document.getElementById("register-name").value;
  registerUser(email, password, name);
});

document.getElementById("login-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("login-email").value;
  const password = document.getElementById("login-password").value;
  loginUser(email, password);
});

document.getElementById("logout-btn")?.addEventListener("click", logoutUser);
