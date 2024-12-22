// scripts/worldbuilding.js

/**
 * STEP 1: Generate the world type and brief description
 * - Uses few-shot examples to guide the model to produce a 3-4 sentence description
 * - Identifies the world type (real-world or second-world) and sets the scene
 */
export async function generateWorldType(worldData, generateResponse) {
    const worldTypeSystemPrompt = `You are a world-building assistant for a text-based RPG. Based on the user’s input, identify the world type and provide a brief description in 2-3 sentences.  
  **Guidelines:**
  - Identify if the world is a real-world fantasy or a second-world fantasy.
  - Describe the core concept of the world (e.g., dystopian, high fantasy, post-apocalyptic).
  - Include a key feature or unique element that defines the world.
  - Avoid introductions, commentary, or meta-descriptions.
    `;
  
    const worldTypeFewShot = [
      { role: "system", content: worldTypeSystemPrompt },
      {
        role: "user",
        content: "Alternate history where the Roman Empire never fell.",
      },
      {
        role: "assistant",
        content:
          "This is a real-world fantasy set in an alternate timeline where the Roman Empire still dominates Europe. Advanced Roman engineering and governance shape the modern world. Gladiatorial games and imperial politics coexist with technological advancements. Society thrives under strict hierarchies and ancient traditions.",
      },
      {
        role: "user",
        content: "High fantasy world filled with sentient magical forests.",
      },
      {
        role: "assistant",
        content:
          "This is a second-world fantasy where vast, sentient forests breathe with magic. Trees whisper secrets to those who listen, and nature spirits guard the ancient groves. Humans and elves coexist with the forests, though mistrust simmers between them. Magic flows through the land, binding all life together.",
      },
      {
        role: "user",
        content: "Futuristic world controlled by corporations.",
      },
      {
        role: "assistant",
        content:
          "This is a second-world fantasy where mega-corporations control every aspect of life. Towering skyscrapers loom over polluted streets, and citizens live under constant surveillance. Technology advances rapidly, but freedom is scarce. Rebel factions fight to reclaim autonomy from corporate overlords.",
      },
      { role: "user", content: worldData.userInput },
    ];
  
    console.log("Generating world type...");
    const worldType = await generateResponse(worldTypeFewShot, 150);
    console.log("World type generated");
  
    worldData.worldType = worldType;
    return worldData;
  }
  
  export async function generateRegions(worldData, generateResponse) {
    const regionsSystemPrompt = `You are a world-building assistant for a text-based RPG. Using the previously generated world type and description, provide a structured description of 3-4 distinct geographic regions. Focus on terrain, climate, natural features, and environmental details only.
  **Guidelines:**
  - Present the output in a **structured format** with clearly labeled sections.
  - Describe 3-4 regions clearly.
  - Avoid mentioning inhabitants, cultures, or political entities.
  - Avoid narrative or literary style.
  - Keep descriptions consistent with the previously generated world type.
  - Avoid introductions, commentary, or meta-descriptions.`;
  
    const regionsFewShot = [
      {
        role: "system",
        content: regionsSystemPrompt,
      },
      // Example 1: Dragon-dominated fantasy (geography only)
      {
        role: "user",
        content:
          "World Type and Description: This is a second-world fantasy where ancient dragons dominate human kingdoms. Advanced dragon magic shapes the land, and the environment is diverse and influenced by elemental forces.",
      },
      {
        role: "assistant",
        content:
          "**Regions:**\n" +
          "1. **Ember Plains**: Extensive, rolling grasslands with a temperate climate, dotted with geysers and hot springs.\n" +
          "2. **Ashen Peaks**: A volcanic mountain range characterized by constant ashfall, geothermal vents, and mineral-rich rock formations.\n" +
          "3. **Mistwood Forests**: Dense temperate forests enshrouded in perpetual mist, with towering evergreen trees and hidden marshy glens.\n",
      },
      // Example 2: Post-apocalyptic reclaimed nature (geography only)
      {
        role: "user",
        content:
          "World Type and Description: This is a post-apocalyptic world reclaimed by nature. Ruined structures blend into natural landscapes, and the climate varies widely across the remnants of old civilizations.",
      },
      {
        role: "assistant",
        content:
          "**Regions:**\n" +
          "1. **Ruined Forests**: Overgrown former urban areas now dominated by hardwood forests and creeping vines.\n" +
          "2. **Swamplands**: Low-lying wetlands with slow-moving waters, thick reeds, and frequent seasonal floods.\n" +
          "3. **Bone Dry Plains**: Arid flatlands with cracked earth, scattered rock formations, and sparse drought-resistant shrubs.\n",
      },
      {
        role: "user",
        content: worldData.worldType,
      },
    ];
  
    console.log("Generating regions...");
  
    const regionsText = await generateResponse(regionsFewShot, 200);
    worldData.regions = regionsText;
    console.log("Regions generated");
    return worldData;
  }
  
  export async function generatePowers(worldData, generateResponse) {
    const powersSystemPrompt = `You are a world-building assistant for a text-based RPG. Your task is to create fictional powers or factions in an imaginary world based on the provided context. These factions are entirely fictional and have no connection to the real world.
  **Guidelines:**
  - Describe 2-3 fictional powers or factions in a **structured format**.
  - Include where each faction is located, their main interests, and how they influence or control the regions.
  - Ensure the description is consistent with the provided world type and geographic context.
  - Avoid narrative or literary style.
  - Avoid introductions, commentary, or meta-descriptions.
      `;
  
    const powersFewShot = [
      {
        role: "system",
        content: powersSystemPrompt,
      },
      // Example 1: Dragon world with known regions
      {
        role: "user",
        content:
          "World Type and Description: Second-world fantasy with dragon dominance.\nRegions Identified: Ember Plains, Ashen Peaks, Mistwood Forests.",
      },
      {
        role: "assistant",
        content:
          "**Key Powers/Factions:**\n" +
          "1. **Dragon Lords**: Based in the Ember Plains, demanding tribute and enforcing law.\n" +
          "2. **Dragonkin Enforcers**: Operating across all regions, ensuring obedience.\n" +
          "3. **Rebel Factions**: Hidden in the Mistwood Forests, seeking to undermine dragon rule.\n",
      },
      // Example 2: Post-apocalyptic with known regions
      {
        role: "user",
        content:
          "World Type and Description: Post-apocalyptic reclaimed nature world.\nRegions Identified: Ruined Forests, Swamplands, Bone Dry Plains.",
      },
      {
        role: "assistant",
        content:
          "**Key Powers/Factions:**\n" +
          "1. **Forest Tribes**: Inhabit Ruined Forests, live off the land and shun old technology.\n" +
          "2. **Scavenger Clans**: Roam the Bone Dry Plains, trading salvaged materials.\n" +
          "3. **Swamp Dwellers**: Dwell in Swamplands, knowledgeable in local resources.\n",
      },
      // Actual context
      {
        role: "user",
        content:
          `World Type and Description:\n${worldData.worldType}\n\n` +
          `Geographic Regions:\n${worldData.regions}`,
      },
    ];
  
    console.log("Generating powers/factions...");
    const powersText = await generateResponse(powersFewShot, 300);
    console.log("Powers generated");
    worldData.powers = powersText;
    return worldData;
  }
  
  export async function generateResources(worldData, generateResponse) {
    const resourcesSystemPrompt = `You are a world-building assistant for a text-based RPG. Using the previously generated world type and description, identify one abundant resource and one scarce resource. Specify where they can be found and why they are valuable.
  **Guidelines:**
  - Present the output in a **structured format**.
  - List one abundant resource and one scarce resource.
  - Describe where each is located.
  - Keep descriptions consistent with previously generated context.
  - Avoid narrative or literary style.
  - Avoid introductions, commentary, or meta-descriptions.
      `;
  
    const resourcesFewShot = [
      {
        role: "system",
        content: resourcesSystemPrompt,
      },
      // Example 1: Dragon world
      {
        role: "user",
        content:
          "This is a second-world fantasy where ancient dragons dominate human kingdoms. Advanced dragon magic permeates the land, shaping ecosystems.",
      },
      {
        role: "assistant",
        content:
          "**Resources:**\n" +
          "- **Abundant Resource**: Mineral-rich crystals found near volcanic vents, used to bolster dragon magic.\n" +
          "- **Scarce Resource**: High-quality iron ore, located in limited veins beneath grassland soils.",
      },
      // Example 2: Post-apocalyptic world
      {
        role: "user",
        content:
          "A post-apocalyptic world reclaimed by nature, where survivors scavenge from overgrown ruins.",
      },
      {
        role: "assistant",
        content:
          "**Resources:**\n" +
          "- **Abundant Resource**: Freshwater from natural springs and rain-fed streams.\n" +
          "- **Scarce Resource**: Intact metal alloys, scavenged from collapsed infrastructure in limited areas.",
      },
      {
        role: "user",
        content: `${worldData.worldType}`,
      },
    ];
  
    console.log("Generating resources...");
    const resourcesText = await generateResponse(resourcesFewShot, 200);
    console.log("Resources generated");
    worldData.resources = resourcesText;
    return worldData;
  }
  
  /**
   * STEP 3: Generate the population details
   */
  export async function generatePopulation(worldData, generateResponse) {
    const populationSystemPrompt = `You are a world-building assistant for a text-based RPG. Using the previously generated world type, description, and geographic situation, provide a structured, brief description of the primary inhabitants of the world in 2-3 sentences total.
  **Guidelines:**
  - Present the output in a **structured format**, clearly labeled.
  - Introduce exactly **3 distinct population groups**, focusing only on key traits and roles.
  - Briefly mention their relationships and power dynamics in a concise manner.
  - Ensure consistency with the previously generated context.
  - Avoid detailed story elements, individual names, or lengthy explanations.
  - Avoid introductions, commentary, or meta-descriptions.`;
  
    const populationFewShot = [
      { role: "system", content: populationSystemPrompt },
      // Example 1
      {
        role: "user",
        content:
          "World Type: A second-world fantasy dominated by ancient dragons.\n" +
          "Geography: Volcanic peaks and mist-shrouded forests.\n" +
          "Powers: Dragons command magic and enforce order.\n" +
          "Resources: Abundant gemstones in volcanic areas, scarce iron in grassy plains.",
      },
      {
        role: "assistant",
        content:
          "**Primary Inhabitants:**\n" +
          "1. **Dragonkin**: Magic-infused beings enforcing draconic rules.\n" +
          "2. **Highland Foragers**: Resilient folk gathering herbs in volcanic highlands.\n" +
          "3. **Forest Settlers**: Quiet communities adapting to misty woodland terrains.\n\n" +
          "They trade resources carefully, maintaining a fragile balance under draconic supervision.",
      },
      // Example 2
      {
        role: "user",
        content:
          "World Type: A post-apocalyptic world reclaimed by forests and swamps.\n" +
          "Geography: Overgrown ruins, marshy lowlands, and dry plains scattered with old machinery.\n" +
          "Powers: Scavenger gangs hold mechanical scraps, swamp tribes guard hidden springs.\n" +
          "Resources: Freshwater abundant in wetlands, usable metal scarce in old factories.",
      },
      {
        role: "assistant",
        content:
          "**Primary Inhabitants:**\n" +
          "1. **Forest Wanderers**: Nomadic groups skilled in foraging dense woodlands.\n" +
          "2. **Swamp Collectors**: Cautious gatherers tapping marsh resources.\n" +
          "3. **Plains Scavengers**: Opportunistic salvagers retrieving rare metals.\n\n" +
          "They exchange tools and knowledge, with no single group dominating, creating a precarious equilibrium.",
      },
      // Actual context
      {
        role: "user",
        content:
          `World Type and Description:\n${worldData.worldType}\n\n` +
          `Geographic Situation:\n${worldData.regions}\n\n` +
          `Key Powers/Factions (if any):\n${worldData.powers || ""}\n\n` +
          `Resources:\n${worldData.resources || ""}`,
      },
    ];
  
    console.log("Generating population...");
    const populationText = await generateResponse(populationFewShot, 150);
    console.log("Population generated");
    worldData.population = populationText;
    return worldData;
  }
  
  export async function generatePowerSystem(worldData, generateResponse) {
    const powerSystemSystemPrompt = `You are a world-building assistant for a text-based RPG. Based on the previously generated world type and description, define a power system correlating numeric progression (levels, stats) with distinct, observable traits or abilities. This will serve as factual guidelines to ensure that enemy descriptions match their actual level and abilities.
      
  **Guidelines:**
  - Present the output in a **structured format**.
  - Identify a core source of power (e.g., energy, magic, technology).
  - For each tier (low-level, mid-level, high-level), list a few key traits or abilities that scale with level.
  - Keep it concise, factual, and focused on direct correlations: low-level = basic traits, mid-level = intermediate traits, high-level = advanced traits.
  - Avoid narrative or story elements; this is a technical reference.
  - Avoid introductions, commentary, or meta-descriptions.`;
  
    const powerSystemFewShot = [
      { role: "system", content: powerSystemSystemPrompt },
      // Example 1 (Elemental Magic)
      {
        role: "user",
        content: "World Type/Description: A second-world fantasy filled with elemental magic.",
      },
      {
        role: "assistant",
        content:
          "**Power System:**\n" +
          "- **Core Source:** Elemental currents.\n" +
          "- **Low-Level:** Weak elemental presence, basic attacks (small sparks or gusts), minimal visual cues.\n" +
          "- **Mid-Level:** Noticeable elemental auras, moderate abilities (shaping flames, guiding winds), subtle environmental effects.\n" +
          "- **High-Level:** Complex elemental phenomena (localized storms, earth-shaping), distinct visual markers (glowing eyes, crackling air), rare elemental materials in gear.",
      },
      // Example 2 (Bio-Radiant Mutation)
      {
        role: "user",
        content: "World Type/Description: A post-apocalyptic world fueled by bio-radiant energy.",
      },
      {
        role: "assistant",
        content:
          "**Power System:**\n" +
          "- **Core Source:** Bio-radiant essence.\n" +
          "- **Low-Level:** Subtle mutations, basic abilities (mild toxins, faint glow), minimal natural armor.\n" +
          "- **Mid-Level:** More pronounced mutations (thicker plating, brighter bioluminescence), moderate abilities (stronger toxins, limited regeneration).\n" +
          "- **High-Level:** Extensive biological alterations (armored growths, intricate patterns), advanced abilities (area toxin effects, rapid healing), integration of rare organic materials.",
      },
      // Actual context
      {
        role: "user",
        content: `World Type and Description:\n${worldData.worldType}`,
      },
    ];
  
    console.log("Generating power system...");
    const powerSystemText = await generateResponse(powerSystemFewShot, 200);
    console.log("Power system generated");
    worldData.powerSystem = powerSystemText;
    return worldData;
  }
  