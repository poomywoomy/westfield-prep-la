import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import FontFamily from "@tiptap/extension-font-family";
import { Mark, mergeAttributes } from "@tiptap/core";
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  List, ListOrdered, Quote, Link as LinkIcon,
  AlignLeft, AlignCenter, AlignRight,
  Undo, Redo, Highlighter, RemoveFormatting,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useEffect } from "react";

// FontSize mark extension (tiptap doesn't ship one out of the box)
const FontSize = Mark.create({
  name: "fontSize",
  addOptions() { return { types: ["textStyle"] }; },
  addGlobalAttributes() {
    return [{
      types: ["textStyle"],
      attributes: {
        fontSize: {
          default: null,
          parseHTML: (el: HTMLElement) => el.style.fontSize?.replace(/['"]+/g, "") || null,
          renderHTML: (attrs: Record<string, unknown>) => attrs.fontSize ? { style: `font-size: ${attrs.fontSize}` } : {},
        },
      },
    }];
  },
  addCommands() {
    return {
      // @ts-ignore
      setFontSize: (size: string) => ({ chain }: any) => chain().setMark("textStyle", { fontSize: size }).run(),
      // @ts-ignore
      unsetFontSize: () => ({ chain }: any) => chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    } as any;
  },
});

const FONT_SIZES = ["10px", "12px", "14px", "16px", "18px", "20px", "24px", "32px"];
const FONT_FAMILIES = [
  { label: "Sans", value: "Inter, sans-serif" },
  { label: "Serif", value: "Georgia, serif" },
  { label: "Mono", value: "Menlo, monospace" },
  { label: "Arial", value: "Arial, sans-serif" },
  { label: "Times", value: "'Times New Roman', serif" },
];
const COLORS = ["#000000", "#374151", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"];
const HIGHLIGHTS = ["#fef08a", "#fed7aa", "#bbf7d0", "#bfdbfe", "#e9d5ff", "#fbcfe8"];

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function EmailRichTextEditor({ value, onChange, minHeight = "300px" }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Highlight.configure({ multicolor: true }),
      Link.configure({ openOnClick: false, autolink: true }),
      TextStyle,
      Color,
      FontFamily,
      FontSize,
    ],
    content: value,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  if (!editor) return null;

  return (
    <div className="border rounded-md overflow-hidden bg-background">
      <Toolbar editor={editor} />
      <EditorContent
        editor={editor}
        className="prose prose-sm max-w-none p-3 focus:outline-none [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[var(--min-h)]"
        style={{ ["--min-h" as any]: minHeight }}
      />
    </div>
  );
}

function Toolbar({ editor }: { editor: Editor }) {
  const btn = (active: boolean) =>
    `h-8 w-8 p-0 ${active ? "bg-accent text-accent-foreground" : ""}`;

  return (
    <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => editor.chain().focus().undo().run()}><Undo className="h-4 w-4" /></Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => editor.chain().focus().redo().run()}><Redo className="h-4 w-4" /></Button>
      <Separator orientation="vertical" className="h-6 mx-1" />

      <Select value={(editor.getAttributes("textStyle").fontFamily as string) || ""} onValueChange={(v) => v ? editor.chain().focus().setFontFamily(v).run() : editor.chain().focus().unsetFontFamily().run()}>
        <SelectTrigger className="h-8 w-[110px] text-xs"><SelectValue placeholder="Font" /></SelectTrigger>
        <SelectContent>{FONT_FAMILIES.map(f => <SelectItem key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.label}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={(editor.getAttributes("textStyle").fontSize as string) || ""} onValueChange={(v) => (editor.chain().focus() as any).setFontSize(v).run()}>
        <SelectTrigger className="h-8 w-[80px] text-xs"><SelectValue placeholder="Size" /></SelectTrigger>
        <SelectContent>{FONT_SIZES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
      </Select>

      <Separator orientation="vertical" className="h-6 mx-1" />
      <Button variant="ghost" size="sm" className={btn(editor.isActive("bold"))} onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Button>
      <Button variant="ghost" size="sm" className={btn(editor.isActive("italic"))} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Button>
      <Button variant="ghost" size="sm" className={btn(editor.isActive("underline"))} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon className="h-4 w-4" /></Button>
      <Button variant="ghost" size="sm" className={btn(editor.isActive("strike"))} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Text color">
            <span className="h-4 w-4 rounded border" style={{ backgroundColor: (editor.getAttributes("textStyle").color as string) || "#000" }} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-2"><div className="grid grid-cols-9 gap-1">{COLORS.map(c => (
          <button key={c} className="h-6 w-6 rounded border" style={{ backgroundColor: c }} onClick={() => editor.chain().focus().setColor(c).run()} />
        ))}<button className="h-6 w-6 rounded border text-xs" onClick={() => editor.chain().focus().unsetColor().run()}>×</button></div></PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild><Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Highlight"><Highlighter className="h-4 w-4" /></Button></PopoverTrigger>
        <PopoverContent className="w-auto p-2"><div className="grid grid-cols-6 gap-1">{HIGHLIGHTS.map(c => (
          <button key={c} className="h-6 w-6 rounded border" style={{ backgroundColor: c }} onClick={() => editor.chain().focus().toggleHighlight({ color: c }).run()} />
        ))}<button className="h-6 w-6 rounded border text-xs col-span-6" onClick={() => editor.chain().focus().unsetHighlight().run()}>Clear</button></div></PopoverContent>
      </Popover>

      <Separator orientation="vertical" className="h-6 mx-1" />
      <Button variant="ghost" size="sm" className={btn(editor.isActive("bulletList"))} onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></Button>
      <Button variant="ghost" size="sm" className={btn(editor.isActive("orderedList"))} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Button>
      <Button variant="ghost" size="sm" className={btn(editor.isActive("blockquote"))} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></Button>

      <Separator orientation="vertical" className="h-6 mx-1" />
      <Button variant="ghost" size="sm" className={btn(editor.isActive({ textAlign: "left" }))} onClick={() => editor.chain().focus().setTextAlign("left").run()}><AlignLeft className="h-4 w-4" /></Button>
      <Button variant="ghost" size="sm" className={btn(editor.isActive({ textAlign: "center" }))} onClick={() => editor.chain().focus().setTextAlign("center").run()}><AlignCenter className="h-4 w-4" /></Button>
      <Button variant="ghost" size="sm" className={btn(editor.isActive({ textAlign: "right" }))} onClick={() => editor.chain().focus().setTextAlign("right").run()}><AlignRight className="h-4 w-4" /></Button>

      <Separator orientation="vertical" className="h-6 mx-1" />
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={() => {
        const url = prompt("Link URL:"); if (url) editor.chain().focus().setLink({ href: url }).run();
      }}><LinkIcon className="h-4 w-4" /></Button>
      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" title="Clear formatting" onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}><RemoveFormatting className="h-4 w-4" /></Button>
    </div>
  );
}
