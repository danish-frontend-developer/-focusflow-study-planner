const $ = (selector) => document.querySelector(selector);
const taskForm = $("#taskForm");
const taskInput = $("#taskInput");
const taskPriority = $("#taskPriority");
const taskList = $("#taskList");
const emptyState = $("#emptyState");
const toast = $("#toast");

let tasks = [];
let activeFilter = "all";
let timerDuration = 25 * 60;
let timeLeft = timerDuration;
let timerInterval = null;
let timerRunning = false;
let toastTimeout;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove("show"), 2400);
}
function escapeHTML(value) {
  return value.replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char]));
}
function getVisibleTasks() {
  if (activeFilter === "active") return tasks.filter(task => !task.done);
  if (activeFilter === "done") return tasks.filter(task => task.done);
  return tasks;
}
function renderTasks() {
  const visible = getVisibleTasks();
  taskList.innerHTML = visible.map(task => `
    <div class="task-item ${task.done ? "completed" : ""}" data-id="${task.id}">
      <input class="check-task" type="checkbox" aria-label="Mark ${escapeHTML(task.title)} complete" ${task.done ? "checked" : ""}>
      <div class="task-copy"><span class="task-name">${escapeHTML(task.title)}</span>
        <div class="task-meta"><span class="priority ${task.priority}">${task.priority[0].toUpperCase()+task.priority.slice(1)} priority</span><span class="task-date">${task.done ? "Completed just now" : "Today"}</span></div>
      </div>
      <button class="delete-task" aria-label="Delete task" title="Delete task">×</button>
    </div>`).join("");
  emptyState.classList.toggle("show", visible.length === 0);
  taskList.style.display = visible.length ? "grid" : "none";
  updateStats();
}
function updateStats() {
  const total = tasks.length;
  const done = tasks.filter(task => task.done).length;
  const remaining = total - done;
  const percent = total ? Math.round(done / total * 100) : 0;
  $("#totalTasks").textContent = total;
  $("#completedTasks").textContent = done;
  $("#navCount").textContent = remaining;
  $("#allCount").textContent = total;
  $("#remainingText").textContent = `${remaining} task${remaining === 1 ? "" : "s"} remaining`;
  $("#completionText").textContent = total ? `${percent}% of your plan complete` : "You're just getting started";
  $("#progressPercent").textContent = `${percent}%`;
  $("#progressFraction").textContent = `${done} of ${total} tasks`;
  $("#progressFill").style.width = `${percent}%`;
  $("#progressMessage").innerHTML = total && percent === 100 ? 'Amazing work <span>✦</span>' : total ? 'Keep going <span>✦</span>' : 'Start small <span>✦</span>';
}
function addTask(title, priority) {
  tasks.unshift({id: Date.now() + Math.random(), title, priority, done: false});
  activeFilter = "all";
  document.querySelectorAll(".filter-button").forEach(button => button.classList.toggle("selected", button.dataset.filter === "all"));
  renderTasks();
  showToast("Task added. One step closer!");
}
taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;
  addTask(title, taskPriority.value);
  taskInput.value = "";
  taskInput.focus();
});
$("#addTaskTop").addEventListener("click", () => {
  $("#tasks").scrollIntoView({behavior:"smooth", block:"center"});
  taskInput.focus({preventScroll:true});
});
document.querySelectorAll(".filter-button").forEach(button => {
  button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-button").forEach(item => item.classList.toggle("selected", item === button));
    renderTasks();
  });
});
taskList.addEventListener("change", event => {
  if (!event.target.matches(".check-task")) return;
  const id = Number(event.target.closest(".task-item").dataset.id);
  const task = tasks.find(item => item.id === id);
  if (!task) return;
  task.done = event.target.checked;
  renderTasks();
  if (task.done) showToast("Nice work! Task completed ✦");
});
taskList.addEventListener("click", event => {
  const button = event.target.closest(".delete-task");
  if (!button) return;
  const id = Number(button.closest(".task-item").dataset.id);
  tasks = tasks.filter(task => task.id !== id);
  renderTasks();
  showToast("Task removed");
});
$("#clearCompleted").addEventListener("click", () => {
  const before = tasks.length;
  tasks = tasks.filter(task => !task.done);
  renderTasks();
  showToast(before === tasks.length ? "No completed tasks to clear" : "Completed tasks cleared");
});

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, "0");
  const seconds = (timeLeft % 60).toString().padStart(2, "0");
  $("#timerDisplay").textContent = `${minutes}:${seconds}`;
  $("#focusMinutes").textContent = Math.ceil(timerDuration / 60);
  const circumference = 2 * Math.PI * 96;
  $("#ringProgress").style.strokeDasharray = circumference;
  $("#ringProgress").style.strokeDashoffset = circumference * (1 - timeLeft / timerDuration);
}
function stopTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerRunning = false;
  $("#timerStart").textContent = "▶ Start focus";
  $("#timerStatus").textContent = "TIME TO FOCUS";
}
function startTimer() {
  if (timerRunning) {
    stopTimer();
    showToast("Focus session paused");
    return;
  }
  if (timeLeft <= 0) timeLeft = timerDuration;
  timerRunning = true;
  $("#timerStart").textContent = "Ⅱ Pause session";
  $("#timerStatus").textContent = "YOU'RE IN THE ZONE";
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      stopTimer();
      $("#timerStatus").textContent = "SESSION COMPLETE";
      showToast("Focus session complete. Great job! ✦");
      $("#timerStart").textContent = "▶ Start again";
    }
  }, 1000);
}
$("#timerStart").addEventListener("click", startTimer);
$("#timerReset").addEventListener("click", () => {
  stopTimer();
  timeLeft = timerDuration;
  updateTimerDisplay();
  showToast("Timer reset");
});
document.querySelectorAll(".preset").forEach(button => {
  button.addEventListener("click", () => {
    stopTimer();
    timerDuration = Number(button.dataset.minutes) * 60;
    timeLeft = timerDuration;
    document.querySelectorAll(".preset").forEach(item => item.classList.toggle("active", item === button));
    updateTimerDisplay();
  });
});
$("#themeToggle").addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const dark = document.body.classList.contains("dark");
  $("#themeToggle").textContent = dark ? "☾" : "☼";
  showToast(dark ? "Dark mode enabled" : "Light mode enabled");
});

const now = new Date();
$("#todayLabel").textContent = now.toLocaleDateString("en-US", {month:"short", day:"numeric"});
const hour = now.getHours();
$("#greeting").textContent = hour < 12 ? "GOOD MORNING — LET'S MAKE TODAY COUNT" : hour < 17 ? "GOOD AFTERNOON — LET'S MAKE TODAY COUNT" : "GOOD EVENING — LET'S MAKE TODAY COUNT";
renderTasks();
updateTimerDisplay();
