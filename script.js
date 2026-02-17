// Fake "database" — never do this in real life
const users = {
  "1": {
    username: "alice",
    fullName: "Alice Wonderland",
    email: "alice@company.com",
    balance: "1,250.00",
    secret: "Not visible to normal users"
  },
  "2": {
    username: "bob",
    fullName: "Bob Builder",
    email: "bob@company.com",
    balance: "47,890.50",
    secret: "Not visible to normal users"
  },
  "3": {
    username: "charlie",
    fullName: "Charlie Chaplin",
    email: "charlie@company.com",
    balance: "980.25",
    secret: "Not visible to normal users"
  },
  "999": {
    username: "admin",
    fullName: "System Administrator",
    email: "admin@company.com",
    balance: "∞",
    secret: "FLAG{you_just_bypassed_authorization_checks}"
  }
};

// Login form handler
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  
  const selectedId = document.getElementById("userSelect").value;
  
  // Store user ID in localStorage (very insecure!)
  localStorage.setItem("userId", selectedId);
  
  // Hide login, show dashboard
  document.getElementById("login").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  
  loadDashboard();
});

// Load dashboard based on stored userId
function loadDashboard() {
  const userId = localStorage.getItem("userId");
  const user = users[userId] || users["1"]; // fallback to alice if invalid

  document.getElementById("username").textContent = user.username;
  document.getElementById("userId").textContent = userId;
  document.getElementById("fullName").textContent = user.fullName;
  document.getElementById("email").textContent = user.email;
  document.getElementById("balance").textContent = user.balance;
  document.getElementById("secret").textContent = user.secret;
}

// Logout
document.getElementById("logout").addEventListener("click", () => {
  localStorage.removeItem("userId");
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
});

// Auto-load if already "logged in"
if (localStorage.getItem("userId")) {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  loadDashboard();
}
