/**
 * Generate a precise storyline based on the user's narrative idea and previously generated worldData.
 * @param {Object} worldData - Contains world type, regions, powers, etc.
 * @param {Function} generateResponse - Function to call the LLM for generating text.
 * @returns {Promise<string>} - Generated storyline.
 */
export async function generateStoryline(worldData, generateResponse) {
  const storylinePrompt = `You are a world-building assistant for an RPG. Using the provided worldData, create a precise storyline for the adventure in a structured format.
  
  **Guidelines**:
  - Start with a concise synopsis of the world and main conflict (1 sentence).
  - Specify the **initial situation** where the player begins the game.
  - Clearly define the **main quest objective**, including what ends the game aside from death.
  - Ensure the storyline aligns with the provided world type, regions, and powers.
  
  **Output Format**:
  **Synopsis**: [A concise summary of the world and conflict].
  **Initial Situation**: [Where the player starts and their immediate circumstance].
  **Main Quest Objective**: [What the player must achieve to complete the adventure].`;

  const fewShotExamples = [
    {
      role: "user",
      content: `WorldData:
  **World Type**: This is a second-world fantasy where ancient dragons dominate human kingdoms.
  **Regions**: 
  1. Ember Plains: Fertile grasslands ruled by dragon-backed human lords.
  2. Ashen Peaks: Volcanic mountains where dragons nest.
  3. Mistwood Forests: Misty forests harboring rebel factions.
  **Key Powers**: 
  1. Dragon Lords: Demand tribute and enforce law.
  2. Rebel Clans: Oppose dragon rule from hidden bases.`,
    },
    {
      role: "assistant",
      content:
        "**Synopsis**: The Dragon Lords’ iron rule is threatened as the rebels in the Mistwood Forests uncover an ancient artifact capable of shifting the balance of power.\n" +
        "**Initial Situation**: You are a wandering mercenary who has been hired by the Dragon Lords to locate the artifact and prevent it from falling into rebel hands. You start your journey at the outskirts of the Ember Plains, where rumors of rebel activity have surfaced.\n" +
        "**Main Quest Objective**: Retrieve the artifact from the Mistwood Forests and return it to the Dragon Lords, securing their rule—or decide to betray them and join the rebels in overthrowing their tyranny.",
    },
    {
      role: "user",
      content: `WorldData:
  **World Type**: A post-apocalyptic world reclaimed by nature.
  **Regions**: 
  1. Ruined Forests: Overgrown cities now home to scavengers.
  2. Swamplands: Dangerous wetlands teeming with mutated wildlife.
  3. Bone Dry Plains: Arid flatlands with remnants of old technology.
  **Key Powers**: 
  1. Forest Tribes: Shun old-world tech and live off the land.
  2. Scavenger Clans: Salvage old-world materials for trade.`,
    },
    {
      role: "assistant",
      content:
        "**Synopsis**: An ancient power source buried beneath the Bone Dry Plains could restore civilization or destroy it, sparking conflict between the Scavenger Clans and Forest Tribes.\n" +
        "**Initial Situation**: You are a scavenger hired to locate the power source before anyone else. You begin at the edge of the Bone Dry Plains, armed with a map leading to its rumored location.\n" +
        "**Main Quest Objective**: Find the power source and decide its fate—use it to rebuild the world, destroy it to prevent misuse, or hand it over to one of the factions for personal gain.",
    },
  ];

  const userInput = {
    role: "user",
    content: `WorldData:\n**World Type**: ${worldData.worldType}\n**Regions**: ${worldData.regions}\n**Key Powers**: ${worldData.powers}`,
  };

  const prompt = [
    { role: "system", content: storylinePrompt },
    ...fewShotExamples,
    userInput,
  ];

  try {
    console.log("Generating storyline...")
    worldData.story.storyline = await generateResponse(prompt, 200);
    console.log("Storyline generated");
    return worldData;
  } catch (error) {
    console.error("Error generating storyline:", error);
    worldData.story.storyline = "**Synopsis**: A mysterious conflict looms over the land.\n**Initial Situation**: You find yourself at the center of unfolding events.\n**Main Quest Objective**: Uncover the truth and shape the future of this world.";
    return worldData;
}
}

