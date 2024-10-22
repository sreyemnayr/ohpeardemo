import { openai } from '@ai-sdk/openai';
import { streamText, convertToCoreMessages, Message } from 'ai';
import { z } from 'zod';
import superjson, { SuperJSONResult } from 'superjson'
import { buildSystemPrompt } from '@/data/prompts';
import { family } from '@/data/familymembers';
import { packingLists } from '@/data/events';
import { FamilyEvent } from '@/types';

// Allow streaming responses up to 120 seconds
export const maxDuration = 120;

export async function POST(req: Request) {


const { messages, events_sj }: { messages: Message[], events_sj: SuperJSONResult } = await req.json()

const events = superjson.deserialize(events_sj as SuperJSONResult) as FamilyEvent[]

const system_message = buildSystemPrompt("chat", {now: new Date(), family: family, events: events, packingLists: packingLists}) 

const update_event_schema = z.object({
    id: z.string().describe("The id of the event to update."),
    title: z.string().optional().describe("The new title of the event to update."),
    familyMembers_add: z.array(z.string()).optional().describe("The family members to add to the event."),
    familyMembers_remove: z.array(z.string()).optional().describe("The family members to remove from the event."),
    adjustments_add: z.array(z.string()).optional().describe("The adjustments to add to the event."),
    adjustments_remove: z.array(z.string()).optional().describe("The adjustments to remove from the event."),
    transporting_to: z.string().optional().describe("The name of the family member to transport to the event."),
    transporting_from: z.string().optional().describe("The name of the family member to transport from the event."),
    start_time: z.string().optional().describe("The new start time of the event."),
    end_time: z.string().optional().describe("The new end time of the event."),
    location: z.string().optional().describe("The new location of the event."),
    wholeFamily: z.boolean().optional().describe("Whether the event is for the whole family."),
})

const create_event_schema = z.object({
    title: z.string().describe("The title of the event."),
    familyMembers: z.array(z.string()).describe("The family members to add to the event."),
    transporting_to: z.string().optional().describe("The name of the family member to transport to the event."),
    transporting_from: z.string().optional().describe("The name of the family member to transport from the event."),
    date: z.string().describe("The date of the event."),
    start_time: z.string().optional().describe("The new start time of the event."),
    end_time: z.string().optional().describe("The new end time of the event."),
    location: z.string().optional().describe("The new location of the event."),
})

console.log(system_message.content.toString())
  

  const result = await streamText({
    model: openai('gpt-4o-mini-2024-07-18'),
    system: system_message.content.toString(),
    messages: convertToCoreMessages(messages),
    tools: {
        createEvent: {
            description: "Create a new event with any information provided.",
            parameters: create_event_schema
        },
        updateEvent: {
            description: "Update an existing event with new information.",
            parameters: update_event_schema
        },
        
    },
    onFinish: (result) => {
        console.log(result.responseMessages.filter(m => m.role === "assistant").map(m => m.content))
        console.log(JSON.stringify(result, null, 2))
    },
    maxToolRoundtrips: 5,
    maxSteps: 5,
    // toolChoice: 'required',
  });

  return result.toDataStreamResponse();
}