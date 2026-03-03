import { ArrowUp } from "lucide-react";

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="
        fixed
        bottom-6
        right-6
        bg-blue-500
        text-white
        p-3
        rounded-full
        shadow-lg
        hover:bg-blue-600
      "
    >
      <ArrowUp size={20} />
    </button>
  );
}