/**
 * Generate a character backstory based on the storyline and other context.
 * @param {Object} worldData - Contains storyline, world type, key powers, population, and power system.
 * @param {Function} generateResponse - Function to call the LLM for generating text.
 * @returns {Promise<string>} - The generated character backstory.
 */
export async function generateCharacterBackstory(worldData, generateResponse) {
  const characterPrompt = `You are a world-building assistant for an RPG. Using the provided context, generate a detailed character backstory.
  
  **Guidelines**:
  - Focus on the character's past, motivations, and skills.
  - The backstory should align with the storyline, world type, key powers, population, and power system.
  - Do not describe the character’s current situation or belongings.
  - Keep the backstory concise, engaging, and no longer than 3 sentences.
  
  **Output Format**:
  **Backstory**: [Who the character was, what shaped them, and why they are part of the adventure].`;

  const fewShotExamples = [
    {
      role: "user",
      content: `Context:
  **Storyline**: 
  **Synopsis**: The Dragon Lords’ rule is threatened as rebels in the Mistwood Forests uncover an ancient artifact capable of shifting the balance of power.
  **Initial Situation**: You are a wandering mercenary hired by the Dragon Lords to track down the artifact and ensure it does not fall into rebel hands. You begin at the outskirts of the Ember Plains, where rumors of rebel activity have surfaced.
  **Main Quest Objective**: Recover the artifact and return it to the Dragon Lords—or betray them and use the artifact to aid the rebels in overthrowing their rule.
  **World Type**: This is a second-world fantasy where ancient dragons dominate human kingdoms.
  **Key Powers**: 
  1. Dragon Lords: Demand tribute and enforce law.
  2. Rebel Clans: Oppose dragon rule from hidden bases.
  **Population**: Humans reluctantly serve the dragons; Dragonkin enforce dragon law; Rebels fight for freedom.
  **Power System**: Magic flows from dragons, granting Dragonkin powers through dragonfire.`,
    },
    {
      role: "assistant",
      content:
        "**Backstory**: You were once a loyal Dragonkin commander who faithfully served the Dragon Lords, but your views changed after witnessing their merciless destruction of a village. Torn between your loyalty and conscience, you eventually deserted your post, becoming a wandering mercenary with a reputation for fighting against injustice.",
    },
    {
      role: "user",
      content: `Context:
  **Storyline**: 
  **Synopsis**: An ancient power source buried beneath the Bone Dry Plains could restore civilization or destroy it, sparking conflict between the Scavenger Clans and Forest Tribes.
  **Initial Situation**: You are a scavenger hired to locate the power source before it falls into the wrong hands. You begin at an abandoned factory on the outskirts of the Bone Dry Plains, armed with a map to its rumored location.
  **Main Quest Objective**: Find the power source and decide its fate—restore civilization, destroy it, or give it to the highest bidder.
  **World Type**: A post-apocalyptic world reclaimed by nature.
  **Key Powers**: 
  1. Scavenger Clans: Salvage old-world materials for trade.
  2. Forest Tribes: Shun old-world tech and live off the land.
  **Population**: Scavengers thrive in ruins; Tribes protect nature; Mutated creatures roam the land.
  **Power System**: Bio-radiant energy powers rare artifacts but mutates those who use it excessively.`,
    },
    {
      role: "assistant",
      content:
        "**Backstory**: You grew up scavenging the ruins of the old world, learning to survive on wit and resourcefulness. After discovering a hidden cache of rare technology as a teenager, you became a skilled salvager sought out for dangerous missions. Haunted by the loss of your enclave during a mutant attack, you now take on high-risk jobs to protect those you care about.",
    },
  ];

  const userInput = {
    role: "user",
    content: `Context:\n**Storyline**: ${worldData.story.storyline}\n**World Type**: ${worldData.worldType}\n**Key Powers**: ${worldData.powers}\n**Population**: ${worldData.population}\n**Power System**: ${worldData.powerSystem}`,
  };

  const prompt = [
    { role: "system", content: characterPrompt },
    ...fewShotExamples,
    userInput,
  ];

  try {
    console.log("Generating backstory...");
    worldData.story.backstory = await generateResponse(prompt, 200);
    console.log("Backstory generated");
    return worldData;
  } catch (error) {
    console.error("Error generating character backstory:", error);
    worldData.story.backstory = "**Backstory**: You are a mysterious adventurer with a past shrouded in secrets, driven by a deep personal motivation to see the quest through.";
    return worldData;
  }
}

