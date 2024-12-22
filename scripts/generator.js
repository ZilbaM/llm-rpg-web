import {
    pipeline,
    env, // though 'env' is imported, it's unused in the snippet. Kept here for consistency.
  } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.1.2";
  
  /**
   * The global generator instance.
   */
  let generator = undefined;
  
  /**
   * Initializes the text-generation pipeline and returns the generator instance.
   */
  export async function initGenerator() {
    console.group("Loading model...");
    console.log("Loading model...");
  
    // Initialize model
    generator = await pipeline(
      "text-generation",
      "onnx-community/Llama-3.2-1B-Instruct-q4f16",
      { device: "webgpu" }
    );
  
    console.log("Model loaded");
    console.groupEnd();
    return generator;
  }
  
  /**
   * Core response generator function that uses the pipeline.
   */
  export async function generateResponse(prompt, maxTokens = 150) {
    if (!generator) {
      throw new Error("Generator is not initialized.");
    }
    let output;
    // Model tends to have an error where the generation contains a bunch of Q letters. Lets regenerate when the content contains 2 Q consecutively anywhere
    let count = 0;
    do {
        count++
        output = await generator(prompt, { max_new_tokens: maxTokens });

    } while (output[0].generated_text.at(-1).content.includes("QQ"));
    console.log(`Generated response in ${count} attempts`);
    return output[0].generated_text.at(-1).content;
  }
  