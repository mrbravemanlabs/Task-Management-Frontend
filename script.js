  const userData = JSON.parse(localStorage.getItem("taskManager")) || null;
  const user = localStorage.getItem("taskManager")
  console.log(userData);

  if (!userData || !userData.isUserLoggedIn) {
    console.log("Redirecting to login page...");
    window.location.replace("./Login/Login.html");
  } else {
    console.log("User data exists. No redirection.");
    window.location.replace("./Task Manager/taskManager.html");
  }
