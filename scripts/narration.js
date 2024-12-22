/**
 * Generate an engaging and descriptive introduction situation for the RPG adventure.
 * @param {Object} worldData - Contains world type, regions, powers, storyline, backstory, and belongings.
 * @param {Function} generateResponse - Function to call the LLM for generating text.
 * @returns {Promise<string>} - The generated introduction situation.
 */
export async function generateIntroductionSituation(worldData, generateResponse) {
    const introductionPrompt = `You are a world-building assistant for an RPG. Using the provided context, generate the text for the first situation of the game, the introduction to the adventure.
  
  **Guidelines**:
  - The first paragraph should describe the broader world situation. Describe the world and its spatio-temporal context in 2-3 sentences.
  - The second paragraph should be introspective, introducing the character. Use emotions—both good and bad—to reflect the character’s backstory, their struggles, and their motivations in 2-3 sentences.
  - The third paragraph should focus on the immediate situation. Describe in detail what the character sees, hears, smells, and possesses. Immerse the reader in the character’s current state in 3 sentences.
  - Use a descriptive and evocative writing style.
  - Make sure to add line returns (\n) to structure the text.`;
  
    const fewShotExamples = [
      {
        role: "user",
        content:
          `Context:
  **World Type**: This is a second-world fantasy where ancient dragons dominate human kingdoms.
  **Regions**: 
  1. Ember Plains: Fertile grasslands ruled by dragon-backed human lords.
  2. Ashen Peaks: Volcanic mountains where dragons nest.
  3. Mistwood Forests: Misty forests harboring rebel factions.
  **Powers**: 
  1. Dragon Lords: Demand tribute and enforce law.
  2. Rebel Clans: Oppose dragon rule from hidden bases.
  **Storyline**: 
  **Synopsis**: The Dragon Lords’ rule is threatened as rebels in the Mistwood Forests uncover an ancient artifact capable of shifting the balance of power.
  **Initial Situation**: You are a wandering mercenary hired by the Dragon Lords to track down the artifact and ensure it does not fall into rebel hands. You begin at the outskirts of the Ember Plains, where rumors of rebel activity have surfaced.
  **Main Quest Objective**: Recover the artifact and return it to the Dragon Lords—or betray them and use the artifact to aid the rebels in overthrowing their rule.
  **Backstory**: You were once a loyal Dragonkin commander who faithfully served the Dragon Lords, but your views changed after witnessing their merciless destruction of a village. Torn between your loyalty and conscience, you eventually deserted your post, becoming a wandering mercenary with a reputation for fighting against injustice.
  **Belongings**: A jagged sword bearing the insignia of the Dragon Lords, a faded map of the Mistwood Forests, a small emblem of your former rank, and a pouch of healing herbs.`,
      },
      {
        role: "assistant",
        content:
          "The Ember Plains stretch out before you, a sea of golden grass swaying in the wind beneath a pale sky. In the distance, the Ashen Peaks loom, their jagged silhouettes dark against the horizon, veiled by smoke and ash from the volcanic heart of the land. The Dragon Lords rule these lands with an iron claw, demanding tribute and enforcing their will through fear. But whispers of rebellion have grown louder, and in the Mistwood Forests, the seeds of defiance take root.\n\n" +
          "You remember the village, the screams, and the flames. It was supposed to be a routine mission—a reminder of the Dragon Lords' authority—but the sight of innocent lives turned to ash changed everything. The weight of your sword feels heavier now, a constant reminder of the choices you’ve made and the lives you’ve taken. There’s anger in your heart, but also hope—a fragile thing you cling to as you wander these fractured lands. You have no illusions of grandeur; you are a mercenary, caught between worlds, seeking redemption in the only way you know how.\n\n" +
          "The edge of the Ember Plains stretches before you, the golden grass rustling in the breeze. You crouch low, scanning the terrain for signs of movement. The Mistwood Forests rise in the distance, their trees wreathed in mist and shadow. Your jagged sword rests at your hip, its blade nicked and worn from years of use. In your pouch, you carry a few healing herbs and the emblem of your former rank—a small token of a life you’ve left behind but cannot escape. The air is cool and carries the earthy scent of damp soil, mingled with the faint metallic tang of your blade. Somewhere ahead, the artifact waits, and with it, the power to reshape the world.",
      },
    ];
  
    const userInput = {
      role: "user",
      content: `Context:\n**World Type**: ${worldData.worldType}\n**Regions**: ${worldData.regions}\n**Powers**: ${worldData.powers}\n**Storyline**: ${worldData.story.storyline}\n**Backstory**: ${worldData.story.backstory}\n**Belongings**: ${worldData.story.belongings}`,
    };
  
    const prompt = [
      { role: "system", content: introductionPrompt },
      ...fewShotExamples,
      userInput,
    ];
  
    try {
        console.log("Generating introduction situation...");
      const introductionSituation = {
        content: await generateResponse(prompt, 300),
        userAction: null,
        successRoll: null,
      }
      console.log("Introduction situation generated");
      worldData.story.situations.push(introductionSituation);
      return worldData
    } catch (error) {
      console.error("Error generating introduction situation:", error);
      return "The adventure begins, but the details remain shrouded in mystery...";
    }
  }



  /**
 * Generate the next situation in the RPG based on the current context and roll outcome.
 * @param {Object} context - Contains worldType, storyline, previous situation, userAction, belongings, and powerSystem.
 * @param {Function} generateResponse - Function to call the LLM for generating text.
 * @returns {Promise<string>} - The generated next situation.
 */
