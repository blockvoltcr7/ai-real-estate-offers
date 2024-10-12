"use client";

import React, { useState } from "react";
import OfferList from "./OfferList";
import NewOfferButton from "./NewOfferButton";
import CreateOfferModal from "./CreateOfferModal";
import { Offer } from "../server/db/schema";

interface OfferListSectionProps {
  initialOffers: Offer[];
}

const OfferListSection: React.FC<OfferListSectionProps> = ({
  initialOffers,
}) => {
  const [offers] = useState<Offer[]>(initialOffers);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleNewOfferClick = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <header className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold text-orange-500">AI Offers</h1>
        <NewOfferButton onClick={handleNewOfferClick}>New</NewOfferButton>
      </header>
      <OfferList offers={offers} />
      <CreateOfferModal isVisible={isModalVisible} onClose={handleCloseModal} />
    </div>
  );
};

export default OfferListSection;
