import { initGenerator, generateResponse } from "./scripts/generator.js";
import {
  updateProgressBar,
  setupSidebarToggle,
  setupScenarioExamples,
  toggleElements,
  convertMarkdownToHTML,
  updateLogs
} from "./scripts/ui.js";
import {
  generateWorldType,
  generateRegions,
  generatePowers,
  generateResources,
  generatePopulation,
  generatePowerSystem,
} from "./scripts/worldbuilding.js";

import {
  generateCharacterBackstory,
  generateInitialBelongings,
  generateStoryline,
} from "./scripts/scenario.js";
import { generateEndSituation, generateIntroductionSituation, generateNextSituation, updateBelongings } from "./scripts/narration.js";
import { markdown } from "./scripts/markdown.js";
import { rollOutcome } from "./scripts/gameMechanics.js";

// Global generator state
let isGenerating = false;

// Global data structure to hold all generated information
let gameWorldData = {
  worldType: "",
  regions: "",
  powers: "",
  resources: "",
  population: "",
  powerSystem: "",
  userInput: "",
};

let userLuck = 5;
let progressScore = 0;
let logs = [];

// Helper function to add a log entry
function addLog(type, content) {
  logs.unshift({ type, content });
  updateLogs(logs);
}

// Helper function to update the last log entry
function updateLastLog(type, content) {
  logs[0] = { type, content };
  updateLogs(logs);
}

/**
 * On window load:
 *   - Initialize the HuggingFace model.
 *   - Update the progress bar once the model is ready.
 */
window.onload = async () => {
  addLog("info", "Initializing model...");
  await initGenerator();
  updateLastLog("success", "Model initialized.");
  updateProgressBar(1); // Model loaded, so set progress to 100%.

  // Set up UI event listeners
  setupSidebarToggle();
  setupScenarioExamples();
};

// Scenario start button
document
  .getElementById("user-scenario-send-button")
  .addEventListener("click", startWorldBuilding);

/**
 * Starts the world-building sequence.
 * Toggles views and initiates the world generation process.
 */
async function startWorldBuilding() {
  if (!isGenerating) {
    isGenerating = true;
    gameWorldData.userInput = document
      .getElementById("user-scenario")
      .value.trim();

    if (!gameWorldData.userInput) {
      alert("Please enter a scenario.");
      isGenerating = false;
      return;
    }

    toggleElements("hidden", "worldbuilding-scenario", "worldbuilding-review");
    document.getElementById("worldbuilding-review-idea").textContent =
      gameWorldData.userInput;

    gameWorldData = await generateWorld(gameWorldData);
    isGenerating = false;
  }
}

/**
 * Executes the full world-building process by sequentially calling generation steps.
 */
async function generateWorld(worldData) {
  console.group("Generating world...");

  const steps = [
    { step: generateWorldType, key: "worldType" },
    { step: generateRegions, key: "regions" },
    { step: generatePowers, key: "powers" },
    { step: generateResources, key: "resources" },
    { step: generatePopulation, key: "population" },
    { step: generatePowerSystem, key: "powerSystem" },
  ];

  for (const { step, key } of steps) {
    try {
      addLog("generation", `Generating ${key}...`);
      worldData = await step(worldData, generateResponse);
      updateLastLog("success", `Generated ${key}.`);
      updateScenarioReview(worldData); // Update display after each step
    } catch (error) {
      console.error(`Error during ${key} generation:`, error);
    }
  }

  console.log("World generated");
  console.groupEnd();
  document.getElementById('worldbuilding-next-button').disabled = false;
  return worldData;
}

/**
 * Regenerate a specific step in the world-building process.
 * @param {Object} worldData - The current state of the world data.
 * @param {string} step - The step to regenerate (e.g., "worldType", "regions").
 * @returns {Promise<Object>} - The updated world data.
 */
