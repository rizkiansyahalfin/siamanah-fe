import { useState } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";

export function CreateCampaignPage() {
  const [story, setStory] = useState("");

  const handleSubmit = () => {
    console.log("Story HTML:", story);
    // kirim ke backend
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Buat Campaign
      </h1>

      <RichTextEditor
        value={story}
        onChange={setStory}
      />

      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        Submit
      </button>
    </div>
  );
}