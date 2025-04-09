const API_URL = "http://localhost:3000";

// Registrer bruker
function register() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch(API_URL + "/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        document.getElementById("message").innerText = data.message;
    });
}

// Logg inn
function login() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    fetch(API_URL + "/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.username) {
            sessionStorage.setItem("loggedInUser", data.username);
            window.location.href = "home.html";
        } else {
            document.getElementById("message").innerText = data.message;
        }
    });
}

// Logg ut
function logout() {
    sessionStorage.removeItem("loggedInUser");
    window.location.href = "index.html";
}

// Slett bruker
function deleteUser() {
    let username = sessionStorage.getItem("loggedInUser");

    fetch(API_URL + "/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username })
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        sessionStorage.removeItem("loggedInUser");
        window.location.href = "index.html";
    });
}

// Oppdater velkomstmelding på home.html
window.onload = function () {
    if (window.location.pathname.includes("home.html")) {
        let user = sessionStorage.getItem("loggedInUser");
        if (user) {
            document.getElementById("welcome-message").innerText = "Velkommen, " + user + "!";
        } else {
            window.location.href = "index.html";  // Kun på home.html
        }
    }
};