async function regenerateWorldStep(worldData, step) {
  if (isGenerating) {
    console.warn("Generation is already in progress.");
    return worldData;
  }

  isGenerating = true;
  document.getElementById('worldbuilding-next-button').disabled = true;

  try {
    switch (step) {
      case "worldType":
        // If we regenerate the world type, we reset everything else too
        worldData = {
          userInput: worldData.userInput,
          worldType: "",
          regions: "",
          powers: "",
          resources: "",
          population: "",
          powerSystem: "",
        };
        updateScenarioReview(worldData);
        worldData = await generateWorld(worldData);
        break;

      case "regions":
        // Reset relevant fields
        worldData.regions = "";
        worldData.powers = "";
        worldData.population = "";
        updateScenarioReview(worldData);

        addLog("generation", "Generating regions...");
        worldData = await generateRegions(worldData, generateResponse);
        updateScenarioReview(worldData);
        updateLastLog("success", "Generated regions.");
        addLog("generation", "Generating powers...");
        worldData = await generatePowers(worldData, generateResponse);
        updateLastLog("success", "Generated powers.");
        updateScenarioReview(worldData);

        addLog("generation", "Generating population...");
        worldData = await generatePopulation(worldData, generateResponse);
        updateLastLog("success", "Generated population.");
        break;

      case "powers":
        worldData.powers = "";
        worldData.population = "";
        updateScenarioReview(worldData);
        addLog("generation", "Generating powers...");
        worldData = await generatePowers(worldData, generateResponse);
        updateLastLog("success", "Generated powers.");
        break;

      case "resources":
        worldData.resources = "";
        worldData.population = "";
        updateScenarioReview(worldData);
        addLog("generation", "Generating resources...");
        worldData = await generateResources(worldData, generateResponse);
        updateLastLog("success", "Generated resources.");
        updateScenarioReview(worldData);

        addLog("generation", "Generating population...");
        worldData = await generatePopulation(worldData, generateResponse);
        updateLastLog("success", "Generated population.");
        break;

      case "population":
        worldData.population = "";
        updateScenarioReview(worldData);

        addLog("generation", "Generating population...");
        worldData = await generatePopulation(worldData, generateResponse);
        updateLastLog("success", "Generated population.");
        break;

      case "powerSystem":
        worldData.powerSystem = "";
        updateScenarioReview(worldData);

        addLog("generation", "Generating power system...");
        worldData = await generatePowerSystem(worldData, generateResponse);
        updateLastLog("success", "Generated power system.");
        break;

      default:
        console.error("Invalid step specified:", step);
        break;
    }
  } catch (error) {
    console.error(`Error regenerating step '${step}':`, error);
  } finally {
    isGenerating = false;
    document.getElementById('worldbuilding-next-button').disabled = false;
  }
  updateScenarioReview(worldData);
  return worldData;
}

// Bind regenerate buttons
const regenerateButtons = [
  { id: "worldbuilding-review-reload-world-type", key: "worldType" },
  { id: "worldbuilding-review-reload-regions", key: "regions" },
  { id: "worldbuilding-review-reload-powers", key: "powers" },
  { id: "worldbuilding-review-reload-resources", key: "resources" },
  { id: "worldbuilding-review-reload-population", key: "population" },
  { id: "worldbuilding-review-reload-power-system", key: "powerSystem" },
];

regenerateButtons.forEach(({ id, key }) => {
  document.getElementById(id).addEventListener("click", () => {
    regenerateWorldStep(gameWorldData, key);
  });
});

document.getElementById("worldbuilding-next-button").addEventListener("click", () => {
  toggleElements("hidden", "worldbuilding", "narration")
})

/**
 * Updates the scenario review section of the UI.
 * Converts markdown to HTML for specific elements and shows/hides the loader.
 */
function updateScenarioReview(data) {
  const markdownFields = [
    { id: "worldbuilding-review-world-type", content: data.worldType },
    { id: "worldbuilding-review-regions", content: data.regions },
    { id: "worldbuilding-review-powers", content: data.powers },
    { id: "worldbuilding-review-resources", content: data.resources },
    { id: "worldbuilding-review-population", content: data.population },
    { id: "worldbuilding-review-power-system", content: data.powerSystem },
  ];

  markdownFields.forEach(({ id, content }) => {
    const element = document.getElementById(id);
    element.innerHTML = convertMarkdownToHTML(content || "");

    const loader = document.querySelector(
      `#${id}-container .worldbuilding-review-loader`
    );
    if (content) {
      loader.classList.add("hidden");
    } else {
      loader.classList.remove("hidden");
    }
  });
}

document.getElementById("narration-idea-send-button").addEventListener("click", startNarration);

let situationIndex = 0;
// Generate the scenario
async function startNarration() {
  if (!isGenerating) {
    isGenerating = true;

    toggleElements("hidden", "narration", "adventure");

    gameWorldData.story = {
      situations: [],
      backstory: "",
      belongings: "",
      storyline: "",
      userInput: document.getElementById('narration-idea-input').value.trim() ? document.getElementById('narration-idea-input').value.trim() : "A quest about finding the artefact and defeating the villain",
    };

    gameWorldData = await generateScenario(gameWorldData, generateResponse);

    gameWorldData = await generateIntroduction(gameWorldData, generateResponse);
    document.getElementById('adventure-loader').classList.add('hidden');
    updateAdventure(gameWorldData, situationIndex);
  }
    isGenerating = false;
}

