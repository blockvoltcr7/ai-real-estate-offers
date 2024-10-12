import React from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

interface OfferProps {
  content: string;
  isLoading: boolean;
}

export default function Offer({ content, isLoading }: OfferProps) {
  return (
    <Card className="w-full relative py-6">
      <CardContent>
        <ReactMarkdown
          components={{
            h1: ({ ...props }) => (
              <h1 className="text-2xl font-bold mb-4" {...props} />
            ),
            h2: ({ ...props }) => (
              <h2 className="text-xl font-semibold mb-3" {...props} />
            ),
            h3: ({ ...props }) => (
              <h3 className="text-lg font-medium mb-2" {...props} />
            ),
            p: ({ ...props }) => <p className="mb-4" {...props} />,
            ul: ({ ...props }) => (
              <ul className="list-disc pl-5 mb-4" {...props} />
            ),
            ol: ({ ...props }) => (
              <ol className="list-decimal pl-5 mb-4" {...props} />
            ),
            li: ({ ...props }) => <li className="mb-1" {...props} />,
            strong: ({ ...props }) => (
              <strong className="font-semibold" {...props} />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </CardContent>
      {isLoading && (
        <div className="absolute inset-0 bg-orange-500 bg-opacity-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-white" />
        </div>
      )}
    </Card>
  );
}
