import { getOffersForCurrentUser } from "../server/queries";
import { Offer } from "../server/db/schema";
import OfferListSection from "@/components/OfferListSection";

export default async function Home() {
  let offers: Offer[] = [];

  try {
    offers = await getOffersForCurrentUser();
  } catch (error) {
    console.error("Error fetching offers:", error);
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-white">
      <OfferListSection initialOffers={offers} />
    </div>
  );
}
