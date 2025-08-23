"use client";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";
import { StarterKit } from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { Superscript } from "@tiptap/extension-superscript";
import { Subscript } from "@tiptap/extension-subscript";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { HeadingButton } from "@/components/tiptap-ui/heading-button";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { ListButton } from "../tiptap-ui/list-button";

export function RichTextEditor({ field }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      Subscript,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg xl:prose-xl dark:prose-invert !w-full !max-w-none",
      },
    },

    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : "<p>Hello,World!</p>",
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="border rounded-lg border-input overflow-hidden dark:bg-input/30">
        {/* Toolbar */}
        <div className="flex flex-wrap gap-1 p-2 border-b">
          {/* Text formatting */}
          <MarkButton type="bold" />
          <MarkButton type="italic" />
          <MarkButton type="strike" />
          <MarkButton type="code" />
          <MarkButton type="underline" />
          <MarkButton type="superscript" />
          <MarkButton type="subscript" />

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Headings */}
          <HeadingButton level={1} />
          <HeadingButton level={2} />
          <HeadingButton level={3} />

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Text alignment */}
          <TextAlignButton align="left" />
          <TextAlignButton align="center" />
          <TextAlignButton align="right" />
          <TextAlignButton align="justify" />

          {/* Divider */}
          <div className="w-px h-6 bg-gray-300 mx-1" />

          {/* Lists */}
          <ListButton type="bulletList" />
          <ListButton type="orderedList" />
          <ListButton type="taskList" />
        </div>

        {/* Editor content */}
        <div className="p-4 ">
          <EditorContent editor={editor} />
        </div>
      </div>
    </EditorContext.Provider>
  );
}
