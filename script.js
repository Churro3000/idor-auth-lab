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
  
  // Store user ID in localStorage (still insecure – for demo only)
  localStorage.setItem("userId", selectedId);
  
  // NEW: Store original ID for tamper detection (client-side simulation)
  localStorage.setItem("originalUserId", selectedId);
  
  // Hide login, show dashboard
  document.getElementById("login").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  
  loadDashboard();
});

// Load dashboard based on stored userId – now with validation
function loadDashboard() {
  const userId = localStorage.getItem("userId");
  const originalId = localStorage.getItem("originalUserId");

  // FIX 1: Reject if no ID or ID not in database
  if (!userId || !users[userId]) {
    alert("Invalid or unauthorized user ID – logging out");
    logout();
    return;
  }

  // FIX 2: Prevent tampering – check if userId matches original login ID
  if (userId !== originalId) {
    alert("Authorization failed – user ID was tampered with!");
    logout();
    return;
  }

  // FIX 3: Extra check for vertical escalation (admin access only allowed if originally selected)
  if (userId === "999" && originalId !== "999") {
    alert("Admin access denied – unauthorized privilege escalation attempt");
    logout();
    return;
  }

  const user = users[userId];

  // Load user data safely
  document.getElementById("username").textContent = user.username;
  document.getElementById("userId").textContent = userId;
  document.getElementById("fullName").textContent = user.fullName;
  document.getElementById("email").textContent = user.email;
  document.getElementById("balance").textContent = user.balance;
  document.getElementById("secret").textContent = user.secret;
}

// Logout – clear all stored data
document.getElementById("logout").addEventListener("click", () => {
  logout();
});

// Helper function to clean up and reset
function logout() {
  localStorage.removeItem("userId");
  localStorage.removeItem("originalUserId");
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("login").classList.remove("hidden");
}

// Auto-load if already "logged in" – but still validate
if (localStorage.getItem("userId")) {
  document.getElementById("login").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  loadDashboard();
}
