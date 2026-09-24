import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  buildAverageLatencyByMetric,
  getVisibleLatencyTooltipItems,
  LatencyStackChart,
} from '../conversation-telemetry-latency-stack-chart';

jest.mock('@carbon/react', () => ({
  Loading: () => <div role="status">Loading</div>,
}));

jest.mock('recharts', () => ({
  Area: ({ dataKey }: any) => <div data-testid={`area-${dataKey}`} />,
  AreaChart: ({ children, data }: any) => (
    <div data-testid="area-chart" data-count={data.length}>
      {children}
    </div>
  ),
  CartesianGrid: () => <div data-testid="grid" />,
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  Tooltip: ({ content }: any) => (
    <div data-testid="tooltip">
      {content({
        active: true,
        payload: [
          {
            dataKey: 'tts.latency_ms',
            value: 40,
            color: '#7c3aed',
            payload: {
              timeLabel: '2026-01-01 00:00:01.000',
              contextId: 'ctx-1',
            },
          },
          {
            dataKey: 'stt.latency_ms',
            value: 10,
            color: '#fbbf24',
            payload: {
              timeLabel: '2026-01-01 00:00:01.000',
              contextId: 'ctx-1',
            },
          },
        ],
      })}
    </div>
  ),
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
}));

describe('LatencyStackChart', () => {
  it('renders a Carbon loading indicator while loading', () => {
    render(<LatencyStackChart isLoading latencySeries={[]} />);

    expect(screen.getByRole('status')).toHaveTextContent('Loading');
  });

  it('renders an empty state when there are no latency metrics', () => {
    render(<LatencyStackChart isLoading={false} latencySeries={[]} />);

    expect(screen.getByText('No latency metrics found')).toBeInTheDocument();
  });

  it('renders averaged latency summaries and chart series', () => {
    render(
      <LatencyStackChart
        isLoading={false}
        latencySeries={[
          {
            key: 'ctx-1',
            sequence: 1,
            timestampMs: 1000,
            timeLabel: '2026-01-01 00:00:01.000',
            contextId: 'ctx-1',
            conversationId: 'conv-1',
            'stt.latency_ms': 10,
            'eos.latency_ms': 20,
            'agent.ttft_ms': 30,
            'tts.latency_ms': 40,
          },
          {
            key: 'ctx-2',
            sequence: 2,
            timestampMs: 2000,
            timeLabel: '2026-01-01 00:00:02.000',
            contextId: 'ctx-2',
            conversationId: 'conv-1',
            'stt.latency_ms': 20,
            'eos.latency_ms': 40,
            'agent.ttft_ms': 60,
            'tts.latency_ms': 80,
          },
        ]}
      />,
    );

    expect(screen.getByTestId('area-chart')).toHaveAttribute('data-count', '2');
    expect(screen.getByText('STT')).toBeInTheDocument();
    expect(screen.getAllByText('1. STT')).toHaveLength(2);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('60')).toBeInTheDocument();
    expect(screen.getByTestId('area-stt.latency_ms')).toBeInTheDocument();
    expect(screen.getByTestId('area-eos.latency_ms')).toBeInTheDocument();
    expect(screen.getByTestId('area-agent.ttft_ms')).toBeInTheDocument();
    expect(screen.getByTestId('area-tts.latency_ms')).toBeInTheDocument();
    expect(
      screen.getByText('Stack: STT -> EOS -> Agent TTFT -> TTS'),
    ).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('50 ms')).toBeInTheDocument();
  });

  it('orders tooltip items and averages latency values by metric', () => {
    expect(
      getVisibleLatencyTooltipItems(
        [
          { dataKey: 'tts.latency_ms', value: 40 },
          { dataKey: 'stt.latency_ms', value: 10 },
          { dataKey: 'ignored', value: 'not-a-number' },
        ],
        ['stt.latency_ms', 'tts.latency_ms'],
      ).map(item => item.dataKey),
    ).toEqual(['stt.latency_ms', 'tts.latency_ms']);

    expect(
      buildAverageLatencyByMetric(
        [
          {
            key: 'ctx-1',
            sequence: 1,
            timestampMs: 1000,
            timeLabel: 'time-1',
            contextId: 'ctx-1',
            conversationId: 'conv-1',
            'stt.latency_ms': 10,
          },
          {
            key: 'ctx-2',
            sequence: 2,
            timestampMs: 2000,
            timeLabel: 'time-2',
            contextId: 'ctx-2',
            conversationId: 'conv-1',
            'stt.latency_ms': 20,
          },
        ],
        ['stt.latency_ms', 'tts.latency_ms'],
      ),
    ).toEqual({
      'stt.latency_ms': 15,
      'tts.latency_ms': 0,
    });
  });
});
