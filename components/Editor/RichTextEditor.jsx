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
// import { HeadingDropdownMenu } from "../tiptap-ui/heading-dropdown-menu";

// import "@/components/tiptap-node/code-block-node/code-block-node.scss";
// import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

export function RichTextEditor() {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Underline,
      Superscript,
      Subscript,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],
  });

  return (
    <EditorContext.Provider value={{ editor }}>
      <div className="flex">
        <MarkButton editor={editor} type="bold" />
        <MarkButton editor={editor} type="italic" />
        <MarkButton editor={editor} type="strike" />
        <MarkButton editor={editor} type="code" />
        <MarkButton editor={editor} type="underline" />
        <MarkButton editor={editor} type="superscript" />
        <MarkButton editor={editor} type="subscript" />
        <HeadingButton editor={editor} level={1} />
        <HeadingButton editor={editor} level={2} />
        <HeadingButton editor={editor} level={3} />
        <TextAlignButton editor={editor} align="left" />
        <TextAlignButton editor={editor} align="center" />
        <TextAlignButton editor={editor} align="right" />
        <TextAlignButton editor={editor} align="justify" />
        <ListButton editor={editor} type="bulletList" />
        <ListButton editor={editor} type="orderedList" />
        <ListButton editor={editor} type="taskList" />
      </div>

      <EditorContent
        editor={editor}
        role="presentation"
        className="border rounded-md "
      />
    </EditorContext.Provider>
  );
}