export async function generateNextSituation(context, generateResponse) {
    const situationPrompt = `You are a world-building assistant for an RPG. Using the provided context, generate the next situation in the adventure.
  
  **Guidelines**:
  - The context includes a progress score that indicates how close the player is to the end. The game ends at 20 (win or lose). Use the score, the previous situation and the storyline to determine the next situation.
  - Use the **rollOutcome** value to determine the tone and outcome of the situation: negative values (-1 to -10) go from mildly negative to catastrophic for the player, and positive values (1 to 10) go from mildly positive to extremely beneficial, bringing the player very close to their main objective.
  - Describe the situation in **two paragraphs**, each with **2-3 sentences maximum**.
  - Include sensory details, environmental descriptions, and logical consequences of the user's actions.
  - Ensure the situation aligns with the worldType, storyline, user action, belongings, and power system.`;
  
  const fewShotExamples = [
    {
      role: "user",
      content:
        `**RollOutcome**: -10\n` +
        `**Progress Score**: 18\n` +
        `**WorldType**: This is a second-world fantasy where ancient dragons dominate human kingdoms.\n` +
        `**Storyline**: \n**Synopsis**: The Dragon Lords’ rule is threatened as rebels in the Mistwood Forests uncover an ancient artifact capable of shifting the balance of power.\n` +
        `**Previous Situation**: You were following faint tracks leading deeper into the Mistwood Forests, where the rebels are rumored to be hiding.\n` +
        `**UserAction**: "I press on through the forest, using my sword to clear the undergrowth."\n` +
        `**Belongings**: A jagged sword bearing the insignia of the Dragon Lords, a faded map of the Mistwood Forests, and a pouch of healing herbs.\n` +
        `**PowerSystem**: Magic flows from dragons, granting Dragonkin powers through dragonfire.`,
    },
    {
      role: "assistant",
      content:
        "The forest seems to conspire against you as the mist grows thicker and the undergrowth tangles around your feet. A sudden crack splits the air, and a massive branch crashes down from above, narrowly missing you. Before you can catch your breath, a deafening roar echoes through the trees, and the ground shakes violently.\n\n" +
        "A colossal beast, its eyes glowing with malice, emerges from the mist. It charges at you with a speed that belies its size, leaving you no time to think. Your sword feels heavy in your hands as you prepare for a desperate fight, knowing that this battle could be your last.",
    },
    {
      role: "user",
      content:
        `**RollOutcome**: 10\n` +
        `**Progress Score**: 17\n` +
        `**WorldType**: This is a second-world fantasy where ancient dragons dominate human kingdoms.\n` +
        `**Storyline**: \n**Synopsis**: The Dragon Lords’ rule is threatened as rebels in the Mistwood Forests uncover an ancient artifact capable of shifting the balance of power.\n` +
        `**Previous Situation**: The player is tracking a group of rebels through the Mistwood Forests, following faint tracks leading deeper into the mist.\n` +
        `**UserAction**: "I proceed cautiously, keeping my sword drawn and scanning for danger."\n` +
        `**Belongings**: A jagged sword bearing the insignia of the Dragon Lords, a faded map of the Mistwood Forests, and a pouch of healing herbs.\n` +
        `**PowerSystem**: Magic flows from dragons, granting Dragonkin powers through dragonfire.`,
    },
    {
      role: "assistant",
      content:
        "The mist parts, revealing a hidden glade bathed in golden light. At its center, the artifact you seek rests atop a pedestal, encased in a shimmering magical barrier. The air hums with energy, and the faint scent of ozone tickles your nose.\n\n" +
        "As you step closer, you notice faint etchings on the ground, likely part of a protective ward. The rebels you were tracking are nowhere in sight, and for the first time, it feels as though the artifact is truly within your grasp.",
    },
    {
      role: "user",
      content:
        `**RollOutcome**: -4\n` +
        `**Progress Score**: 8\n` +
        `**WorldType**: A post-apocalyptic world reclaimed by nature.\n` +
        `**Storyline**: \n**Synopsis**: An ancient power source buried beneath the Bone Dry Plains could restore civilization or destroy it, sparking conflict between the Scavenger Clans and Forest Tribes.\n` +
        `**Previous Situation**: You are searching the ruins of an abandoned factory, hoping to find clues to the power source’s location.\n` +
        `**UserAction**: "I search the debris for anything useful."\n` +
        `**Belongings**: A radiation detector with a cracked display, a rusted crowbar, and a scavenger's backpack filled with tools.\n` +
        `**PowerSystem**: Bio-radiant energy powers rare artifacts but mutates those who use it excessively.`,
    },
    {
      role: "assistant",
      content:
        "The debris shifts under your feet, and a low groan echoes through the factory as the structure threatens to collapse. Among the rubble, your crowbar catches on a rusted metal box. Inside, you find a strange metallic cylinder covered in faint glowing runes.\n\n" +
        "Before you can examine it further, your radiation detector crackles to life, warning of a sudden spike. A faint green mist seeps from cracks in the walls, and your pulse quickens as you realize the danger closing in around you.",
    },
    {
      role: "user",
      content:
        `**RollOutcome**: 0\n` +
        `**Progress Score**: 10\n` +
        `**WorldType**: A post-apocalyptic world reclaimed by nature.\n` +
        `**Storyline**: \n**Synopsis**: An ancient power source buried beneath the Bone Dry Plains could restore civilization or destroy it, sparking conflict between the Scavenger Clans and Forest Tribes.\n` +
        `**Previous Situation**: You are navigating a treacherous swamp, following faint clues that point toward the power source’s location.\n` +
        `**UserAction**: "I carefully wade through the swamp, keeping an eye out for anything unusual."\n` +
        `**Belongings**: A radiation detector with a cracked display, a rusted crowbar, and a scavenger's backpack filled with tools.\n` +
        `**PowerSystem**: Bio-radiant energy powers rare artifacts but mutates those who use it excessively.`,
    },
    {
      role: "assistant",
      content:
        "The swamp stretches endlessly before you, its waters murky and filled with drifting vegetation. A faint glimmer catches your eye in the distance, but the heavy scent of decay makes you hesitate. The ground beneath your feet feels unstable, threatening to pull you deeper with every step.\n\n" +
        "Your radiation detector flickers faintly, signaling a weak reading from the direction of the glimmer. It might be worth investigating, but the oppressive silence suggests you may not be alone here.",
    },
  ];
  
  
    const userInput = {
      role: "user",
      content: `**RollOutcome**: ${context.rollOutcome}**Progress Score**: ${context.progressScore}\n**WorldType**: ${context.worldType}\n**Storyline**: ${context.storyline}\n**Previous Situation**: ${context.previousSituation}\n**UserAction**: ${context.userAction}\n**Belongings**: ${context.belongings}\n**PowerSystem**: ${context.powerSystem}`,
    };
  
    const prompt = [
      { role: "system", content: situationPrompt },
      ...fewShotExamples,
      userInput,
    ];
  
    try {
      const nextSituation = await generateResponse(prompt, 300);
      return nextSituation;
    } catch (error) {
      console.error("Error generating next situation:", error);
      return "The story continues, but the details are shrouded in uncertainty.";
    }
  }
  
