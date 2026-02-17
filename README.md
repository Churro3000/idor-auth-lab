# IDOR & Authorization Lab

**⚠️ Disclaimer:** This is an intentionally vulnerable demo for educational purposes only. Do not use in production or with real data. The goal is to learn about Insecure Direct Object Reference (IDOR) and broken authorization.

## Overview

This static web app simulates a multi-user dashboard with private profiles. It demonstrates:

* Insecure Direct Object Reference (IDOR): Predictable user IDs allow accessing other users' data.

* Broken Authorization: No server-side checks; client-side storage (localStorage) can be tampered with.

* Horizontal Escalation: Switching to another regular user's data.

* Vertical Escalation: Gaining admin privileges by guessing the ID.

The app uses client-side JS to "authenticate" and load data. In real apps, this would be server-side — here it's simulated to show the risks.

Live demo: https://YOUR-USERNAME.github.io/idor-auth-lab/ (replace YOUR-USERNAME with your GitHub username)

## Prerequisites

* Any modern browser (Chrome/Firefox recommended for DevTools)

* No installation needed — runs directly on GitHub Pages

## How to Use the Lab (Basic Flow)

1. Open the live site in your browser.

2. On the login screen, you'll see a dropdown with users: alice (ID 1), bob (ID 2), charlie (ID 3), admin (ID 999).

3. Select a user (e.g., alice) and click "Login as selected user".

4. You'll see the dashboard with that user's private data: User ID, Full Name, Email, Balance, and a Secret Note (hidden for normal users).

5. The app "authenticates" by storing the user ID in localStorage — this is the core insecurity.

6. To logout, click the "Logout" button — this removes the ID from localStorage and returns to login.

## Step-by-Step Guide to Exploiting the Vulnerabilities (The "Break In")

This section shows how to exploit IDOR and broken authorization. We'll use browser DevTools to tamper with the client-side "auth".

### Exploit 1: Horizontal Privilege Escalation (Access Another User's Data via IDOR)

1. Log in as a normal user: Select "alice (user)" from the dropdown and click "Login".

2. Verify you're seeing Alice's data: User ID: 1, Full Name: Alice Wonderland, Email: alice@company.com, Balance: 1,250.00, Secret Note: Not visible to normal users.

3. Open DevTools: Press F12 (or Ctrl+Shift+I on Windows/Linux, Cmd+Option+I on Mac).

4. Go to the "Application" tab (in Chrome) or "Storage" tab (in Firefox).

5. Expand "Local Storage" → click on your site's domain (e.g., https://yourusername.github.io).

6. You'll see a key-value pair: userId with value "1".

7. Double-click the value "1" and change it to "2" (Bob's ID) — this is the IDOR exploit, as IDs are predictable and not checked.

8. Press Enter to save the change.

9. Refresh the page (F5 or Ctrl+R).

10. Now you're seeing Bob's private data without logging in as him: User ID: 2, Full Name: Bob Builder, Email: bob@company.com, Balance: 47,890.50.

11. Repeat: Change to "3" for Charlie's data.

12. Why this works: The app trusts client-side storage without validation — attacker guesses/changes the direct object reference (user ID).

### Exploit 2: Vertical Privilege Escalation (Gain Admin Access)

1. Log in as a normal user (e.g., alice, ID 1).

2. Open DevTools → Application → Local Storage → change userId from "1" to "999" (admin's ID).

3. Press Enter to save.

4. Refresh the page.

5. Now you're "admin": User ID: 999, Full Name: System Administrator, Email: admin@company.com, Balance: ∞, and the Secret Note shows: "FLAG{you_just_bypassed_authorization_checks}".

6. This shows vertical escalation: Gaining higher privileges (admin secret visible) by tampering with the ID.

7. Note: In real apps, this could allow deleting users, viewing all data, etc. Here it's simulated with a flag.

## Additional Exploit Tips

* Predictable IDs: Users are 1–3, admin 999 — easy to guess. In real IDOR, IDs might be /user/12345 — change to 12346 to see next user's stuff.

* Tools for real pentesting: Use Burp Suite to intercept and modify requests (here it's client-side, so DevTools works).

* Impact: Data leakage, account takeover, privilege escalation.

* Try on mobile: Use browser inspect tools or apps like Eruda for DevTools on phone.


## How to Fix the Vulnerabilities (The Patch)

This section shows how to secure the app against IDOR and broken authorization. We'll start with client-side fixes (for learning/demo), then explain the real-world server-side solution.

### Client-Side Fix (Simulation – Not Production-Grade)

1. **Add ID validation before loading data**  
   Open `script.js` and update the `loadDashboard()` function:

   ```javascript
   function loadDashboard() {
     const userId = localStorage.getItem("userId");

     // Prevent invalid or missing IDs
     if (!userId || !users[userId]) {
       alert("Invalid or unauthorized user ID – logging out");
       localStorage.removeItem("userId");
       window.location.reload();
       return;
     }

     const user = users[userId];

     // Optional: restrict admin access (demo only)
     if (userId === "999" && userId !== localStorage.getItem("originalUserId")) {
       alert("Admin access denied – unauthorized elevation attempt");
       localStorage.removeItem("userId");
       window.location.reload();
       return;
     }

     // Load user data safely
     document.getElementById("username").textContent = user.username;
     document.getElementById("userId").textContent = userId;
     document.getElementById("fullName").textContent = user.fullName;
     document.getElementById("email").textContent = user.email;
     document.getElementById("balance").textContent = user.balance;
     document.getElementById("secret").textContent = user.secret;
   }
