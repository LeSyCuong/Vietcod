"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { TextStyle as BaseTextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { useEffect, useState } from "react";
import clsx from "classnames";
import TextAlign from "@tiptap/extension-text-align";
import HardBreak from "@tiptap/extension-hard-break";
import { authAxiosInstance } from "../../utils/axiosInstance";
import { fontMap } from "../../fonts";

type Props = {
  value: string;
  className?: string;
  onChange: (value: string) => void;
};

const TextStyle = BaseTextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontFamily: {
        default: null,
        parseHTML: (element) => element.style.fontFamily,
        renderHTML: (attrs) =>
          attrs.fontFamily ? { style: `font-family:${attrs.fontFamily}` } : {},
      },
    };
  },
});

export default function RichTextEditor({ value, className, onChange }: Props) {
  const [mounted, setMounted] = useState(false);
  const [selectedFont, setSelectedFont] = useState<string>("Arial");

  useEffect(() => setMounted(true), []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // paragraph: true, // ❌ không được
        // nếu muốn custom, dùng object
        paragraph: {
          HTMLAttributes: { class: "my-paragraph" },
        },
        heading: { levels: [1, 2, 3] },
      }),
      HardBreak.extend({
        addKeyboardShortcuts() {
          return {
            Enter: () => this.editor.commands.setHardBreak(), // ⛳ Enter = <br>
          };
        },
      }),

      Underline,
      TextStyle,
      Color,
      Link.configure({ HTMLAttributes: { class: "custom-link" } }),
      Image,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ],

    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),

    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl p-3 focus:outline-none min-h-[150px]",
      },
    },

    autofocus: true,
    editable: true,
    immediatelyRender: false, // 🔥 FIX SSR
  });

  // Sync khi value thay đổi từ ngoài vào
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  if (!mounted || !editor) return <div>Đang tải trình soạn thảo...</div>;

  const Button = ({
    label,
    onClick,
    active,
    style: customStyle,
  }: {
    label: string;
    onClick: () => void;
    active?: boolean;
    style?: React.CSSProperties;
  }) => {
    const style: React.CSSProperties = { ...customStyle };
    if (label === "B") style.fontWeight = "bold";
    if (label === "I") style.fontStyle = "italic";
    if (label === "U") style.textDecoration = "underline";
    if (label === "S") style.textDecoration = "line-through";

    return (
      <button
        type="button"
        onClick={onClick}
        className={clsx(
          "px-2.5 cursor-pointer py-1.5 rounded-md text-sm font-medium transition-all duration-150 border shadow-sm",
          active
            ? "bg-blue-600 text-white border-blue-600"
            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
        )}
        style={style}
      >
        {label}
      </button>
    );
  };

  const handleUploadImageMulti = async (files: FileList) => {
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await authAxiosInstance.post(`/config/upload`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const result = res.data;

        if (result.success && result.filePath) {
          editor.chain().focus().setImage({ src: result.filePath }).run();
        }
      } catch (err) {
        console.error("Upload failed", err);
      }
    }
  };

  const handleFontChange = (font: string) => {
    setSelectedFont(font);
    const fontName = fontMap[font]?.name || font;
    editor.chain().focus().setMark("textStyle", { fontFamily: fontName }).run();
  };

  return (
    <div className={`border border-gray-300 ${className} rounded-md bg-white`}>
      <div className="flex flex-wrap gap-2 p-3 border border-gray-300 bg-gray-50 rounded-t-md">
        <select
          value={selectedFont}
          onChange={(e) => handleFontChange(e.target.value)}
          className="px-2 py-1 border rounded-md text-sm bg-white cursor-pointer"
        >
          {Object.keys(fontMap).map((font) => (
            <option
              key={font}
              value={font}
              className={fontMap[font].className}
              style={{ fontFamily: fontMap[font].name }}
            >
              {font}
            </option>
          ))}
        </select>

        <Button
          label="B"
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
        />
        <Button
          label="I"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
        />
        <Button
          label="U"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
        />
        <Button
          label="S"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
        />

        <input
          type="color"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
          className="w-8 h-8 p-0 border rounded cursor-pointer"
        />

        <Button
          label="🔗 Link"
          onClick={() => {
            const url = prompt("Nhập link:");
            if (url) {
              editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
            }
          }}
        />

        <Button
          label="Unlink"
          onClick={() => editor.chain().focus().unsetLink().run()}
        />

        <label className="px-2.5 cursor-pointer py-1.5 rounded-md text-sm font-medium border border-gray-300 bg-white hover:bg-gray-100">
          Ảnh
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.length) {
                handleUploadImageMulti(e.target.files);
              }
            }}
          />
        </label>

        <Button
          label="Clear"
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
        />
      </div>

      <EditorContent editor={editor} />

      <style jsx global>{`
        a.custom-link {
          font-weight: 600;
          color: #1d4ed8;
          text-decoration: underline;
        }
        a.custom-link:hover {
          color: #2563eb;
        }
      `}</style>
    </div>
  );
}
