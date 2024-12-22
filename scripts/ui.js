/**
 * Updates the on-screen progress bar and, when complete, shows the Start button.
 */
export function updateProgressBar(progress) {
    const progressBar = document.getElementById("downloading-bar-filler");
    progressBar.style.width = `${progress * 100}%`;
  
    const progressText = document.querySelector(
      "#title-screen #downloading-bar-progress span"
    );
    progressText.textContent = `${(progress * 100).toFixed(0)}%`;
  
    if (progress === 1) {
      const wrapper = document.getElementById("downloading-bar-wrapper");
      const startButton = document.getElementById("start-button");
      wrapper.style.opacity = 0;
      setTimeout(() => {
        wrapper.style.display = "none";
      }, 1000);
      startButton.disabled = false;
      startButton.addEventListener("click", () => {
        document.getElementById("title-screen").classList.toggle("hidden");
        document.getElementById("worldbuilding").classList.toggle("hidden");
      });
    }
  }
  
  /**
   * Toggles the sidebar in and out of view.
   */
  export function setupSidebarToggle() {
    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebar-toggle");
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("active");
    });
  }
  
  /**
   * Binds click handlers on scenario examples to populate the user input field.
   */
  export function setupScenarioExamples() {
    const scenarioExamples = document.querySelectorAll(
      "#scenario-examples .scenario-example-item"
    );
    scenarioExamples.forEach((example) => {
      example.addEventListener("click", () => {
        document.getElementById("user-scenario").value = example
          .querySelector(".scenario-example-text")
          .textContent.trim();
      });
    });
  }
  
  /**
   * Toggles visibility of multiple elements by their IDs.
   */
  export function toggleElements(className, ...ids) {
    ids.forEach((id) => {
      document.getElementById(id).classList.toggle(className);
    });
  }
  
  /**
   * Converts simple Markdown-style (bold only) to HTML.
   */
  export function convertMarkdownToHTML(text) {
    return text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  }
  
  export function updateLogs(logs) {
    const logList = document.getElementById("log-list");
    logList.innerHTML = "";
  
    logs.forEach(({type, content}) => {
      const logItem = document.createElement("li");
      logItem.textContent = content;
      logItem.classList.add(type);
      logList.appendChild(logItem);
    });
  }