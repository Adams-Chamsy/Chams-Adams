import Image from 'next/image';

/**
 * Rendu minimal d'un document Tiptap JSON côté serveur.
 * Supporte : paragraph, heading (h2, h3), blockquote, bulletList, orderedList,
 * listItem, image, link, bold, italic, hardBreak.
 *
 * On évite @tiptap/html (nécessite jsdom) en faisant un walker custom.
 */

type Node = {
  type: string;
  attrs?: Record<string, any>;
  content?: Node[];
  text?: string;
  marks?: { type: string; attrs?: Record<string, any> }[];
};

function renderMarks(
  text: string,
  marks: Node['marks'],
  keyPrefix: string
): React.ReactNode {
  if (!marks || marks.length === 0) return text;

  return marks.reduceRight<React.ReactNode>((child, mark, idx) => {
    const k = `${keyPrefix}-${idx}`;
    switch (mark.type) {
      case 'bold':
        return (
          <strong key={k} className="text-ivoire">
            {child}
          </strong>
        );
      case 'italic':
        return (
          <em key={k} className="italic text-ivoire/95">
            {child}
          </em>
        );
      case 'link': {
        const href = (mark.attrs?.href as string) ?? '#';
        const external = /^https?:\/\//.test(href);
        return (
          <a
            key={k}
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
            className="text-or underline decoration-1 underline-offset-4 transition-colors duration-300 hover:text-ivoire"
          >
            {child}
          </a>
        );
      }
      default:
        return <span key={k}>{child}</span>;
    }
  }, text);
}

function renderNode(node: Node, key: string): React.ReactNode {
  switch (node.type) {
    case 'doc':
      return (
        <>
          {(node.content ?? []).map((child, i) => renderNode(child, `${key}-${i}`))}
        </>
      );

    case 'paragraph':
      return (
        <p key={key} className="my-5 font-serif text-lg leading-[1.8] text-ivoire/80">
          {(node.content ?? []).map((c, i) => renderNode(c, `${key}-${i}`))}
        </p>
      );

    case 'heading': {
      const level = (node.attrs?.level as number) ?? 2;
      const className =
        level === 2
          ? 'mt-14 mb-5 font-serif text-3xl font-light text-ivoire md:text-4xl'
          : 'mt-10 mb-4 font-serif text-2xl font-light text-ivoire';
      const children = (node.content ?? []).map((c, i) =>
        renderNode(c, `${key}-${i}`)
      );
      if (level === 3)
        return (
          <h3 key={key} className={className}>
            {children}
          </h3>
        );
      return (
        <h2 key={key} className={className}>
          {children}
        </h2>
      );
    }

    case 'blockquote':
      return (
        <blockquote
          key={key}
          className="my-8 border-l-2 border-or/50 pl-6 font-serif italic text-ivoire/80 text-xl leading-relaxed"
        >
          {(node.content ?? []).map((c, i) => renderNode(c, `${key}-${i}`))}
        </blockquote>
      );

    case 'bulletList':
      return (
        <ul key={key} className="my-5 ml-5 list-disc font-serif text-lg leading-[1.7] text-ivoire/80">
          {(node.content ?? []).map((c, i) => renderNode(c, `${key}-${i}`))}
        </ul>
      );

    case 'orderedList':
      return (
        <ol key={key} className="my-5 ml-5 list-decimal font-serif text-lg leading-[1.7] text-ivoire/80">
          {(node.content ?? []).map((c, i) => renderNode(c, `${key}-${i}`))}
        </ol>
      );

    case 'listItem':
      return (
        <li key={key} className="my-2">
          {(node.content ?? []).map((c, i) => renderNode(c, `${key}-${i}`))}
        </li>
      );

    case 'image': {
      const src = (node.attrs?.src as string) ?? '';
      const alt = (node.attrs?.alt as string) ?? '';
      if (!src) return null;
      return (
        <figure key={key} className="my-12">
          <div className="relative aspect-[4/5] w-full overflow-hidden bg-noir-800">
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 90vw, 720px"
              className="object-cover"
            />
          </div>
        </figure>
      );
    }

    case 'hardBreak':
      return <br key={key} />;

    case 'text':
      return renderMarks(node.text ?? '', node.marks, key);

    default:
      return null;
  }
}

export function TiptapBody({ value }: { value: unknown }) {
  if (!value || typeof value !== 'object') return null;
  return <>{renderNode(value as Node, 'root')}</>;
}
