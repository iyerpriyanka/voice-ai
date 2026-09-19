import { LineLoader } from '@/app/components/ui/feedback/loaders/line-loader';
import { PageLoader } from '@/app/components/ui/feedback/loaders/page-loader';
import { useRapidaStore } from '@/hooks';

/**
 * General global loader
 * @returns
 */
export function Loader() {
  const { loadingType } = useRapidaStore();
  return loadingType === 'overlay' ? <PageLoader /> : <LineLoader />;
}
