import { useEffect } from 'react';
import ReactGA from 'react-ga4';
import { useLocation } from 'react-router-dom';
import { getRuntimeEnv } from '@/configs/runtime-env';

const DEFAULT_MEASUREMENT_ID = 'G-SFF58VVY7H';
const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

interface GoogleAnalyticsProps {
  env?: string;
  hostname?: string;
  measurementId?: string;
}

interface AnalyticsLocation {
  pathname: string;
  search?: string;
}

const initializedMeasurementIds = new Set<string>();

export const getAnalyticsPagePath = (location: AnalyticsLocation) =>
  `${location.pathname}${location.search ?? ''}`;

export const isGoogleAnalyticsEnabled = ({
  env = getRuntimeEnv().mode,
  hostname = window.location.hostname,
  measurementId = getRuntimeEnv().gaMeasurementId ?? DEFAULT_MEASUREMENT_ID,
}: GoogleAnalyticsProps = {}) =>
  env === 'production' &&
  Boolean(measurementId.trim()) &&
  !LOCAL_HOSTNAMES.has(hostname);

const initializeGoogleAnalytics = (measurementId: string) => {
  if (initializedMeasurementIds.has(measurementId)) return;
  ReactGA.initialize(measurementId);
  initializedMeasurementIds.add(measurementId);
};

export function GA({ env, hostname, measurementId }: GoogleAnalyticsProps) {
  const location = useLocation();

  useEffect(() => {
    const trackingId = (
      measurementId ??
      getRuntimeEnv().gaMeasurementId ??
      DEFAULT_MEASUREMENT_ID
    ).trim();
    if (
      !isGoogleAnalyticsEnabled({ env, hostname, measurementId: trackingId })
    ) {
      return;
    }

    initializeGoogleAnalytics(trackingId);
    ReactGA.send({ hitType: 'pageview', page: getAnalyticsPagePath(location) });
  }, [env, hostname, location, measurementId]);

  return null;
}
