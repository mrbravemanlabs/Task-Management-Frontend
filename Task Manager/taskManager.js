document.addEventListener("DOMContentLoaded", () => {
    const user = JSON.parse(localStorage.getItem("taskManager"));

    async function getUser(userId) {
        const apiUrl = `http://localhost:5000/api/v1/users/getUser/${userId}`;
        try {
            const response = await fetch(apiUrl);
            return response.ok ? await response.json() : null;
        } catch (error) {
            console.error("Fetch error:", error);
            return null;
        }
    }

    async function getAllTasks(userId) {
        const apiUrl = `http://localhost:5000/api/v1/tasks/getAllTasks/${userId}`;
        try {
            const response = await fetch(apiUrl);
            return response.ok ? await response.json() : null;
        } catch (error) {
            console.error("Fetch error:", error);
            return null;
        }
    }

    async function getUserDetails() {
        if (!user?.userId) return;
        const userDetails = await getUser(user.userId);
        if (userDetails) showUser(userDetails.user);
    }

    async function getTasks(userId) {
        const allTasks = await getAllTasks(userId);
        const pendingList = document.querySelector(".pending-tasks");
        const completeList = document.querySelector(".completed-task");

        if (!pendingList || !completeList) {
            console.error("Pending Tasks or Completed Tasks Container Not Found.");
            return;
        }

        pendingList.innerHTML = '';
        completeList.innerHTML = '';

        allTasks?.tasks.forEach(task => {
            console.log(task);
            if (task.taskStatus === "Pending") {
                createTaskElement(task, pendingList);
            } else if (task.taskStatus === "Active") {
                getCompleteTaskDetail(task._id);
            } else {
                createTaskElement(task, completeList);
                console.log(task);
            }
        });
    }

    function createTaskElement(task, container) {
        const taskContainer = document.createElement("div");
        taskContainer.className = "taskContainer";

        const taskName = document.createElement("h3");
        taskName.innerText = task.taskName;

        const buttons = document.createElement("div");
        buttons.classList.add("buttons");

        const startButton = createButton("startButton", `<i class='bx bx-run' title="Start"></i>`, () => {
            toggleStatus(task._id, "Active");
        });

        const deleteButton = createButton("deleteButton", `<i class='bx bxs-trash-alt' title="Delete"></i>`, () => {
            deleteTask(task._id);
        });
        console.log(container);
        if(container.className === "completed-task"){
            startButton.style.display = "none";
        }
        buttons.append(startButton, deleteButton);
        taskContainer.append(taskName, buttons);
        container.appendChild(taskContainer);
    }

    function createButton(className, innerHTML, onClick) {
        const button = document.createElement("button");
        button.className = className;
        button.innerHTML = innerHTML;
        button.addEventListener("click", onClick);
        return button;
    }

    function showUser(user) {
        const userAvatarContainer = document.querySelector("#userAvatar");
        const userFullName = document.querySelector(".userFullName");

        if (userAvatarContainer && userFullName) {
            userAvatarContainer.src = user.avatarImage;
            userFullName.innerHTML = user.fullName;
        }
    }

    async function toggleStatus(taskId, taskStatus) {
        console.log(taskId);
        const apiUrl = `http://localhost:5000/api/v1/tasks/toggleStatus/${taskId}`;
        try {
            const response = await fetch(apiUrl, {
                method: "PUT",
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify({ taskStatus })
            });

            if (!response.ok) {
                const data = await response.json();
                alert(data.message);
                return;
            }
            window.location.replace("../index.html");
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    async function deleteTask(taskId) {
        const apiUrl = `http://localhost:5000/api/v1/tasks/deleteTask/${taskId}`;
        try {
            const response = await fetch(apiUrl, { method: "DELETE" });
            const data = await response.json();
            if (!response.ok) {
                alert(data.message);
            }
            window.location.replace("../index.html");
        } catch (error) {
            console.error("Fetch error:", error);
        }
    }

    async function getCompleteTaskDetail(id) {
        const taskDetails = await getTasksDetails(id);
        if (taskDetails) displayActiveTask(taskDetails);
    }

    async function getTasksDetails(id) {
        const apiUrl = `http://localhost:5000/api/v1/tasks/getTaskDetails/${id}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                alert("Can't Get The Response");
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error("Fetch error:", error);
            return null;
        }
    }

    function displayActiveTask(taskDetails) {
        const activeTaskContainer = document.querySelector(".active-task");
        activeTaskContainer.innerHTML = ""
        const taskTitle = document.createElement("h1");
        taskTitle.innerText = taskDetails.task.taskName;
        taskTitle.classList.add("taskTitle");

        const stepsContainer = document.createElement("div");
        stepsContainer.classList.add("stepsContainer");

        taskDetails.steps.forEach(step => {
            const stepElement = document.createElement("label");
            const stepStatus = document.createElement("input");
            stepStatus.type = "checkbox";
            stepStatus.checked = step.isComplete;

            stepStatus.onchange = () => {
                toggleStepsStatus(step._id);
            };

            const stepText = document.createElement("span");
            stepText.textContent = step.task;
            stepElement.append(stepStatus, stepText);
            stepsContainer.append(stepElement);
        });

        const isPendingSteps = taskDetails.steps.some((step) => !step.isComplete)
        const changeStatus = document.createElement("button");
        changeStatus.innerText = "Done";
        changeStatus.onclick = () => {
            if(!isPendingSteps){
                const taskId =  taskDetails.task._id;
            toggleStatus(taskId, "Complete");
            return
            }
            alert("Please complete all the steps");
        };
        changeStatus.classList.add("changeStatus");

        activeTaskContainer.append(taskTitle, stepsContainer, changeStatus);
    }

    async function toggleStepsStatus(stepId) {
        const apiUrl = `http://localhost:5000/api/v1/steps/toggleStatus/${stepId}`;
        try {
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                let errorMessage = "An error occurred";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (jsonError) {
                    console.error("Error parsing JSON:", jsonError);
                }
                alert(errorMessage);
                return;
            }
            window.location.href = "../index.html"; // or use replace() based on your needs
        } catch (error) {
            console.error(error);
            alert("Something went wrong. Please try again.");
        }
    }

    if (user?.userId) {
        getUserDetails();
        getTasks(user.userId);
    }
});
