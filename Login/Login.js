const loginForm = document.querySelector(".login-form");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = event.target[0].value;
    const password = event.target[1].value;
    const button = event.target[3];

    if (!email) {
        alert("Email is required");
        return;
    }
    if (!password) {
        alert("Password is required");
        return;
    }
    button.disabled = true;
    button.textContent = "Logging In...";


    const userData = { email, password };
    try {
        const user = await loginUser(userData);
        console.log(user);
        button.textContent = "Logged In";
        button.backgroundColor = "green";
        if (user) {
            const userCredentials = {
                userId: `${user.user._id}`,
                isUserLoggedIn: true
            };
            localStorage.setItem("taskManager", JSON.stringify(userCredentials));
            window.location.replace("../TaskManager/taskManager.html");
        }
    } catch (error) {
        button.textContent = "Failed To Login";
        button.backgroundColor = "red";
        alert("Error during login. Please try again.");
    }
});

// const apiUrl = "https://task-management-api-uaxo.onrender.com/api/v1/users/loginUser";
const apiUrl = "http://localhost:5000/api/v1/users/loginUser"
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

const showPassword = document.querySelector(".password-Show")
const passwordInput = document.querySelector("#password");

showPassword.addEventListener("click", () => {
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
    } else {
        passwordInput.type = "password";
    }
});