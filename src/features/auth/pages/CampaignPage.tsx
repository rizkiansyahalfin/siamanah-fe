import { StaticCampaignCard } from "@/features/campaigns/components/StaticCampaignCard";
import ScrollToTopButton from "@/components/ScrollToTopButton";



export default function CampaignPage() {

    const campaigns = [
        {
            title: "Bantu Anak Korban Banjir",
            image: "/images/campaign1.jpg",
            category: "Bencana",
            collected: 400000,
            target: 1000000,
        },
        {
            title: "Donasi Pendidikan Anak Yatim",
            image: "/images/campaign2.jpg",
            category: "Pendidikan",
            collected: 750000,
            target: 2000000,
        },
        {
            title: "Bantu Biaya Operasi",
            image: "/images/campaign3.jpg",
            category: "Kesehatan",
            collected: 1200000,
            target: 3000000,
        },
    ];

    return (
        <div className="container mx-auto px-4">

            {/* HERO */}
            <section className="text-center py-12">

                <p className="text-blue-500 font-medium">
                    Ulurkan Kepedulian
                </p>

                <h1 className="text-4xl font-bold mt-2">
                    Jadilah Alasan Mereka Tersenyum Hari Ini
                </h1>

                <p className="text-gray-500 mt-3">
                    Setiap donasi membantu menciptakan harapan baru.
                </p>

            </section>


            {/* GRID */}
            <section className="
                grid
                grid-cols-1
                sm:grid-cols-2
                lg:grid-cols-4
                gap-6
            ">

                {campaigns.map((campaign, index) => (
                    <StaticCampaignCard
                        key={index}
                        {...campaign}
                    />
                ))}

            </section>
            <ScrollToTopButton />

        </div>
        
    );
}
