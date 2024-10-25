const addStepBtn = document.querySelector(".add-task-btn");
const stepsList = document.querySelector(".steps");
let steps = 0;

addStepBtn.addEventListener("click", () => {
    const stepField = document.createElement("input");
    stepField.name = "step";
    stepField.id = `step${steps + 1}`;
    stepField.placeholder = `Step ${steps + 1}`;
    stepField.type = "text";
    stepField.classList.add("step-input");

    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "Del";
    deleteBtn.type = "button";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.dataset.stepId = steps + 1;

    const stepWrapper = document.createElement("div");
    stepWrapper.classList.add("step-wrapper");
    stepWrapper.id = `stepWrapper${steps + 1}`;
    stepWrapper.appendChild(stepField);
    stepWrapper.appendChild(deleteBtn);
    stepsList.appendChild(stepWrapper);

    deleteBtn.addEventListener("click", (e) => {
        const stepId = e.target.dataset.stepId;
        document.getElementById(`stepWrapper${stepId}`).remove();
        steps -= 1;
    });

    steps += 1;
});

const addTaskForm = document.querySelector('.addTaskform');
addTaskForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    
    const tName = event.target[0].value;
    const tSteps = [];

    if (!tName) {
        alert("Task name is required");
        return;
    }

    const taskSteps = addTaskForm.querySelectorAll(".step-input");
    taskSteps.forEach((taskStep) => {
        if (!taskStep.value) {
            alert("Task step is required");
            return;
        }
        tSteps.push(taskStep.value);
    });

    const userDetails = JSON.parse(localStorage.getItem("taskManager"));
    const data = {
        userid: userDetails.userId,
        taskName: tName,
        tasksSteps: tSteps || [],
    };

    try {
        await submitTask(data);
        window.location.replace("../index.html");
        addTaskForm.reset();
    } catch (error) {
        alert("Error submitting task. Please try again.");
    }
});

async function submitTask(data) {
    try {
        const url = `http://localhost:5000/api/v1/tasks/addTask`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            alert("Error submitting task. Please try again.");
            return;
        }

        await response.json();
    } catch (error) {
        alert("Error: Please try again.");
    }
}
