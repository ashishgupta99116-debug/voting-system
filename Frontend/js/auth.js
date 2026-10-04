
const API_URL = "https://voting-system-ygbc.onrender.com";

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

        // Step 1: Login API
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
            throw new Error(data.error || "Login failed");
        }

        // Step 2: Store JWT token
        localStorage.setItem("token", data.token);

        // Step 3: Get logged-in user's profile
        const profileResponse = await fetch(`${API_URL}/user/profile`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${data.token}`
            }
        });

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
            throw new Error(profileData.error || "Unable to fetch profile");
        }

        // Step 4: Check user's role
        const userRole = profileData.user.role;

        console.log("Logged-in user role:", userRole);

        if (userRole === "admin") {
            window.location.href = "admin.html";
        } 
        else if (userRole === "voter") {
            window.location.href = "dashboard.html";
        } 
        else {
            throw new Error("Invalid user role");
        }

    } catch (error) {
        message.style.color = "red";
        message.textContent = error.message;

        localStorage.removeItem("token");

    } finally {
        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }
});