import { NextRequest, NextResponse } from 'next/server';

// import OpenAI from "openai";
// const openai = new OpenAI();

// import { render, promptToOpenAIChatMessages } from "@anysphere/priompt";
// import { ExamplePrompt } from "@/prompts/chat";
// import { getTokenizerByName_ONLY_FOR_OPENAI_TOKENIZERS } from '@anysphere/priompt/dist/tokenizer';
// import { ChatCompletionRequestMessage as PriomptChatCompletionRequestMessage } from '@anysphere/priompt/dist/openai';



// type ChatCompletionMessage = OpenAI.Chat.ChatCompletionSystemMessageParam | OpenAI.Chat.ChatCompletionUserMessageParam | OpenAI.Chat.ChatCompletionAssistantMessageParam | OpenAI.Chat.ChatCompletionToolMessageParam;

// const chatCompletionMessageToOpenAIChatCompletionMessage = (message: PriomptChatCompletionRequestMessage): ChatCompletionMessage => {
//     const role = message.role === "tool" ? undefined : message.role;
//     return {
//         role: role,
//         content: message.content,
//     } as ChatCompletionMessage;
// }

// export async function POST(req: NextRequest) {
//     const { name, message } = await req.json();

//     const prompt = ExamplePrompt({ name, message });

//     const output = await render(prompt, {
//         tokenLimit: 1000,
// 		tokenizer: getTokenizerByName_ONLY_FOR_OPENAI_TOKENIZERS("cl100k_base"),

//     });

    
//     const completion = await openai.chat.completions.create({
//         model: "gpt-4o-mini-2024-07-18",
//         messages: promptToOpenAIChatMessages(output.prompt).map(chatCompletionMessageToOpenAIChatCompletionMessage),
//     });

//     console.log(completion);

//     return NextResponse.json({
//         message: completion.choices[0].message,
//     });
// }

export async function POST(req: NextRequest) {
    const { message } = await req.json() as { message: string };

    return NextResponse.json({
        message,
    });
}