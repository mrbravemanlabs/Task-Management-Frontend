const registerForm = document.querySelector(".register-form");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fullName = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;
    const avatarImage = event.target[3].files[0];

    if (!email) {
        alert("Email is required");
        return;
    }
    if (!password) {
        alert("Password is required");
        return;
    }
    if (!fullName) {
        alert("Full name is required");
        return;
    }
    if (!avatarImage) {
        alert("Avatar is required");
        return;
    }

    // Upload image to Cloudinary
    let fileUrl = await uploadImageToCloudinary(avatarImage);

    // User data to be sent to the server
    const userData = { email, password, fullName, fileUrl };

    try {
        const user = await registerUser(userData);

        if (user) {
            const userCredentials = {
                userId: `${user.createdUser._id}`,
                isUserLoggedIn: true
            };
            localStorage.setItem("taskManager", JSON.stringify(userCredentials));
            window.location.replace("../Task Manager/taskManager.html");
        } else {
            alert("Registration failed. Please check your credentials.");
        }
    } catch (error) {
        alert("Error during registration. Please try again.");
    }
    registerForm.reset();
});

async function uploadImageToCloudinary(file) {
    const url = `https://api.cloudinary.com/v1_1/diyhkjyn2/upload`;
    const uploadPreset = "ml_default";
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    try {
        const response = await fetch(url, {
            method: "POST",
            body: formData
        });
        const data = await response.json();
        return { imageUrl: data.secure_url, imagePublicId: data.public_id };
    } catch (error) {
        alert("Error uploading image. Please try again.");
        return null;
    }
}

async function deleteImageFromCloudinary(publicId) {
    try {
        const url = `https://api.cloudinary.com/v1_1/diyhkjyn2/destroy`;
        // Add logic to delete the image using the publicId
    } catch (error) {
        alert("Error deleting image. Please try again.");
    }
}

const apiUrl = "http://localhost:5000/api/v1/users/registerUser";
async function registerUser(userData) {
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(userData)
        });
        const data = await response.json();
        if (!data.userCreated) {
            alert(data.message);
            return;
        }
        return data;
    } catch (error) {
        alert("Fetch error. Please try again.");
        return null;
    }
}