/**
 * Generate initial belongings based on the storyline, backstory, and other context.
 * @param {Object} worldData - Contains storyline, world type, power system, and backstory.
 * @param {Function} generateResponse - Function to call the LLM for generating text.
 * @returns {Promise<string>} - The generated initial belongings.
 */
export async function generateInitialBelongings(worldData, generateResponse) {
  const belongingsPrompt = `You are a world-building assistant for an RPG. Using the provided context, generate a list of the character’s initial belongings.
  
  **Guidelines**:
  - Align the belongings with the storyline, backstory, world type, and power system.
  - Include 2-4 items that reflect the character’s role, skills, and motivations.
  - Be specific about the nature of the items (e.g., "a rusted sword" instead of "a weapon").
  - Avoid narrative descriptions—output only the belongings.
  
  **Output Format**:
  **Belongings**: [A list of 2-4 starting items].`;

  const fewShotExamples = [
    {
      role: "user",
      content: `Context:
  **World Type**: This is a second-world fantasy where ancient dragons dominate human kingdoms.
  **Storyline**: 
  **Synopsis**: The Dragon Lords’ rule is threatened as rebels in the Mistwood Forests uncover an ancient artifact capable of shifting the balance of power.
  **Initial Situation**: You are a wandering mercenary hired by the Dragon Lords to track down the artifact and ensure it does not fall into rebel hands. You begin at the outskirts of the Ember Plains, where rumors of rebel activity have surfaced.
  **Main Quest Objective**: Recover the artifact and return it to the Dragon Lords—or betray them and use the artifact to aid the rebels in overthrowing their rule.
  **Power System**: Magic flows from dragons, granting Dragonkin powers through dragonfire.
  **Backstory**: You were once a loyal Dragonkin commander who faithfully served the Dragon Lords, but your views changed after witnessing their merciless destruction of a village. Torn between your loyalty and conscience, you eventually deserted your post, becoming a wandering mercenary with a reputation for fighting against injustice.`,
    },
    {
      role: "assistant",
      content:
        "**Belongings**: A jagged sword bearing the mark of the Dragon Lords, a faded map of the Mistwood Forests, a pouch of healing herbs, and a small emblem of your former rank.",
    },
    {
      role: "user",
      content: `Context:
  **World Type**: A post-apocalyptic world reclaimed by nature.
  **Storyline**: 
  **Synopsis**: An ancient power source buried beneath the Bone Dry Plains could restore civilization or destroy it, sparking conflict between the Scavenger Clans and Forest Tribes.
  **Initial Situation**: You are a scavenger hired to locate the power source before it falls into the wrong hands. You begin at an abandoned factory on the outskirts of the Bone Dry Plains, armed with a map to its rumored location.
  **Main Quest Objective**: Find the power source and decide its fate—restore civilization, destroy it, or give it to the highest bidder.
  **Power System**: Bio-radiant energy powers rare artifacts but mutates those who use it excessively.
  **Backstory**: You grew up scavenging the ruins of the old world, learning to survive on wit and resourcefulness. After discovering a hidden cache of rare technology as a teenager, you became a skilled salvager sought out for dangerous missions. Haunted by the loss of your enclave during a mutant attack, you now take on high-risk jobs to protect those you care about.`,
    },
    {
      role: "assistant",
      content:
        "**Belongings**: A radiation detector with a cracked display, a rusted crowbar, a scavenger's backpack filled with tools, and a worn protective suit patched with scrap metal.",
    },
  ];

  const userInput = {
    role: "user",
    content: `Context:\n**World Type**: ${worldData.worldType}\n**Storyline**: ${worldData.story.storyline}\n**Power System**: ${worldData.powerSystem}\n**Backstory**: ${worldData.story.backstory}`,
  };

  const prompt = [
    { role: "system", content: belongingsPrompt },
    ...fewShotExamples,
    userInput,
  ];

  try {
    console.log("Generating initial belongings...");
    worldData.story.belongings = await generateResponse(prompt, 150);
    console.log("Initial belongings generated");
    return worldData;
  } catch (error) {
    console.error("Error generating initial belongings:", error);
    worldData.story.belongings = "**Belongings**: A basic weapon, a worn map, and a pouch of money.";
    return worldData;
  }
}
