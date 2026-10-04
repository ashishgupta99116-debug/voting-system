
const API_URL = "http://localhost:3000";

const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const aadhaarcardnumber =
        document.getElementById("aadhaarcardnumber").value;

    const password =
        document.getElementById("password").value;

    const message = document.getElementById("message");
    const loginBtn = document.getElementById("loginBtn");

    try {

        loginBtn.disabled = true;
        loginBtn.textContent = "Logging in...";

        const response = await fetch(`${API_URL}/user/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                aadhaarcardnumber,
                password
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Login failed"
            );
        }

        // Store JWT token
        localStorage.setItem("token", data.token);

        message.style.color = "green";
        message.textContent = "Login successful!";

        // Redirect to dashboard
        window.location.href = "dashboard.html";

    }

    catch (error) {

        message.style.color = "red";
        message.textContent = error.message;

    }

    finally {

        loginBtn.disabled = false;
        loginBtn.textContent = "Login";

    }

});