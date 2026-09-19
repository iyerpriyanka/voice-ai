import { LineLoader } from '@/app/components/ui/loaders/line-loader';
import { PageLoader } from '@/app/components/ui/loaders/page-loader';
import { useRapidaStore } from '@/hooks';

/**
 * General global loader
 * @returns
 */
export function Loader() {
  const { loadingType } = useRapidaStore();
  return loadingType === 'overlay' ? <PageLoader /> : <LineLoader />;
}
