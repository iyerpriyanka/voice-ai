import { fireEvent, render, screen } from '@testing-library/react';

import { VoiceCard } from './voice-card';

jest.mock('@/app/components/ui/primitives/button', () => ({
  GhostButton: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button type="button" {...props}>
      {children}
    </button>
  ),
  TertiaryButton: ({ children, ...props }: React.ComponentProps<'button'>) => (
    <button type="button" aria-label="Toggle preview" {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@carbon/icons-react', () => ({
  Checkmark: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="checkmark-icon" />
  ),
  Copy: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="copy-icon" />
  ),
  Pause: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="pause-icon" />
  ),
  Play: ({ className }: { className?: string }) => (
    <svg className={className} data-testid="play-icon" />
  ),
}));

const renderVoiceCard = (previewUrl?: string) =>
  render(
    <VoiceCard
      title="Sarah"
      voiceId="voice-1"
      description="Clear support voice"
      previewUrl={previewUrl}
      languages={['English']}
      persona={['friendly']}
      features={['support']}
    />,
  );

describe('VoiceCard', () => {
  const writeText = jest.fn();

  beforeEach(() => {
    writeText.mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('uses Carbon playback icons for preview playback state', () => {
    const play = jest
      .spyOn(window.HTMLMediaElement.prototype, 'play')
      .mockImplementation(() => Promise.resolve());
    const pause = jest
      .spyOn(window.HTMLMediaElement.prototype, 'pause')
      .mockImplementation(() => {});

    renderVoiceCard('https://example.com/voice.mp3');

    const toggleButton = screen.getByRole('button', { name: 'Toggle preview' });
    expect(screen.getByTestId('play-icon')).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(play).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('pause-icon')).toBeInTheDocument();

    fireEvent.click(toggleButton);

    expect(pause).toHaveBeenCalledTimes(1);
  });

  it('uses Carbon copy state icons when copying the voice id', () => {
    renderVoiceCard('https://example.com/voice.mp3');

    expect(screen.getByTestId('copy-icon')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Copy Voice ID' }));

    expect(writeText).toHaveBeenCalledWith('voice-1');
    expect(screen.getByTestId('checkmark-icon')).toBeInTheDocument();
  });

  it('does not render playback controls when no preview url is available', () => {
    renderVoiceCard();

    expect(
      screen.queryByRole('button', { name: 'Toggle preview' }),
    ).not.toBeInTheDocument();
    expect(screen.getByText('voice-1')).toBeInTheDocument();
    expect(screen.getByTestId('copy-icon')).toBeInTheDocument();
  });
});