/**
 * Generate the final situation to conclude the story based on the context and roll outcome.
 * @param {Object} worldData - Contains worldType, storyline, previous situation, userAction, and rollOutcome.
 * @param {Function} generateResponse - Function to call the LLM for generating text.
 * @returns {Promise<string>} - The generated end situation.
 */
export async function generateEndSituation(context, generateResponse) {
    const endSituationPrompt = `You are a world-building assistant for an RPG. Using the provided context, generate the final situation in the adventure to conclude the story.
  
  **Guidelines**:
  - This is the last situation, wrapping up the story based on the provided context.
  - Use the **rollOutcome** to determine the tone and resolution:
    - **-10 to -6**: A catastrophic ending with dire consequences for the player or the world.
    - **-5 to -1**: A bittersweet or partial failure with some losses or unresolved issues.
    - **0**: A neutral ending where the player neither fully succeeds nor fails.
    - **1 to 4**: A moderately positive ending, with some success but lingering challenges.
    - **5 to 9**: A highly successful outcome that achieves most objectives.
    - **10**: A perfect ending, where the player’s efforts result in an overwhelmingly positive resolution.
  - Reference the storyline’s main objective, **previous situation**, and **user action** to ensure continuity.
  - Include sensory details and emotional impact to make the conclusion engaging.
  - Write in **two paragraphs**, each with **2-3 sentences maximum**.`;
  
    const fewShotExamples = [
      {
        role: "user",
        content:
          `**RollOutcome**: -10\n**WorldType**: This is a second-world fantasy where ancient dragons dominate human kingdoms.\n` +
          `**Storyline**: \n**Synopsis**: The Dragon Lords’ rule is threatened as rebels in the Mistwood Forests uncover an ancient artifact capable of shifting the balance of power.\n` +
          `**Main Quest Objective**: Recover the artifact and return it to the Dragon Lords—or betray them and use the artifact to aid the rebels in overthrowing their rule.\n` +
          `**Previous Situation**: The artifact was within reach, but a massive beast emerged from the shadows, leaving you no choice but to fight for your life.\n` +
          `**UserAction**: "I charge at the beast with my sword, aiming for its exposed flank."`,
      },
      {
        role: "assistant",
        content:
          "The beast roars, its claws tearing through the air as you desperately parry with your blade. Every strike drains your strength, and the artifact’s golden glow fades into the distance as the beast drives you back. In a final, desperate lunge, its claws strike true, and pain shoots through your chest before the world goes dark.\n\n" +
          "When you awaken, the artifact is gone, along with your chance to change the fate of the realm. The rebels grow stronger with each passing day, and the Dragon Lords’ dominion crumbles into chaos. Your failure weighs heavily on your heart, a reminder that even the strongest will cannot always prevail.",
      },
      {
        role: "user",
        content:
          `**RollOutcome**: 10\n**WorldType**: This is a second-world fantasy where ancient dragons dominate human kingdoms.\n` +
          `**Storyline**: \n**Synopsis**: The Dragon Lords’ rule is threatened as rebels in the Mistwood Forests uncover an ancient artifact capable of shifting the balance of power.\n` +
          `**Main Quest Objective**: Recover the artifact and return it to the Dragon Lords—or betray them and use the artifact to aid the rebels in overthrowing their rule.\n` +
          `**Previous Situation**: The artifact rests in your hands, its power humming through your veins as the mist around you clears.\n` +
          `**UserAction**: "I raise the artifact high, channeling its power to end the conflict once and for all."`,
      },
      {
        role: "assistant",
        content:
          "The artifact pulses in your hands, its energy flowing through you like a river of light. As you step forward, the mist parts completely, revealing the rebel leader standing before you, their weapon lowered in awe. A single choice hangs in the air—return the artifact to the Dragon Lords or use its power to forge a new future.\n\n" +
          "With a calm determination, you raise the artifact high, its light spreading across the forest like dawn breaking through the night. The rebels kneel, the power of the artifact binding them to your will. In that moment, the fate of the realm is sealed, and the world begins to reshape under your command.",
      },
      {
        role: "user",
        content:
          `**RollOutcome**: -3\n**WorldType**: A post-apocalyptic world reclaimed by nature.\n` +
          `**Storyline**: \n**Synopsis**: An ancient power source buried beneath the Bone Dry Plains could restore civilization or destroy it, sparking conflict between the Scavenger Clans and Forest Tribes.\n` +
          `**Main Quest Objective**: Find the power source and decide its fate—restore civilization, destroy it, or give it to the highest bidder.\n` +
          `**Previous Situation**: The power source lies exposed before you, but the Forest Tribes have surrounded you, demanding its destruction.\n` +
          `**UserAction**: "I hand over the power source, hoping to avoid a violent confrontation."`,
      },
      {
        role: "assistant",
        content:
          "The Forest Tribes close in, their weapons gleaming in the dim light of the underground chamber. You clutch the power source tightly, its energy pulsing against your skin as the air grows thick with tension. With no escape in sight, you lower your head and reluctantly hand over the device, its light fading as the tribesmen cheer.\n\n" +
          "Though the power source is lost, you feel a hollow ache in your chest, knowing what could have been. The clans scatter, and the Bone Dry Plains remain a wasteland, their secrets buried once more. You leave the ruins behind, a lone wanderer in a world that will never know what might have been.",
      },
    ];
  
    const userInput = {
      role: "user",
      content: `**RollOutcome**: ${context.rollOutcome}\n**WorldType**: ${context.worldType}\n**Storyline**: ${context.storyline}\n**Previous Situation**: ${context.previousSituation}\n**UserAction**: ${context.userAction}`,
    };
  
    const prompt = [
      { role: "system", content: endSituationPrompt },
      ...fewShotExamples,
      userInput,
    ];
  
    try {
      const endSituation = await generateResponse(prompt, 300);
      return endSituation;
    } catch (error) {
      console.error("Error generating end situation:", error);
      return "The story ends, but the details are lost in shadow...";
    }
  }
  
  

  /**
 * Update the character’s belongings based on the situation and context.
 * @param {Object} context - The context for updating belongings.
 * @param {Function} generateResponse - Function to call the LLM for generating text.
 * @returns {Promise<string>} - The updated belongings.
 */
