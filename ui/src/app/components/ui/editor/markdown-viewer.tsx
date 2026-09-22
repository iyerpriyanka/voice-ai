import type { HTMLAttributes } from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';
import { cn } from '@/utils';

interface MarkdownViewerProps extends HTMLAttributes<HTMLDivElement> {
  text?: string;
  editorClassName?: string;
}

export function MarkdownViewer({
  text,
  className,
  editorClassName,
}: MarkdownViewerProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between group overflow-auto max-h-full w-full p-4 bg-white dark:bg-gray-950',
        className,
      )}
    >
      <MarkdownPreview
        source={text?.replaceAll('\n', '\n\n')}
        className={cn(
          'markdown-editor',
          'prose prose-gray prose-lg dark:prose-invert break-words max-w-none! prose-img:rounded-xl prose-headings:underline prose-a:text-blue-600',
          'prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose dark:prose-invert prose-p:leading-normal prose-pre:p-0 prose-ol:leading-normal prose-ul:leading-normal prose-li:my-1 max-w-full break-words text-base! md:text-lg! text-neutral-700! dark:text-neutral-400! bg-transparent! w-full',
          editorClassName,
        )}
        style={{
          background: 'transparent',
          overflowWrap: 'break-word',
          wordBreak: 'break-word',
          maxWidth: '100%',
        }}
      />
    </div>
  );
}
