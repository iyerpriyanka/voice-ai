import { Helmet as HM } from 'react-helmet-async';
import { useTheme } from '@/theme/theme-provider';

interface HelmetMeta {
  name: string;
  content: string;
}

interface HelmetProps {
  title?: string;
  meta?: HelmetMeta[];
}

export function Helmet({ title, meta = [] }: HelmetProps) {
  const { theme } = useTheme();
  const pageTitle = title?.trim();
  const documentTitle = pageTitle
    ? `${pageTitle} - ${theme.brand.name}`
    : theme.brand.name;

  return (
    <HM>
      <title>{documentTitle}</title>
      <meta name="application-name" content={theme.brand.name} />
      {meta.map(item => (
        <meta
          key={`${item.name}:${item.content}`}
          name={item.name}
          content={item.content}
        />
      ))}
    </HM>
  );
}
