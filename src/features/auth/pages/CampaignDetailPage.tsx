import DOMPurify from "dompurify";
import { StickyDonateButton } from "@/features/campaigns/components/StickyDonateButton";

export function CampaignDetailPage() {

  // dummy data
  const campaign = {
    title: "Bantu Korban Banjir",
    collected: 3500000,
    target: 10000000,
    story: `
      <h2>Kondisi saat ini</h2>
      <p>Rumah mereka hancur akibat banjir.</p>
      <ul>
        <li>Kehilangan tempat tinggal</li>
        <li>Kehilangan makanan</li>
      </ul>
    `
  };

  const scrollToDonation = () => {
    const el = document.getElementById("donation-form");

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">

      {/* title */}
      <h1 className="text-3xl font-bold mb-4">
        {campaign.title}
      </h1>

      {/* story */}
      <div
        className="prose mb-10"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(campaign.story),
        }}
      />

      {/* donation form dummy */}
      <div
        id="donation-form"
        className="border rounded-xl p-6 mt-10"
      >
        <h2 className="font-bold text-xl mb-2">
          Form Donasi
        </h2>

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Donasi Sekarang
        </button>
      </div>

      {/* sticky button */}
      <StickyDonateButton
        collected={campaign.collected}
        target={campaign.target}
        onClick={scrollToDonation}
      />

    </div>
  );
}