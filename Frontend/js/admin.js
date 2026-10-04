
const API_URL = "http://localhost:3000";

const token = localStorage.getItem("token");

const candidateList = document.getElementById("candidateList");
const resultsList = document.getElementById("resultsList");
const candidateForm = document.getElementById("candidateForm");

let editingCandidateID = null;

// 1. Check whether user is logged in
if (!token) {
    window.location.href = "index.html";
}

// 2. Common API function
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
        throw new Error(data.error || data.message || "Request failed");
    }

    return data;
}


// 3. Verify admin role
async function checkAdmin() {

    try {

        const data = await apiRequest("/user/profile");

        const user = data.user;

        if (!user || user.role !== "admin") {

            alert("Access denied! Admin only.");

            window.location.href = "dashboard.html";

            return false;
        }

        document.getElementById("adminName").textContent =
            `Welcome, ${user.name}`;

        document.getElementById("accessMessage").textContent =
            "Admin access verified successfully.";

        return true;

    } catch (error) {

        console.error(error);

        localStorage.removeItem("token");

        window.location.href = "index.html";

        return false;
    }
}


// 4. Add or update candidate
candidateForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const name = document.getElementById("candidateName").value.trim();

    const party = document.getElementById("candidateParty").value.trim();

    const age = Number(document.getElementById("candidateAge").value);

    const formMessage = document.getElementById("formMessage");

    if (!name || !party || !Number.isInteger(age) || age < 18) {
        formMessage.textContent = "Enter valid candidate details. Age must be at least 18.";
        return;
    }

    const candidateData = {
        name,
        party,
        age
    };

    try {

        const submitBtn = document.getElementById("submitBtn");

        submitBtn.disabled = true;

        if (editingCandidateID) {

            await apiRequest(`/candidate/${editingCandidateID}`, {
                method: "PUT",
                body: JSON.stringify(candidateData)
            });

            formMessage.textContent = "Candidate updated successfully!";

        } else {

            await apiRequest("/candidate/", {
                method: "POST",
                body: JSON.stringify(candidateData)
            });

            formMessage.textContent = "Candidate added successfully!";
        }

        candidateForm.reset();

        editingCandidateID = null;

        submitBtn.textContent = "Add Candidate";

        await loadCandidates();

        await loadResults();

    } catch (error) {

        formMessage.textContent = error.message;

    } finally {

        document.getElementById("submitBtn").disabled = false;
    }
});


// 5. Load all candidates
async function loadCandidates() {

    try {

        const candidates = await apiRequest("/candidate/");

        candidateList.replaceChildren();

        if (!Array.isArray(candidates) || candidates.length === 0) {

            candidateList.textContent = "No candidates available.";

            return;
        }

        candidates.forEach(candidate => {

            const card = document.createElement("div");

            card.className = "candidate-admin-card";

            const name = document.createElement("h3");
            name.textContent = candidate.name;

            const party = document.createElement("p");
            party.textContent = `Party: ${candidate.party}`;

            const age = document.createElement("p");
            age.textContent = `Age: ${candidate.age}`;

            const votes = document.createElement("p");
            votes.textContent = `Votes: ${candidate.voteCount}`;

            const actions = document.createElement("div");
            actions.className = "candidate-actions";

            const editBtn = document.createElement("button");
            editBtn.textContent = "Edit";
            editBtn.className = "edit-btn";

            editBtn.addEventListener("click", () => {
                editCandidate(candidate);
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.className = "delete-btn";

            deleteBtn.addEventListener("click", () => {
                deleteCandidate(candidate._id);
            });

            actions.append(editBtn, deleteBtn);

            card.append(name, party, age, votes, actions);

            candidateList.appendChild(card);
        });

    } catch (error) {

        candidateList.textContent = "Unable to load candidates: " + error.message;
    }
}


// 6. Edit candidate
function editCandidate(candidate) {

    editingCandidateID = candidate._id;

    document.getElementById("candidateName").value = candidate.name;

    document.getElementById("candidateParty").value = candidate.party;

    document.getElementById("candidateAge").value = candidate.age;

    document.getElementById("submitBtn").textContent = "Update Candidate";

    document.getElementById("formMessage").textContent =
        "Editing candidate: " + candidate.name;

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


// 7. Delete candidate
async function deleteCandidate(candidateID) {

    const confirmed = confirm(
        "Are you sure you want to delete this candidate?"
    );

    if (!confirmed) return;

    try {

        await apiRequest(`/candidate/${candidateID}`, {
            method: "DELETE"
        });

        alert("Candidate deleted successfully!");

        await loadCandidates();

        await loadResults();

    } catch (error) {

        alert(error.message);
    }
}


// 8. Load election results
async function loadResults() {

    try {

        const data = await apiRequest("/candidate/vote/count");

        resultsList.replaceChildren();

        if (!data.voteRecord || data.voteRecord.length === 0) {

            resultsList.textContent = "No election results available.";

            return;
        }

        data.voteRecord.forEach(record => {

            const row = document.createElement("div");

            row.className = "result-row";

            const party = document.createElement("strong");
            party.textContent = record.party;

            const count = document.createElement("span");
            count.textContent = `${record.count} votes`;

            row.append(party, count);

            resultsList.appendChild(row);
        });

    } catch (error) {

        resultsList.textContent = "Unable to load results.";
        console.error(error);
    }
}


// 9. Logout
document.getElementById("logoutBtn").addEventListener("click", () => {

    localStorage.removeItem("token");

    window.location.href = "index.html";
});


// 10. Start dashboard only after admin verification
async function initializeAdminDashboard() {

    const isAdmin = await checkAdmin();

    if (!isAdmin) return;

    await loadCandidates();

    await loadResults();
}

if (token) {
    initializeAdminDashboard();
}