const registerForm = document.querySelector(".register-form");

registerForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    console.log(event.target);
    const fullName = event.target[0].value;
    const email = event.target[1].value;
    const password = event.target[2].value;
    const avatarImage = event.target[4].files[0];
    const button = event.target[5]

    if (!email || !password || !fullName || !avatarImage) {
        alert("All fields are required");
        return;
    }
    button.disabled = true; // Disable the submit button to prevent multiple submissions
    button.textContent = "Registering...";
    button.style.backgroundColor = "red"; // Change the button color to indicate loading

    // Wait for the image upload to complete
    let imageUploadResult = await uploadImageToCloudinary(avatarImage);
    console.log(imageUploadResult);
    if (!imageUploadResult) {
        alert("Image upload failed.");
        return; // Exit if the image upload fails
    }

    const userData = {
        email,
        password,
        fullName,
        fileUrl: `${imageUploadResult.imageUrl}`,
        imagePublicId:imageUploadResult.imagePublicId // Access the imageUrl from the upload result
    };
    console.log(userData);
    try {
        const user = await registerUser(userData);
        if (user) {
            button.textContent = "Registered";
            console.log(user);
            const userCredentials = {
                userId: user.createdUser._id, // Use _id directly, no need for string interpolation
                isUserLoggedIn: true
            };
            localStorage.setItem("taskManager", JSON.stringify(userCredentials));
            window.location.replace("../Login/Login.html"); // Redirect to the login page
        } else {
            alert("Registration failed. Please check your credentials.");
            button.textContent = "Failed To Register";
        }
    } catch (error) {
        console.error("Error during registration:", error); // Log the error for debugging
        alert("Error during registration. Please try again.");
        button.textContent = "Failed To Register";
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
        
        // Check if the response has the secure_url
        if (!data.secure_url) {
            alert("Image upload failed. Please try again.");
            return null; // Return null if upload failed
        }
        
        return { imageUrl: data.secure_url, imagePublicId: data.public_id };
    } catch (error) {
        console.error("Error uploading image:", error); // Log the error for debugging
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
                'Content-Type': "application/json"
            },
            body: JSON.stringify(userData)
        });
        
        const data = await response.json();
        
        if (!data.userCreated) {
            alert(data.message); // Show alert if user was not created
            return null; // Return null to indicate failure
        }
        return data; // Return the user data if created successfully
    } catch (error) {
        console.error("Fetch error:", error); // Log the error for debugging
        alert("Fetch error. Please try again.");
        return null; // Return null to indicate failure
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