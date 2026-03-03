type StickyDonateButtonProps = {
  collected: number;
  target: number;
  onClick: () => void;
};

export function StickyDonateButton({
  collected,
  target,
  onClick,
}: StickyDonateButtonProps) {
  const safeTarget = target || 0;
  const percent =
    safeTarget > 0
      ? Math.min(Math.round((collected / safeTarget) * 100), 100)
      : 0;

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(value || 0);

  return (
    <div className="sticky-donate-container">
      <div className="sticky-donate-inner">
        {/* progress info */}
        <div className="flex flex-col flex-1">
          <div className="text-xs font-semibold">
            {formatCurrency(collected)}
            <span className="text-gray-500">
              {" "}
              dari {formatCurrency(safeTarget)}
            </span>
          </div>

          {/* progress bar */}
          <div className="w-full h-2 bg-gray-200 rounded-full mt-1">
            <div
              className="h-2 bg-green-600 rounded-full"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        {/* donate button */}
        <button
          type="button"
          onClick={onClick}
          className="bg-green-600 text-white px-5 py-2 rounded-xl font-bold ml-4 shadow-md active:scale-95 transition-transform"
        >
          Donasi
        </button>
      </div>
    </div>
  );
}

