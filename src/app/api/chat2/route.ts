import { NextRequest, NextResponse } from 'next/server';

import { family } from "@/data/familymembers";
import { events, packingLists } from "@/data/events";
import OpenAI from "openai";
const openai = new OpenAI();


export async function POST(req: NextRequest) {
    /* eslint-disable no-unused-vars */
    const { message } = await req.json() as { message: string };

    const stringifiedEvents = JSON.stringify(events.map(e=>({...e, start: e.start.toLocaleString(), end: e.end.toLocaleString(), familyMembers: e.familyMembers.map(fm=>fm.name), transporting_to: e?.transporting_to?.name ?? "N/A", transporting_from: e?.transporting_from?.name ?? "N/A"})));

    const systemMessage = {
        role: "system",
        content: `You are a helpful family assistant named "OhPear." You are going to be asked questions about a family schedule and asked to provide information, as well as answer questions about the family. Please try to be as helpful as possible while being extremely concise. What you know about the family is as follows: \`\`\`${JSON.stringify(family)}\`\`\`. Their upcoming events are as follows: \`\`\`${stringifiedEvents}\`\`\`. Packing considerations for different events are as follows: \`\`\`${JSON.stringify(packingLists)}\`\`\`. "default" lists apply to everyone, otherwise lists are indexed by family member or adjustment/weather (e.g. RAIN, COLD). Today is ${new Date().toLocaleDateString()} and the timezone is ${Intl.DateTimeFormat().resolvedOptions().timeZone}. If the event is cancelled (as indicated in an adjustment) you should not include it in the day's schedule. Every answer you provide should be in relation to this date (forget that you don't know anything about things past your model's knowledge cutoff). If you are given new information that you were previously unaware of, please include it at the top of your response, using the following format: ${"<new information>"}new information here${"</new information>"}, then thank them for telling you, summarizing the new information, and continuing your response. Do not include the new information tags if no new information has been provided. Your response should be as concise as possible, and you should only include superfluous information if the user asks you for it. If you have extra information, you may ask the user if they would like to know about it.`,
    } as OpenAI.Chat.ChatCompletionSystemMessageParam;

    const userMessage = {
        role: "user",
        content: message,
    } as OpenAI.Chat.ChatCompletionUserMessageParam;

    console.log(systemMessage);
    
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
            systemMessage,
            userMessage,
        ],
    });

    // console.log(completion.choices[0].message);

    return NextResponse.json({
        message: completion.choices[0].message.content,
    });
}