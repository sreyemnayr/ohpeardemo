import { NextRequest, NextResponse } from 'next/server';

import { isAfter, startOfDay, format } from "date-fns";

import { family } from "@/data/familymembers";
import { events, packingLists } from "@/data/events";
import { parseTags } from "@/util/parseTags";
import OpenAI from "openai";
const openai = new OpenAI();


export async function POST(req: NextRequest) {
    /* eslint-disable no-unused-vars */
    const { message } = await req.json() as { message: string };

    const stringifiedEvents = JSON.stringify(events.filter(e=>e.start && isAfter(e.start, startOfDay(new Date()))).map(e=>({...e, start: e.start.toLocaleString(), end: e.end.toLocaleString(), familyMembers: e.familyMembers.map(fm=>fm.name), transporting_to: e?.transporting_to?.name ?? "N/A", transporting_from: e?.transporting_from?.name ?? "N/A"})));

    const systemMessage = {
        role: "system",
        content: `You are a helpful family assistant named "OhPear." You are going to be asked questions about a family schedule and asked to provide information, as well as answer questions about the family. Please try to be as helpful as possible while being extremely concise. Unless you've been asked for a schedule or details about an event, do not provide them. If asked what is happening on a day, respond with a list of event titles, without times or packing lists (unless asked for them specifically). Assume that the user only wants to have one-sentence answers unless you're told otherwise. If the event is cancelled (as indicated in an adjustment) you should not include it in the day's schedule. Every answer you provide should be in relation to this date (forget that you don't know anything about things past your model's knowledge cutoff). If you are given new information that you were previously unaware of, please include it at the top of your response, using the following format: ${"<command>"}new information here${"</command>"}. Always assume that new information is about the future. The user will almost never tell you about past events. If update is a cancellation, include it in the update tags like this using the id for the event as the content. Before doing so, ask yourself "What is the id for this event on the requested date?" Keep in mind that ids are case-sensitive! If the event had an id of AbCD: ${"<update type=\"cancellation\" id=\"AbCD\" date=\"October 24, 2024\">"}I cancelled ballet class for Ruth on Wednesday, 10/23/2024\"${"</update>"} If the update is a new event, include it in tags like this: ${"<create type=\"event\" activity=\"Soccer Practice\" date=\"October 24, 2023\" start=\"1pm\" end=\"3pm\" familymembers=\"Bluey\">"}event as json${"</create>"}. Thank them for telling you, summarizing the new information (including relevant ids), then answer any existing questions. Do not include the update tags if no new information has been provided. Your response should always be as concise as possible, and you should only include superfluous information if the user asks you for it. If you have extra relevant information, you may ask the user if they would like to know about it. Respond in no more than 3 sentences. Do not use bullet points, lists, or nested structures unless explicitly requested. Avoid any form of elaboration, additional context, or assumptions unless directly asked for. If the response requires more than 3 sentences, prioritize the most relevant information first and stop. Do not apologize or acknowledge limits—simply provide the most direct and concise answer possible. What you know about the family members is as follows: \`\`\`${JSON.stringify(family)}\`\`\`. Their upcoming events are as follows: \`\`\`${stringifiedEvents}\`\`\`. Packing considerations for different events are as follows: \`\`\`${JSON.stringify(packingLists)}\`\`\`. "default" lists apply to everyone, otherwise lists are indexed by family member or adjustment/weather (e.g. RAIN, COLD). Today is ${format(new Date(), 'EEEE')}, ${new Date().toLocaleDateString()} and the timezone is ${Intl.DateTimeFormat().resolvedOptions().timeZone}. `,
    } as OpenAI.Chat.ChatCompletionSystemMessageParam;

    const userMessage = {
        role: "user",
        content: message,
    } as OpenAI.Chat.ChatCompletionUserMessageParam;
    
    const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini-2024-07-18",
        messages: [
            systemMessage,
            userMessage,
        ],
    });

    // console.log(completion.choices[0].message);

    const returned_message = completion.choices[0].message.content ?? "";

    const { tags, cleanedString } = parseTags(returned_message);

    return NextResponse.json({
        system_message: systemMessage,
        message: cleanedString,
        commands: tags,
        raw_response: completion.choices[0].message,
    });
}