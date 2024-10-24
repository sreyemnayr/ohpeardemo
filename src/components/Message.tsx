"use client";

import { Attachment } from "ai";
import { motion } from "framer-motion";
import { ReactNode } from "react";

import { Markdown } from "@/components/Markdown";
import { PreviewAttachment } from "@/components/preview-attachment";


export const Message = ({
  role,
  content,
  attachments,
}: {
  role: string;
  content: string | ReactNode;
  attachments?: Array<Attachment>;
}) => {

  return (
    <motion.div
      className={`flex mb-4 text-sm gap-4 px-4 w-full ${role === 'user' ? 'justify-end ' : 'justify-start'} `}
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
    >
        <div
      className={`max-w-[85%] rounded-lg p-1 ${role === 'user' ? 'justify-end bg-mint text-white  rounded-br-none' : 'justify-start bg-white text-gun-metal rounded-bl-none'} `}>

      
      {content && <Markdown>{content as string}</Markdown>}
      </div>

      
        
        {/* {toolInvocations && (
          <>
            {toolInvocations.map((toolInvocation) => {
              const { toolName, toolCallId, state } = toolInvocation;

              if (state === "result") {
                const { result } = toolInvocation;

                return (
                  <div key={toolCallId}>
                    {result}
                    <pre>{JSON.stringify(toolInvocation, null, 2)}</pre>
                  </div>
                );
              } else {
                return (
                  <div key={toolCallId} className="skeleton">
                    {toolName}
                    <pre>{JSON.stringify(toolInvocation, null, 2)}</pre>
                  </div>
                );
              }
            })}
          </>
        )} */}

        {attachments && (
          <div className="flex flex-row gap-2">
            {attachments.map((attachment) => (
              <PreviewAttachment key={attachment.url} attachment={attachment} />
            ))}
          </div>
        )}
    </motion.div>
  );
};