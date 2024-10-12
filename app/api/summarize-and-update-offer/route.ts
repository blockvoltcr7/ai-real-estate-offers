import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fileContents, currentOffer } = await req.json();

    // Validation
    if (!fileContents || !currentOffer) {
      return NextResponse.json(
        { error: "Missing file contents or current offer" },
        { status: 400 }
      );
    }

    const prompt = `
      Analyze the following file contents and the current offer. 
      Summarize the key information from the files and update the offer accordingly. 
      Fill in any blanks or missing information based on the file contents.

      File Contents:
      ${fileContents}

      Current Offer:
      ${currentOffer}

      Please provide an updated offer based on this information.
      Respond ONLY with the updated offer in markdown format, without any additional commentary.
      Do NOT add '''markdown or ''' at the beginning or end of the response.
    `;

    const { text: updatedOffer } = await generateText({
      model: openai("gpt-4o"),
      prompt: prompt,
    });

    return NextResponse.json({ updatedOffer });
  } catch (error) {
    console.error("Error in summarize-and-update-offer:", error);
    return NextResponse.json(
      { error: "Failed to summarize and update offer" },
      { status: 500 }
    );
  }
}
