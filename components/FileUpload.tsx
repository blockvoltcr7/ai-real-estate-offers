"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UploadedFile {
  name: string;
  content: string;
}

interface FileUploadProps {
  onAutoGenerate: (updatedOffer: string) => void;
  currentOffer: string;
  onLoadingChange: (isLoading: boolean) => void;
}

export default function FileUpload({
  onAutoGenerate,
  currentOffer,
  onLoadingChange,
}: FileUploadProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    onLoadingChange(isGenerating);
  }, [isGenerating, onLoadingChange]);

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      const newFiles: UploadedFile[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > 5 * 1024 * 1024) {
          toast({
            title: "File too large",
            description: `${file.name} exceeds the 5MB limit.`,
            variant: "destructive",
          });
          continue;
        }
        if (file.type !== "text/plain" && file.type !== "text/html") {
          toast({
            title: "Invalid file type",
            description: `${file.name} is not a text or HTML file.`,
            variant: "destructive",
          });
          continue;
        }
        try {
          const content = await file.text();
          newFiles.push({ name: file.name, content });
        } catch {
          toast({
            title: "Error reading file",
            description: `Failed to read ${file.name}.`,
            variant: "destructive",
          });
        }
      }
      setUploadedFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile = (fileName: string) => {
    setUploadedFiles((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  const handleAutoGenerateOffer = async () => {
    if (uploadedFiles.length === 0) {
      toast({
        title: "No files uploaded",
        description: "Please upload files before auto-generating the offer.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    const fileContents = uploadedFiles
      .map((file) => `File: ${file.name}\n\nContent:\n${file.content}`)
      .join("\n\n");

    try {
      const response = await fetch("/api/summarize-and-update-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileContents, currentOffer }),
      });

      if (!response.ok) {
        throw new Error("Failed to summarize and update offer");
      }

      const data = await response.json();
      onAutoGenerate(data.updatedOffer);
      setUploadedFiles([]);
    } catch {
      toast({
        title: "Error",
        description: "Failed to auto-generate offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => document.getElementById("fileUpload")?.click()}
              variant="outline"
              className="w-1/2"
              disabled={isGenerating}
            >
              <Upload className="mr-2 h-4 w-4" /> Upload Files
            </Button>
            <input
              id="fileUpload"
              type="file"
              multiple
              accept=".txt,.html"
              className="hidden"
              onChange={handleFileUpload}
              disabled={isGenerating}
            />
            <Button
              onClick={handleAutoGenerateOffer}
              className="w-1/2"
              disabled={isGenerating || uploadedFiles.length === 0}
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                "Auto Generate"
              )}
            </Button>
          </div>
          {uploadedFiles.length > 0 && (
            <div className="mt-4">
              <h4 className="font-semibold mb-2">Uploaded Files:</h4>
              <ul className="list-disc pl-5">
                {uploadedFiles.map((file) => (
                  <li
                    key={file.name}
                    className="flex items-center justify-between"
                  >
                    <span>{file.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(file.name)}
                      disabled={isGenerating}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
