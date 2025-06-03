// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBX_fkzJmhv16sQz3vo4BrclM7_IHvJmps",
  authDomain: "soil-farming-5a75b.firebaseapp.com",
  projectId: "soil-farming-5a75b",
  storageBucket: "soil-farming-5a75b.firebasestorage.app",
  messagingSenderId: "1076214786263",
  appId: "1:1076214786263:web:7ba16923b093101318a892",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const auth = firebase.auth();

// Logging setup
const logger = {
  log: (message, level = "info") => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${level.toUpperCase()}] ${message}`);
  },
};

// Common utilities
const utils = {
  showLoader: () => (document.getElementById("loader").style.display = "block"),
  hideLoader: () => (document.getElementById("loader").style.display = "none"),
  showError: (message) => {
    const errorDiv = document.getElementById("error-message");
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
    setTimeout(() => (errorDiv.style.display = "none"), 5000);
  },
  showSuccess: (message) => {
    const successDiv = document.getElementById("success-message");
    successDiv.textContent = message;
    successDiv.style.display = "block";
    setTimeout(() => (successDiv.style.display = "none"), 5000);
  },
};

// Initialize the app based on user role
function initApp() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      checkUserRole(user.uid);
    } else {
      showPublicContent();
    }
  });
}

// Check if user is admin or regular user
function checkUserRole(uid) {
  db.collection("users")
    .doc(uid)
    .get()
    .then((doc) => {
      if (doc.exists) {
        const userData = doc.data();
        if (userData.role === "admin") {
          showAdminContent();
        } else {
          showUserContent();
        }
      } else {
        auth.signOut();
        showPublicContent();
      }
    })
    .catch((error) => {
      logger.log(`Error checking user role: ${error}`, "error");
      utils.showError("Error verifying your account. Please try again.");
    });
}

// Navigation functions with loop protection
function showPublicContent() {
  if (!window.location.href.includes("index.html")) {
    window.location.href = "index.html";
  }
}

function showAdminContent() {
  if (!window.location.href.includes("admin-dashboard.html")) {
    window.location.href = "admin-dashboard.html";
  }
}

function showUserContent() {
  if (!window.location.href.includes("user-dashboard.html")) {
    window.location.href = "user-dashboard.html";
  }
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