async function generateScenario(worldData, generateResponse) {
  console.group("Generating scenario...");
  try {
    addLog("generation", "Generating storyline...");
    worldData = await generateStoryline(worldData, generateResponse);
    updateLastLog("success", "Generated storyline.");
  } catch (error) {
    console.error("Error generating scenario:", error);
  }

  try {
    addLog("generation", "Generating backstory...");
    worldData = await generateCharacterBackstory(worldData, generateResponse);
    updateLastLog("success", "Generated backstory.");
  } catch (error) {
    console.error("Error generating backstory:", error);
  }
  try {
    addLog("generation", "Generating belongings...");
    worldData = await generateInitialBelongings(worldData, generateResponse);
    updateLastLog("success", "Generated belongings.");
  } catch (error) {
    console.error("Error generating belongings:", error);
  }
  console.groupEnd();
  return worldData
}

async function generateIntroduction(worldData, generateResponse) {
  console.group("Generating introduction...");
  try {
    addLog("generation", "Generating introduction situation...");
    worldData = await generateIntroductionSituation(worldData, generateResponse);
    updateLastLog("success", "Generated introduction situation.");
  } catch (error) {
    console.error("Error generating introduction:", error);
  }
  console.groupEnd();
  return worldData
}



function updateAdventure(worldData, index) {
  const situation = worldData.story.situations[index];
  document.getElementById("adventure-content-text").innerHTML = markdown(situation.content);
}

document.getElementById('user-action-send-button').addEventListener('click', handleUserAction);

async function handleUserAction() {
  const userAction = document.getElementById("user-action-input").value.trim();
  if (userAction && !isGenerating) {
    isGenerating = true;
    toggleElements("hidden", "adventure-loader", "adventure-content-text");
    document.getElementById("user-action-input").value = "";
    document.getElementById("adventure-content-text").innerHTML = "";
    gameWorldData.story.situations[situationIndex].userAction = userAction;

    gameWorldData = await generateNext(gameWorldData, generateResponse);
    
    addLog('generating', 'Updating belongings')

    updateBelongings({
      worldType: gameWorldData.worldType,
      previousBelongings: gameWorldData.story.belongings,
      situation: gameWorldData.story.situations[situationIndex].content,
      powerSystem: gameWorldData.powerSystem
    }, generateResponse).then((updatedBelongings) => {
      gameWorldData.story.belongings = updatedBelongings;
      updateLastLog('success', 'Updated belongings');
      isGenerating = false;
    })
    situationIndex++;
    updateAdventure(gameWorldData, situationIndex);
    toggleElements("hidden", "adventure-loader", "adventure-content-text");
  }
}

async function generateNext(worldData, generateResponse) {
  console.group("Generating next situation...");
  worldData.story.situations[situationIndex].successRoll = rollOutcome(userLuck, 2);
  progressScore += Math.abs(Math.round(worldData.story.situations[situationIndex].successRoll / 2));
  if (progressScore > 20) {
    addLog('generation', `Generating end situation...`);
    let nextSituation = {
      successRoll: 0,
      userAction: '',
      content: await generateEndSituation({
        rollOutcome: worldData.story.situations[situationIndex].successRoll,
        worldType: worldData.worldType,
        storyline: worldData.storyline,
        previousSituation: worldData.story.situations[situationIndex].content,
        userAction: worldData.story.situations[situationIndex].userAction,
      }, generateResponse)
    }
    updateLastLog('success', 'Generated end situation.');
    worldData.story.situations.push(nextSituation);
    situationIndex++;
    return worldData
  }
  addLog('info', `Success roll: ${worldData.story.situations[situationIndex].successRoll}`);
  console.log("Success roll:", worldData.story.situations[situationIndex].successRoll);
  addLog('generation', `Generating next situation...`);
  let nextSituation = {
    successRoll: 0,
    userAction: '',
    content: await generateNextSituation({
      rollOutcome: worldData.story.situations[situationIndex].successRoll,
      progressScore: progressScore,
      worldType: worldData.worldType,
      storyline: worldData.storyline,
      previousSituation: worldData.story.situations[situationIndex].content,
      userAction: worldData.story.situations[situationIndex].userAction,
      belongings: worldData.story.belongings,
      powerSystem: worldData.powerSystem
    }, generateResponse)}
  updateLastLog("success", "Generated next situation.");

  worldData.story.situations.push(nextSituation);
  console.groupEnd();
  return worldData
}