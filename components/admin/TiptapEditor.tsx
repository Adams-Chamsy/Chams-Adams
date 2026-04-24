'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import LinkExtension from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  List,
  ListOrdered,
  Link as LinkIcon,
  ImagePlus,
  Undo2,
  Redo2,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type Props = {
  name: string;
  initialJson?: unknown;
  placeholder?: string;
};

/**
 * Éditeur Tiptap pour les articles du Journal. Émet le JSON ProseMirror
 * dans un <input type="hidden" name={name}> pour être récupéré par un
 * server action via FormData.
 *
 * - Blocs : paragraphe, h2, h3, blockquote, listes
 * - Marks : bold, italic, link
 * - Images : upload via /admin/api/upload, insertion dans le flux
 */
export function TiptapEditor({ name, initialJson, placeholder }: Props) {
  const [json, setJson] = useState<string>(
    initialJson ? JSON.stringify(initialJson) : ''
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: 'rounded' },
      }),
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer' },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? 'Commencez à écrire…',
      }),
    ],
    content: initialJson ?? '<p></p>',
    editorProps: {
      attributes: {
        class:
          'min-h-[320px] px-4 py-3 font-serif text-lg leading-relaxed text-ivoire outline-none prose-editor',
      },
    },
    onUpdate: ({ editor: e }) => {
      setJson(JSON.stringify(e.getJSON()));
    },
    immediatelyRender: false,
  });

  async function uploadImage(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', 'articles');
      const res = await fetch('/admin/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('upload failed');
      const { url } = (await res.json()) as { url: string };
      editor?.chain().focus().setImage({ src: url }).run();
    } catch (err) {
      console.error(err);
      alert('Échec de l\u2019upload.');
    } finally {
      setUploading(false);
    }
  }

  const handleLink = useCallback(() => {
    if (!editor) return;
    const prev = editor.getAttributes('link').href as string | undefined;
    const url = window.prompt('URL du lien', prev ?? '');
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  if (!editor) return null;

  return (
    <div className="flex flex-col gap-2">
      <ToolbarButton editor={editor} />
      <div className="border border-bronze/40 bg-[#0F0E0C] focus-within:border-or">
        <Toolbar
          editor={editor}
          onImageClick={() => fileInputRef.current?.click()}
          onLinkClick={handleLink}
          uploading={uploading}
        />
        <EditorContent editor={editor} />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadImage(file);
          e.target.value = '';
        }}
      />
      <input type="hidden" name={name} value={json} />
      <style>{`
        .prose-editor h2 { font-family: var(--font-cormorant); font-size: 1.75rem; font-weight: 300; margin-top: 1.8rem; margin-bottom: 0.6rem; }
        .prose-editor h3 { font-family: var(--font-cormorant); font-size: 1.35rem; font-weight: 400; margin-top: 1.3rem; margin-bottom: 0.4rem; }
        .prose-editor p { margin: 0.6rem 0; }
        .prose-editor ul, .prose-editor ol { margin: 0.6rem 0 0.6rem 1.25rem; }
        .prose-editor ul { list-style: disc; }
        .prose-editor ol { list-style: decimal; }
        .prose-editor blockquote { border-left: 2px solid rgba(201,169,97,.5); padding-left: 1rem; margin: 1rem 0; font-style: italic; color: rgba(245,240,230,.8); }
        .prose-editor a { color: #C9A961; text-decoration: underline; text-underline-offset: 3px; }
        .prose-editor img { max-width: 100%; height: auto; margin: 1rem 0; }
        .prose-editor p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          color: rgba(245,240,230,.35);
          font-style: italic;
          pointer-events: none;
          float: left;
          height: 0;
        }
      `}</style>
    </div>
  );
}

function ToolbarButton(_: { editor: Editor }) {
  return null; // placeholder pour future barre sticky
}

function Toolbar({
  editor,
  onImageClick,
  onLinkClick,
  uploading,
}: {
  editor: Editor;
  onImageClick: () => void;
  onLinkClick: () => void;
  uploading: boolean;
}) {
  return (
    <div
      role="toolbar"
      aria-label="Mise en forme"
      className="flex flex-wrap items-center gap-1 border-b border-bronze/20 p-2"
    >
      <IconBtn
        label="Gras"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" aria-hidden />
      </IconBtn>
      <IconBtn
        label="Italique"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" aria-hidden />
      </IconBtn>
      <Sep />
      <IconBtn
        label="Titre 2"
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
      >
        <Heading2 className="h-4 w-4" aria-hidden />
      </IconBtn>
      <IconBtn
        label="Titre 3"
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
      >
        <Heading3 className="h-4 w-4" aria-hidden />
      </IconBtn>
      <Sep />
      <IconBtn
        label="Citation"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-4 w-4" aria-hidden />
      </IconBtn>
      <IconBtn
        label="Liste à puces"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-4 w-4" aria-hidden />
      </IconBtn>
      <IconBtn
        label="Liste numérotée"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-4 w-4" aria-hidden />
      </IconBtn>
      <Sep />
      <IconBtn
        label="Lien"
        active={editor.isActive('link')}
        onClick={onLinkClick}
      >
        <LinkIcon className="h-4 w-4" aria-hidden />
      </IconBtn>
      <IconBtn
        label={uploading ? 'Upload…' : 'Image'}
        disabled={uploading}
        onClick={onImageClick}
      >
        <ImagePlus className="h-4 w-4" aria-hidden />
      </IconBtn>
      <Sep />
      <IconBtn
        label="Annuler"
        onClick={() => editor.chain().focus().undo().run()}
      >
        <Undo2 className="h-4 w-4" aria-hidden />
      </IconBtn>
      <IconBtn
        label="Rétablir"
        onClick={() => editor.chain().focus().redo().run()}
      >
        <Redo2 className="h-4 w-4" aria-hidden />
      </IconBtn>
    </div>
  );
}

function IconBtn({
  children,
  label,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 w-8 items-center justify-center text-ivoire/70 transition-colors duration-200',
        active ? 'bg-or/20 text-or' : 'hover:bg-ivoire/[0.06] hover:text-or',
        disabled && 'cursor-wait opacity-40'
      )}
    >
      {children}
    </button>
  );
}

function Sep() {
  return <span aria-hidden className="mx-1 h-5 w-px bg-bronze/30" />;
}
