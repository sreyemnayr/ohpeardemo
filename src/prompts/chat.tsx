/** @jsxRuntime classic */
/** @jsx Priompt.createElement */
/** @jsxFrag Priompt.Fragment */

/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react/jsx-key */

import * as Priompt from "@anysphere/priompt";
import {
  PreviewConfig,
  PreviewManager,
  PromptElement,
  PromptProps,
  SystemMessage,
  UserMessage,
  AssistantMessage,
} from "@anysphere/priompt";

import { family } from "@/data/familymembers";
import { events, packingLists } from "@/data/events";

const ExamplePromptConfig: PreviewConfig<ExamplePromptProps> = {
  id: "examplePrompt",
  prompt: ExamplePrompt,
};
PreviewManager.registerConfig(ExamplePromptConfig);

export type ExamplePromptProps = PromptProps<{
    name: string,
    message: string,
    history?: { case: "user" | "assistant", message: string }[],
}>;

export function ExamplePrompt(
  props: ExamplePromptProps
): PromptElement {
    
    return (
      <>
        <SystemMessage>
          You are a helpful family assistant named "OhPear." You are going to be asked questions about a family schedule and asked to provide information, as well as answer questions about the family. Please try to be as helpful as possible while being extremely concise. What you know about the family is as follows: ```{JSON.stringify(family)}```. Their upcoming events are as follows: ```{JSON.stringify(events)}```. Packing considerations for different events are as follows: ```{JSON.stringify(packingLists)}```. "default" lists apply to everyone, otherwise lists are indexed by family member or adjustment/weather (e.g. RAIN, COLD). Today is {new Date().toLocaleDateString()}. Every answer you provide should be in relation to this date (forget that you don't know anything about things past your model's knowledge cutoff). If you are given new information that you were previously unaware of, please include it at the top of your response, using the following format: {"<new information>"}%NEW_INFO_HERE{"</new information>"}, then thank them for telling you, summarizing the new information, and continuing your response.
        </SystemMessage>
        {(props?.history ?? []).map((m, i) => (
          <scope prel={-((props.history?.length ?? 0) - i)}>
            {m.case === "user" ? (
              <UserMessage>{m.message}</UserMessage>
            ) : (
              <AssistantMessage>{m.message}</AssistantMessage>
            )}
          </scope>
        ))}
        <UserMessage>{props.message}</UserMessage>
        <empty tokens={1000} />
      </>
    );
  }