import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOfferById } from "@/server/queries"; // Import the new function
import OfferDetail from "@/components/OfferDetail";

export default async function OfferDetailPage({
  params,
}: {
  params: { offerId: string };
}) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const offer = await getOfferById(params.offerId);

  console.log("offer", offer);

  if (!offer) {
    notFound();
  }

  return <OfferDetail offer={offer} />;
}
