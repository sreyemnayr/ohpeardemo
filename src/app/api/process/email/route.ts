export const maxDuration = 300;

import { NextRequest, NextResponse } from 'next/server';

import { buildSystemPrompt } from "@/data/prompts";
import { parseTags } from "@/util/parseTags";
import { extractEmailDate } from "@/util/extractEmailDate";
import { FamilyEvent } from "@/types";

import superjson from 'superjson'

import OpenAI from "openai";
const openai = new OpenAI();

import { family } from "@/data/familymembers";
import { packingLists } from "@/data/events";

export async function POST(req: NextRequest) {
    /* eslint-disable no-unused-vars */
    // const { message, events } = await req.json() as { message: string, events: FamilyEvent[] };
    const { message, events } = superjson.parse(await req.text()) as { message: string, events: FamilyEvent[] };

    const userMessage = {
        role: "user",
        content: message,
    } as OpenAI.Chat.ChatCompletionUserMessageParam;

    const systemMessage = buildSystemPrompt("email", {now: extractEmailDate(message) ?? new Date(), family: family, events: events, packingLists: packingLists})
    
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