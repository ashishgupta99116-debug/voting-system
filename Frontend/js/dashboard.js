
const API_URL = "http://localhost:3000";

const token = localStorage.getItem("token");

const candidateList = document.getElementById("candidateList");
const candidateMessage = document.getElementById("candidateMessage");

// Redirect if user is not logged in
if (!token) {
    window.location.href = "index.html";
}

// Common function to communicate with backend
async function apiRequest(endpoint, options = {}) {

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            ...options.headers,
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || data.message || "Something went wrong");
    }

    return data;
}


// 1. Get logged-in user's profile
async function loadProfile() {

    try {

        const data = await apiRequest("/user/profile");
        const user = data.user;

        document.getElementById("userName").textContent = user.name;
        document.getElementById("navUserName").textContent =
            `Welcome, ${user.name}`;

        document.getElementById("profileName").textContent = user.name;
        document.getElementById("profileAge").textContent = user.age;
        document.getElementById("profileEmail").textContent =
            user.email || "Not provided";
        document.getElementById("profileMobile").textContent =
            user.mobilenumber;
        document.getElementById("profileAddress").textContent =
            user.address;

        const status = document.getElementById("votingStatus");

        if (user.isVoted) {
            status.textContent = "Vote already submitted";
        } else {
            status.textContent = "Not voted yet";
        }

        return user;

    } catch (error) {

        console.error("Profile error:", error);
        document.getElementById("userName").textContent = "Voter";
        document.getElementById("profileName").textContent =
            "Unable to load profile";

        throw error;
    }
}


// 2. Get all candidates
async function loadCandidates(user) {

    try {

        candidateMessage.textContent = "Loading candidates...";

        const candidates = await apiRequest("/candidate/");

        candidateList.replaceChildren();

        if (!Array.isArray(candidates) || candidates.length === 0) {
            candidateMessage.textContent = "No candidates available.";
            return;
        }

        candidateMessage.textContent = "";

        candidates.forEach((candidate) => {

            const card = document.createElement("div");
            card.className = "candidate-card";

            const name = document.createElement("h3");
            name.textContent = candidate.name;

            const party = document.createElement("p");
            party.textContent = `Party: ${candidate.party}`;

            const age = document.createElement("p");
            age.textContent = `Age: ${candidate.age ?? "Not provided"}`;

            const button = document.createElement("button");
            button.textContent = user.isVoted ? "Already Voted" : "Vote Now";
            button.disabled = user.isVoted;

            button.addEventListener("click", () => {
                castVote(candidate._id, button);
            });

            card.append(name, party, age, button);
            candidateList.appendChild(card);

        });

    } catch (error) {

        console.error("Candidates error:", error);
        candidateMessage.textContent =
            "Unable to load candidates: " + error.message;

    }
}


// 3. Cast vote
async function castVote(candidateID, button) {

    const confirmed = confirm("Are you sure you want to vote for this candidate?");

    if (!confirmed) return;

    try {

        button.disabled = true;
        button.textContent = "Submitting...";

        const data = await apiRequest(
            `/candidate/vote/${candidateID}`,
            { method: "POST" }
        );

        alert(data.message || "Vote recorded successfully!");

        await refreshDashboard();

    } catch (error) {

        alert(error.message);
        button.disabled = false;
        button.textContent = "Vote Now";

    }
}


// 4. Get election results
async function loadResults() {

    const resultsList = document.getElementById("resultsList");

    try {

        const data = await apiRequest("/candidate/vote/count");

        resultsList.replaceChildren();

        if (!data.voteRecord || data.voteRecord.length === 0) {
            resultsList.textContent = "No election results available.";
            return;
        }

        data.voteRecord.forEach((record) => {

            const item = document.createElement("div");
            item.className = "result-item";

            const party = document.createElement("strong");
            party.textContent = record.party;

            const count = document.createElement("span");
            count.textContent = `${record.count} votes`;

            item.append(party, count);
            resultsList.appendChild(item);

        });

    } catch (error) {

        console.error("Results error:", error);
        resultsList.textContent = "Unable to load election results.";

    }
}


// Refresh profile, candidates and results
async function refreshDashboard() {

    try {

        const user = await loadProfile();

        await loadCandidates(user);
        await loadResults();

    } catch (error) {

        console.error("Dashboard error:", error);

    }
}


// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.removeItem("token");
    window.location.href = "index.html";

});


// Initial loading
if (token) {
    refreshDashboard();
}