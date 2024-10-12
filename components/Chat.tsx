"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Message, useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

interface ChatProps {
  offerContent: string;
  onOfferUpdate: (updatedOffer: string) => void;
  onLoadingChange: (isLoading: boolean) => void;
}

interface OfferData {
  confirmation: string;
  updatedOffer: string;
}

export default function Chat({
  offerContent,
  onOfferUpdate,
  onLoadingChange,
}: ChatProps) {
  const [latestOffer, setLatestOffer] = useState(offerContent);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleOfferUpdate = useCallback(
    (newOffer: string) => {
      setLatestOffer(newOffer);
      onOfferUpdate(newOffer);
    },
    [onOfferUpdate]
  );

  const handleNewMessage = useCallback(
    (messages: Message[]) => {
      for (let i = messages.length - 1; i >= 0; i--) {
        const message = messages[i];
        if (message.role === "assistant" && message.toolInvocations) {
          for (const toolInvocation of message.toolInvocations) {
            if (
              toolInvocation.toolName === "updateOffer" &&
              toolInvocation.state === "result"
            ) {
              const result = toolInvocation.result as OfferData;
              if (result.updatedOffer) {
                handleOfferUpdate(result.updatedOffer);
                return;
              }
            }
          }
        }
      }
    },
    [handleOfferUpdate]
  );

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/chat",
      initialMessages: [
        {
          id: "1",
          role: "system",
          content:
            "You are a helpful assistant specializing in real estate offers.",
        },
        {
          id: "2",
          role: "assistant",
          content:
            "Hello! I'm here to help you update your real estate offer. What changes would you like to make?",
        },
      ],
      body: {
        currentOffer: latestOffer,
      },
      onFinish: () => {
        setIsProcessing(false);
        onLoadingChange(false);
      },
    });

  useEffect(() => {
    handleNewMessage(messages);
  }, [messages, handleNewMessage]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    onLoadingChange(isProcessing || isLoading);
  }, [isProcessing, isLoading, onLoadingChange]);

  useEffect(() => {
    console.log("Updating latest offer:", offerContent);
    setLatestOffer(offerContent);
  }, [offerContent]);

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsProcessing(true);
    onLoadingChange(true);

    console.log("Submitting chat message:", input);
    console.log("Current offer:", latestOffer);
    handleSubmit(e, {
      options: {
        body: {
          currentOffer: latestOffer,
        },
      },
    });
  };

  const displayMessages = messages.slice(1);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">Chat History</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4 mb-4" ref={scrollAreaRef}>
          {displayMessages.map((message: Message) => (
            <div key={message.id} className="mb-4">
              <p
                className={`font-semibold ${
                  message.role === "user" ? "text-gray-600" : "text-orange-500"
                }`}
              >
                {message.role === "user" ? "You" : "AI"}:
              </p>
              {message.content ? (
                <p
                  className={`mt-1 ${
                    message.role === "user"
                      ? "text-gray-700"
                      : "text-orange-600"
                  }`}
                >
                  {message.content}
                </p>
              ) : message.toolInvocations &&
                message.toolInvocations.length > 0 ? (
                <p className="mt-1 italic text-orange-600">Updating offer...</p>
              ) : null}
            </div>
          ))}
        </ScrollArea>
        <form
          onSubmit={handleFormSubmit}
          className="flex items-center space-x-2"
        >
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-grow"
          />
          <Button
            type="submit"
            disabled={isProcessing || isLoading}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {isProcessing || isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Send"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
