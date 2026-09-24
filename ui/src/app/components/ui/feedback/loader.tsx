import { LineLoader } from './loaders/line-loader';
import { PageLoader } from './loaders/page-loader';
import { useRapidaStore } from '@/stores/app';

/**
 * General global loader
 * @returns
 */
export function Loader() {
  const { loadingType } = useRapidaStore();
  return loadingType === 'overlay' ? <PageLoader /> : <LineLoader />;
}
