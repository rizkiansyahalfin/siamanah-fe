import { OptimizedImage } from "@/components/ui/OptimizedImage";

type StaticCampaignCardProps = {
  title: string;
  image: string;
  category: string;
  collected: number;
  target: number;
};

export function StaticCampaignCard({
  title,
  image,
  category,
  collected,
  target,
}: StaticCampaignCardProps) {
  const percentage = Math.min((collected / target) * 100, 100);

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      {/* IMAGE */}
      <OptimizedImage
        src={image}
        alt={title}
        wrapperClassName="w-full h-48"
        className="w-full h-full object-cover"
        sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 100vw"
      />

      <div className="p-4">
        {/* CATEGORY */}
        <span className="text-sm text-blue-500 font-medium">
          {category}
        </span>

        {/* TITLE */}
        <h3 className="font-semibold text-lg mt-1">
          {title}
        </h3>

        {/* PROGRESS BAR */}
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-sm mt-2">
            Rp {collected.toLocaleString("id-ID")}
            <span className="text-gray-400">
              {" "}
              dari Rp {target.toLocaleString("id-ID")}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

