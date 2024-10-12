"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { useToast } from "@/hooks/use-toast";

interface Offer {
  id: string;
  // Removed name from Offer interface
  content: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateOfferModalProps {
  onClose: () => void;
  isVisible: boolean;
}

export default function CreateOfferModal({
  onClose,
  isVisible,
}: CreateOfferModalProps) {
  // Removed offerName state
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleCreate = async () => {
    if (!clientName.trim() || !clientAddress.trim()) {
      // Updated validation
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post<Offer>("/api/offers", {
        // Removed name from the request
        clientName, // Include client name in the request
        clientAddress, // Include client address in the request
        content: "", // You might want to add a content field in your form if needed
      });

      if (response.status === 201) {
        toast({
          title: "Success",
          description: "Offer created successfully",
        });
        onClose();
        // Redirect to the offer detail page
        router.push(`/offers/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error creating offer:", error);
      toast({
        title: "Error",
        description: "Failed to create offer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isVisible} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Offer</DialogTitle>
        </DialogHeader>
        {/* Removed Input for offerName */}
        <Input
          type="text"
          value={clientName} // New input for client name
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Enter client name"
          className="w-full mb-4"
        />
        <Input
          type="text"
          value={clientAddress} // New input for client address
          onChange={(e) => setClientAddress(e.target.value)}
          placeholder="Enter client address"
          className="w-full mb-4"
        />
        <div className="flex justify-end space-x-2">
          <Button onClick={handleCreate} disabled={isLoading}>
            {isLoading ? "Creating..." : "Create"}
          </Button>
          <Button onClick={onClose} variant="secondary">
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
