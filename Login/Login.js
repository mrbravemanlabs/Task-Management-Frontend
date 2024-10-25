const loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = event.target[0].value;
    const password = event.target[1].value;

    if (!email) {
        alert("Email is required");
        return;
    }
    if (!password) {
        alert("Password is required");
        return;
    }

    const userData = { email, password };
    try {
        const user = await loginUser(userData);
        if (user) {
            const userCredentials = {
                userId: `${user.user._id}`,
                isUserLoggedIn: true
            };
            localStorage.setItem("taskManager", JSON.stringify(userCredentials));
            window.location.replace("../Task Manager/taskManager.html");
        }
    } catch (error) {
        alert("Error during login. Please try again.");
    }
});

const apiUrl = "http://localhost:5000/api/v1/users/loginUser";
async function loginUser(userData) {
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (!data.userLoggedIn) {
            alert(data.message);
            return;
        }
        return data;
    } catch (error) {
        alert("Fetch error. Please try again.");
        return null;
    }
}
