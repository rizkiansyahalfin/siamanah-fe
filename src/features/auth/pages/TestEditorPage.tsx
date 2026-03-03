import { useState } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";

export function TestEditorPage() {
  const [story, setStory] = useState("");

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">
        Test Rich Text Editor
      </h1>

      {/* EDITOR */}
      <div>
        <RichTextEditor
          value={story}
          onChange={setStory}
        />
      </div>

      {/* RESULT RAW */}
      <div>
        <h2 className="font-semibold mb-2">
          Raw HTML result:
        </h2>

        <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
          {story}
        </pre>
      </div>

      {/* RESULT RENDER */}
      <div>
        <h2 className="font-semibold mb-2">
          Render result:
        </h2>

        <div
          className="prose max-w-none border p-4 rounded"
          dangerouslySetInnerHTML={{
            __html: story,
          }}
        />
      </div>
    </div>
  );
}