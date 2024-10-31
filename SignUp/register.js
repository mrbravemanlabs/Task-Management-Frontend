const registerForm = document.querySelector(".register-form");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const fullName = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;
    const avatarImage = event.target[4].files[0];
    const button = event.target[5];

    // Validate form fields
    if (!email || !password || !fullName || !avatarImage) {
        alert("All fields are required");
        return;
    }

    // Update button state
    button.disabled = true;
    button.textContent = "Registering...";
    button.style.backgroundColor = "red";

    // Upload avatar image
    let imageUploadResult = await uploadImageToCloudinary(avatarImage);
    if (!imageUploadResult) {
        alert("Image upload failed.");
        resetButtonState(button);
        return;
    }

    // Create user data object
    const userData = {
        email,
        password,
        fullName,
        fileUrl: imageUploadResult.imageUrl,
        imagePublicId: imageUploadResult.imagePublicId,
    };

    try {
        // Register user
        const user = await registerUser(userData);
        if (user) {
            button.textContent = "Registered";
            const userCredentials = {
                userId: user.createdUser._id,
                isUserLoggedIn: true,
            };
            localStorage.setItem("taskManager", JSON.stringify(userCredentials));
            window.location.replace("../Login/Login.html");
        } else {
            alert("Registration failed. Please check your credentials.");
            resetButtonState(button);
        }
    } catch (error) {
        console.error("Error during registration:", error);
        alert("Error during registration. Please try again.");
        resetButtonState(button);
    }

    // Reset form after successful or unsuccessful registration
    registerForm.reset();
});

// Helper function to reset button state
function resetButtonState(button) {
    button.disabled = false;
    button.textContent = "Register";
    button.style.backgroundColor = ""; // Revert to the default color
}

async function uploadImageToCloudinary(file) {
    const url = `https://api.cloudinary.com/v1_1/diyhkjyn2/upload`;
    const uploadPreset = "ml_default";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData,
        });
        const data = await response.json();

        if (!data.secure_url) {
            alert("Image upload failed. Please try again.");
            return null;
        }
        return { imageUrl: data.secure_url, imagePublicId: data.public_id };
    } catch (error) {
        console.error("Error uploading image:", error);
        alert("Error uploading image. Please try again.");
        return null;
    }
}

const apiUrl = "https://task-management-api-uaxo.onrender.com/api/v1/users/registerUser";
async function registerUser(userData) {
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': "application/json",
            },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (!data?.userCreated) {
            alert(data.message || "User registration failed.");
            return null;
        }
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        alert("Fetch error. Please try again.");
        return null;
    }
}

const showPassword = document.querySelector(".password-Show");
const passwordInput = document.querySelector("#password");

showPassword.addEventListener("click", () => {
    passwordInput.type = passwordInput.type === "password" ? "text" : "password";
});
