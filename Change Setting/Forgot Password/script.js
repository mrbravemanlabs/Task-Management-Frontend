let userData = "";
const apiUrl = "http://localhost:5000/api/v1/users/resetPassword";
const getResetEmail = document.querySelector(".get-email");
getResetEmail.addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = event.target[0].value;
    if (!email) {
        alert("Email is required");
        return;
    }
    
    const reset = await resetPassword(email);
    if (!reset) {
        alert("Can't get the OTP");
        return;
    }
    console.log(reset);
    // window.location.replace("./confirmOtp.html");
});

const confirmOtp = document.querySelector(".confirm-otp");
confirmOtp.addEventListener("submit", (event) => { 
    event.preventDefault();
    const otp = event.target[0].value;
    if (!otp || otp.length !== 6) { 
        alert("Invalid OTP");
        return;
    }
    console.log(otp);
    console.log(userData);
});


async function resetPassword(email) {
    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email })
        });
        
        if (!response.ok) {
            console.log("Something went wrong");
            return false;
        }
        
        const data = await response.json();
        userData = data;
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
}
