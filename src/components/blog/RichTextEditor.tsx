import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Placeholder from "@tiptap/extension-placeholder";
import { 
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Code,
  Heading1, Heading2, Heading3, List, ListOrdered, Quote,
  Link as LinkIcon, Image as ImageIcon, Table as TableIcon,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  Undo, Redo, Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCallback } from "react";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false }),
      Image,
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: "Start writing your blog post..." }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  const addImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  }, [editor]);

  const addLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  }, [editor]);

  const addTable = useCallback(() => {
    if (editor) {
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
    }
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="border-2 border-[hsl(var(--blog-navy))] rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-[hsl(var(--blog-navy))] p-2 flex flex-wrap gap-1 items-center sticky top-0 z-10">
        {/* History */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white"
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white"
        >
          <Redo className="w-4 h-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 bg-white/20" />
        
        {/* Text Formatting */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("bold") ? "bg-[hsl(var(--blog-orange))]" : ""}`}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("italic") ? "bg-[hsl(var(--blog-orange))]" : ""}`}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("underline") ? "bg-[hsl(var(--blog-orange))]" : ""}`}
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("strike") ? "bg-[hsl(var(--blog-orange))]" : ""}`}
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 bg-white/20" />
        
        {/* Headings */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("heading", { level: 1 }) ? "bg-[hsl(var(--blog-orange))]" : ""}`}
        >
          <Heading1 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("heading", { level: 2 }) ? "bg-[hsl(var(--blog-orange))]" : ""}`}
        >
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("heading", { level: 3 }) ? "bg-[hsl(var(--blog-orange))]" : ""}`}
        >
          <Heading3 className="w-4 h-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 bg-white/20" />
        
        {/* Lists & Quote */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("bulletList") ? "bg-[hsl(var(--blog-orange))]" : ""}`}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("orderedList") ? "bg-[hsl(var(--blog-orange))]" : ""}`}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive("blockquote") ? "bg-[hsl(var(--blog-orange))]" : ""}`}
        >
          <Quote className="w-4 h-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 bg-white/20" />
        
        {/* Alignment */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={`text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive({ textAlign: "left" }) ? "bg-[hsl(var(--blog-orange))]" : ""}`}
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={`text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive({ textAlign: "center" }) ? "bg-[hsl(var(--blog-orange))]" : ""}`}
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={`text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white ${editor.isActive({ textAlign: "right" }) ? "bg-[hsl(var(--blog-orange))]" : ""}`}
        >
          <AlignRight className="w-4 h-4" />
        </Button>
        
        <Separator orientation="vertical" className="h-6 bg-white/20" />
        
        {/* Insert Content */}
        <Button
          variant="ghost"
          size="sm"
          onClick={addLink}
          className="text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white"
        >
          <LinkIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={addImage}
          className="text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white"
        >
          <ImageIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={addTable}
          className="text-white hover:bg-[hsl(var(--blog-orange))] hover:text-white"
        >
          <TableIcon className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="prose prose-sm max-w-none p-6 min-h-[500px] focus:outline-none
          [&_.ProseMirror]:outline-none
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:text-[hsl(var(--blog-gray-blue))]
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:content-[attr(data-placeholder)]
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:float-left
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:h-0
          [&_.ProseMirror_p.is-editor-empty:first-child::before]:pointer-events-none
        "
      />
    </div>
  );
};