export async function updateBelongings(context, generateResponse) {
    const belongingsPrompt = `You are an assistant for an RPG. Based on the provided context, update the character’s belongings to reflect any changes caused by the situation.
  
  **Guidelines**:
  - Analyze the situation and determine if it affects the character’s belongings:
    - If the situation explicitly mentions acquiring new items, losing items, or damaging belongings, update the belongings accordingly.
    - If the situation does not affect belongings, rewrite the belongings list unchanged.
  - Ensure belongings remain consistent with the **worldType** and **powerSystem**.
  - Include 2-4 items that are useful, relevant to the character’s role, and aligned with the situation's outcome.
  - Avoid narrative descriptions; output only the updated belongings.
  
  **Output Format**:
  **Belongings**: [Updated list of belongings.]`;
  
    const fewShotExamples = [
      {
        role: "user",
        content:
          `**worldType**: This is a second-world fantasy where ancient dragons dominate human kingdoms.
  **Previous Belongings**: A jagged sword bearing the insignia of the Dragon Lords, a faded map of the Mistwood Forests, a pouch of healing herbs.
  **Situation**: The altar’s runes glowed as you placed your hand on it. A hidden compartment opened, revealing a small crystal shard pulsating with magic.
  **PowerSystem**: Magic flows from dragons, granting Dragonkin powers through dragonfire.`,
      },
      {
        role: "assistant",
        content:
          "**Belongings**: A jagged sword bearing the insignia of the Dragon Lords, a faded map of the Mistwood Forests, a pouch of healing herbs, and a crystal shard pulsating with magic.",
      },
      {
        role: "user",
        content:
          `**worldType**: A post-apocalyptic world reclaimed by nature.
  **Previous Belongings**: A radiation detector with a cracked display, a scavenger's backpack filled with tools, and a worn protective suit patched with scrap metal.
  **Situation**: The mutant’s attack tore through your protective suit, leaving it in tatters and exposing you to bio-radiant energy.
  **PowerSystem**: Bio-radiant energy powers rare artifacts but mutates those who use it excessively.`,
      },
      {
        role: "assistant",
        content:
          "**Belongings**: A radiation detector with a cracked display, a scavenger's backpack filled with tools.",
      },
      {
        role: "user",
        content:
          `**worldType**: This is a second-world fantasy where ancient dragons dominate human kingdoms.
  **Previous Belongings**: A jagged sword bearing the insignia of the Dragon Lords, a faded map of the Mistwood Forests, a pouch of healing herbs.
  **Situation**: You navigated the dense forest carefully, avoiding traps and hostile creatures. The path ahead seems clear for now.
  **PowerSystem**: Magic flows from dragons, granting Dragonkin powers through dragonfire.`,
      },
      {
        role: "assistant",
        content:
          "**Belongings**: A jagged sword bearing the insignia of the Dragon Lords, a faded map of the Mistwood Forests, a pouch of healing herbs.",
      },
    ];
  
    const userInput = {
      role: "user",
      content: `**worldType**: ${context.worldType}\n**Previous Belongings**: ${context.previousBelongings}\n**Situation**: ${context.situation}\n**PowerSystem**: ${context.powerSystem}`,
    };
  
    const prompt = [
      { role: "system", content: belongingsPrompt },
      ...fewShotExamples,
      userInput,
    ];
  
    try {
      const updatedBelongings = await generateResponse(prompt, 100);
      return updatedBelongings;
    } catch (error) {
      console.error("Error updating belongings:", error);
      return `**Belongings**: ${context.previousBelongings}`;
    }
  }
  
  
  
  