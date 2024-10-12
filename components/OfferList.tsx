"use client";

import Link from "next/link";
// components/OfferList.tsx
import { Offer } from "../server/db/schema"; // Import the type for offers

interface OfferListProps {
  offers: Offer[]; // Define props to accept offers
}

function OfferList({ offers }: OfferListProps) {
  return (
    <div className="space-y-2">
      {offers.map((offer) => (
        <Link href={`/offers/${offer.id}`} key={offer.id} className="block">
          <div className="flex items-center p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors border border-border">
            <div className="flex-1 flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-semibold">{offer.clientName}</span>
                <span className="mx-2">•</span> {/* Dot separator */}
                <span className="text-sm text-muted-foreground truncate">
                  {offer.clientAddress || "No address"}
                </span>
              </div>
              {offer.content && (
                <span className="ml-2 px-2 py-1 bg-orange-500 text-white rounded-full text-sm">
                  Generated ⭐️
                </span>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default OfferList;
