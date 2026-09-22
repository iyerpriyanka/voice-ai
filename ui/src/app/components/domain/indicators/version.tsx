import { useState } from 'react';
import { Checkmark, Copy } from '@carbon/icons-react';
import { IconOnlyButton } from '@/app/components/ui/primitives';

export function VersionIndicator({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);
  const version = `vrsn_${id}`;

  const copyItem = () => {
    setCopied(true);
    void navigator.clipboard.writeText(version);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <span className="inline-flex items-center gap-1">
      <span className="font-mono text-[13px] leading-none">{version}</span>
      <IconOnlyButton
        kind="ghost"
        size="sm"
        renderIcon={copied ? Checkmark : Copy}
        iconDescription={copied ? 'Copied' : 'Copy version'}
        onClick={copyItem}
      />
    </span>
  );
}
