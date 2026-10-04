
const API_URL = "https://voting-system-ygbc.onrender.com";

const signupForm = document.getElementById("signupForm");

signupForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    // Get values from the form
    const name = document.getElementById("name").value.trim();
    const age = Number(document.getElementById("age").value);
    const email = document.getElementById("email").value.trim();
    const mobilenumber = document.getElementById("mobilenumber").value.trim();
    const address = document.getElementById("address").value.trim();
    const aadhaarcardnumber =
        document.getElementById("aadhaarcardnumber").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword =
        document.getElementById("confirmPassword").value;

    const message = document.getElementById("signupMessage");
    const signupBtn = document.getElementById("signupBtn");

    // Check Aadhaar format
    if (!/^\d{12}$/.test(aadhaarcardnumber)) {
        message.style.color = "red";
        message.textContent = "Please enter a valid 12-digit Aadhaar number.";
        return;
    }

    // Check passwords
    if (password !== confirmPassword) {
        message.style.color = "red";
        message.textContent = "Passwords do not match.";
        return;
    }

    // Prepare data for backend
    const userData = {
        name,
        age,
        email,
        mobilenumber,
        address,
        aadhaarcardnumber,
        password
    };

    try {

        signupBtn.disabled = true;
        signupBtn.textContent = "Creating Account...";
        message.textContent = "";

        const response = await fetch(`${API_URL}/user/signup`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(userData)

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.error || "Signup failed. Please try again."
            );
        }

        message.style.color = "green";
        message.textContent =
            "Account created successfully! You can now login.";

        signupForm.reset();

    }

    catch (error) {

        message.style.color = "red";
        message.textContent = error.message;

    }

    finally {

        signupBtn.disabled = false;
        signupBtn.textContent = "Create Account";

    }

});