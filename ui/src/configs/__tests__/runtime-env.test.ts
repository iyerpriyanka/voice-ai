import { getRuntimeEnv } from '@/configs/runtime-env';

describe('runtime environment', () => {
  const originalEnv = process.env;
  const setEnv = (key: string, value?: string) => {
    const env = process.env as Record<string, string | undefined>;
    if (value === undefined) {
      delete env[key];
    } else {
      env[key] = value;
    }
  };

  beforeEach(() => {
    process.env = { ...originalEnv };
    setEnv('MODE');
    setEnv('NODE_ENV');
    setEnv('REACT_APP_GA_MEASUREMENT_ID');
    setEnv('VITE_GA_MEASUREMENT_ID');
    setEnv('VITE_MODE');
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('reads CRA environment variables', () => {
    setEnv('NODE_ENV', 'production');
    setEnv('REACT_APP_GA_MEASUREMENT_ID', ' G-CRA ');

    expect(getRuntimeEnv()).toEqual({
      mode: 'production',
      gaMeasurementId: 'G-CRA',
    });
  });

  it('prefers Vite environment variable names when present', () => {
    setEnv('NODE_ENV', 'development');
    setEnv('MODE', 'test');
    setEnv('VITE_MODE', 'production');
    setEnv('REACT_APP_GA_MEASUREMENT_ID', 'G-CRA');
    setEnv('VITE_GA_MEASUREMENT_ID', 'G-VITE');

    expect(getRuntimeEnv()).toEqual({
      mode: 'production',
      gaMeasurementId: 'G-VITE',
    });
  });
});
