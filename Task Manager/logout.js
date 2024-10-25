const logoutBtn = document.querySelector(".logout-btn");
logoutBtn.addEventListener("click",() => {
    const userCredintials = {
        userId:null,
        isUserLoggedIn:false
    }
    localStorage.setItem("taskManager",JSON.stringify(userCredintials))
    window.location.replace("/index.html")
})