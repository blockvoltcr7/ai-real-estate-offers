"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Offer as OfferType } from "@/server/db/schema";
import Chat from "./Chat";
import Offer from "./Offer";
import FileUpload from "./FileUpload";
import { OFFER_MARKDOWN } from "@/lib/constants";
import { Loader2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { marked } from "marked";
import { useToast } from "@/hooks/use-toast";

export default function OfferDetail({ offer }: { offer: OfferType }) {
  const [offerContent, setOfferContent] = useState(
    offer.content || OFFER_MARKDOWN
  );
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isFileUploadLoading, setIsFileUploadLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch("/api/offers", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: offer.id,
          content: offerContent,
          clientName: offer.clientName,
          clientAddress: offer.clientAddress,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save offer");
      }

      toast({
        title: "Offer saved successfully",
        description: "Your changes have been saved.",
      });
    } catch (error) {
      console.error("Error saving offer:", error);
      toast({
        title: "Error saving offer",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - 2 * margin;

      // Parse markdown to HTML
      const htmlContent = await marked(offerContent);

      console.log("htmlContent", htmlContent);
      // Create a temporary element to hold the HTML content
      const tempElement = document.createElement("div");
      tempElement.innerHTML = htmlContent;

      // Function to add text to PDF with word wrap
      const addTextWithWordWrap = (
        text: string,
        x: number,
        y: number,
        maxWidth: number,
        fontSize: number,
        color: string = "#000000"
      ) => {
        pdf.setFontSize(fontSize);
        pdf.setTextColor(color);
        const lines = pdf.splitTextToSize(text, maxWidth);
        pdf.text(lines, x, y);
        return lines.length * fontSize * 0.5;
      };

      // Function to add a section to the PDF
      const addSection = (label: string, content: string, y: number) => {
        pdf.setFontSize(12); // Set font size before calculating labelWidth
        pdf.setTextColor("#f97316"); // Orange color

        const labelWidth = pdf.getTextWidth(label);
        pdf.text(label, margin, y);

        pdf.setTextColor("#000000");
        const contentX = margin + labelWidth + 2; // Adjust spacing here
        const contentHeight = addTextWithWordWrap(
          content,
          contentX,
          y,
          contentWidth - (contentX - margin),
          12
        );
        return Math.max(contentHeight, 15); // Reduced spacing between sections
      };

      // Start adding content to PDF
      let yPosition = margin;

      // Process each child of the temporary element
      Array.from(tempElement.children).forEach((child) => {
        if (child instanceof HTMLElement) {
          if (child.tagName === "P") {
            const strong = child.querySelector("strong");
            if (strong) {
              const label = strong.textContent || "";
              const content =
                child.textContent?.replace(label, "").trim() || "";
              yPosition += addSection(label, content, yPosition);
            } else {
              yPosition += addTextWithWordWrap(
                child.textContent || "",
                margin,
                yPosition,
                contentWidth,
                12
              );
            }
          } else if (child.tagName === "H1") {
            yPosition += 10;
            yPosition += addTextWithWordWrap(
              child.textContent || "",
              margin,
              yPosition,
              contentWidth,
              24,
              "#f97316"
            );
            yPosition += 5;
          } else if (child.tagName === "H2") {
            yPosition += 10;
            yPosition += addTextWithWordWrap(
              child.textContent || "",
              margin,
              yPosition,
              contentWidth,
              20,
              "#f97316"
            );
            yPosition += 5;
          } else if (child.tagName === "H3") {
            yPosition += 10;
            yPosition += addTextWithWordWrap(
              child.textContent || "",
              margin,
              yPosition,
              contentWidth,
              16,
              "#f97316"
            );
            yPosition += 5;
          } else if (child.tagName === "UL") {
            Array.from(child.children).forEach((li) => {
              if (li instanceof HTMLElement) {
                yPosition += 5;
                pdf.setTextColor("#000000");
                pdf.circle(margin + 2, yPosition - 2, 1, "F");
                yPosition += addTextWithWordWrap(
                  li.textContent || "",
                  margin + 10,
                  yPosition,
                  contentWidth - 10,
                  12
                );
              }
            });
          } else {
            yPosition += addTextWithWordWrap(
              child.textContent || "",
              margin,
              yPosition,
              contentWidth,
              12
            );
          }

          // Check if we need to add a new page
          if (yPosition > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
        }
      });

      // Add signature lines
      yPosition += 20;
      pdf.line(margin, yPosition, pageWidth / 2 - 10, yPosition);
      pdf.line(pageWidth / 2 + 10, yPosition, pageWidth - margin, yPosition);
      yPosition += 5;
      pdf.text("Buyer Name", margin, yPosition);
      pdf.text("Seller Name", pageWidth / 2 + 10, yPosition);

      // Save the PDF
      const safeClientName = offer.clientName
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      const safeClientAddress = offer.clientAddress
        .replace(/[^a-z0-9]/gi, "_")
        .toLowerCase();
      const filename = `offer_${safeClientName}_${safeClientAddress}.pdf`;
      pdf.save(filename);

      toast({
        title: "Offer exported successfully",
        description: "Your PDF has been generated and downloaded.",
      });
    } catch (error) {
      console.error("Error exporting offer:", error);
      toast({
        title: "Error exporting offer",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleOfferUpdate = (updatedOffer: string) => {
    setOfferContent(updatedOffer);
  };

  const handleChatLoadingChange = (loading: boolean) => {
    setIsChatLoading(loading);
  };

  const handleFileUploadLoadingChange = (loading: boolean) => {
    setIsFileUploadLoading(loading);
  };

  const isLoading = isChatLoading || isFileUploadLoading;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          {[offer.clientName, offer.clientAddress].join(" - ") ||
            "Untitled Offer"}
        </h1>
        <div>
          <Button onClick={handleSave} className="mr-2" disabled={isSaving}>
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Save
          </Button>
          <Button
            onClick={handleExport}
            variant="outline"
            disabled={isExporting}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-6">
          <Chat
            offerContent={offerContent}
            onOfferUpdate={handleOfferUpdate}
            onLoadingChange={handleChatLoadingChange}
          />

          <FileUpload
            onAutoGenerate={handleOfferUpdate}
            currentOffer={offerContent}
            onLoadingChange={handleFileUploadLoadingChange}
          />
        </div>

        <Offer content={offerContent} isLoading={isLoading} />
      </div>
    </div>
  );
}
