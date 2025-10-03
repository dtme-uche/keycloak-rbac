const express = require("express");
const session = require("express-session");
const Keycloak = require("keycloak-connect");

const app = express();

// --- Session setup ---
const memoryStore = new session.MemoryStore();
app.use(
  session({
    secret: "someSecretValue", // Change for production
    resave: false,
    saveUninitialized: true,
    store: memoryStore,
  })
);

// --- Keycloak setup ---
const keycloak = new Keycloak({ store: memoryStore });
app.use(keycloak.middleware());

// --- Helper function for layout ---
function renderPage(title, content) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background: linear-gradient(to right, #667eea, #764ba2);
          color: #333;
          margin: 0;
          padding: 0;
          text-align: center;
        }
        header {
          background: #fff;
          padding: 20px;
          box-shadow: 0px 2px 6px rgba(0,0,0,0.2);
        }
        header h1 {
          margin: 0;
          font-size: 28px;
          color: #444;
        }
        main {
          margin: 40px auto;
          padding: 20px;
          max-width: 600px;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0px 4px 12px rgba(0,0,0,0.15);
        }
        a.button {
          display: inline-block;
          margin: 10px;
          padding: 12px 20px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          color: #fff;
          background: #667eea;
          transition: background 0.3s, transform 0.2s;
        }
        a.button:hover {
          background: #5563c1;
          transform: scale(1.05);
        }
        a.button.pulse {
          animation: pulse 1.5s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        footer {
          margin-top: 40px;
          padding: 15px;
          background: #fff;
          font-size: 14px;
          color: #555;
          box-shadow: 0px -2px 6px rgba(0,0,0,0.1);
        }
      </style>
    </head>
    <body>
      <header>
        <h1>🔐 Platview Demo App</h1>
      </header>
      <main>
        ${content}
      </main>
      <footer>
        Powered by Keycloak RBAC Demo | Node.js + Express
      </footer>
    </body>
    </html>
  `;
}

// --- Public route (Home) ---
app.get("/", (req, res) => {
  res.send(
    renderPage(
      "Welcome",
      `
        <h2>Welcome to the Demo App</h2>
        <p>Choose a section below to explore Role-Based Access Control (RBAC).</p>
        <a class="button" href="/user">👤 User Page</a>
        <a class="button" href="/manager">👔 Manager Page</a>
        <a class="button" href="/admin">⚡ Admin Page</a>
        <br/><br/>
        <a class="button" href="/logout">🚪 Logout</a>
      `
    )
  );
});

// --- Role-protected routes ---
app.get("/user", keycloak.protect("realm:user"), (req, res) => {
  res.send(
    renderPage(
      "User Dashboard",
      `
        <h2>👤 Hello User!</h2>
        <p>You are logged in successfully and can access user resources.</p>
        <a class="button" href="/logout">🚪 Logout</a>
      `
    )
  );
});

app.get("/manager", keycloak.protect("realm:manager"), (req, res) => {
  res.send(
    renderPage(
      "Manager Dashboard",
      `
        <h2>👔 Hello Manager!</h2>
        <p>You have access to manager resources. Use this responsibly.</p>
        <a class="button" href="/logout">🚪 Logout</a>
      `
    )
  );
});

app.get("/admin", keycloak.protect("realm:admin"), (req, res) => {
  res.send(
    renderPage(
      "Admin Dashboard",
      `
        <h2>⚡ Hello Admin!</h2>
        <p>You have full access to the application. Manage wisely!</p>
        <a class="button" href="/logout">🚪 Logout</a>
      `
    )
  );
});

// --- Logout route ---
app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    const redirectUri = encodeURIComponent("http://localhost:3000/logged-out");
    const logoutUrl =
      `http://localhost:8080/realms/Platview-realm/protocol/openid-connect/logout?redirect_uri=${redirectUri}`;
    res.redirect(logoutUrl);
  });
});

// --- Custom logged-out page with countdown ---
app.get("/logged-out", (req, res) => {
  res.send(
    renderPage(
      "Logged Out",
      `
        <h2>✅ You have been logged out successfully</h2>
        <p>You will be redirected to the Home Page in 
           <span id="countdown">10</span> seconds...</p>
        <a class="button pulse" href="/">🔄 Return to Home Page</a>

        <script>
          let seconds = 10;
          const countdownEl = document.getElementById("countdown");
          const interval = setInterval(() => {
            seconds--;
            countdownEl.textContent = seconds;
            if (seconds <= 0) {
              clearInterval(interval);
              window.location.href = "/";
            }
          }, 1000);
        </script>
      `
    )
  );
});

// --- Error handler for failed auth ---
app.use((err, req, res, next) => {
  if (err && err.name === "AccessDeniedError") {
    req.session.destroy(() => {
      res.redirect("/"); // clear session and go back home
    });
  } else {
    next(err);
  }
});

// --- Start server ---
app.listen(3000, () => {
  console.log("✅ App is running at http://localhost:3000");
});

