import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import { VoiceCatalog, VoiceCatalogItem } from './voice-catalog';

jest.mock('@/app/components/ui/primitives/pagination', () => ({
  Pagination: ({ onChange, page, pageSize, totalItems }: any) => (
    <button
      type="button"
      onClick={() => onChange({ page: page + 1, pageSize })}
    >
      Next page ({totalItems})
    </button>
  ),
}));

jest.mock('@/app/components/ui/feedback', () => ({
  EmptyState: ({ title, subtitle }: any) => (
    <section>
      <h2>{title}</h2>
      <p>{subtitle}</p>
    </section>
  ),
}));

const voices: VoiceCatalogItem[] = Array.from({ length: 15 }, (_, index) => ({
  title: `Voice ${index + 1}`,
  voiceId: `voice-${index + 1}`,
  languages: index === 14 ? ['Spanish'] : ['English'],
  persona: [],
  features: index === 14 ? ['Sales'] : ['Support'],
  previewUrl: `https://example.test/voice-${index + 1}.mp3`,
}));

describe('VoiceCatalog', () => {
  const writeText = jest.fn();
  const audioInstances: Array<{
    pause: jest.Mock;
    play: jest.Mock;
    onended: null | (() => void);
    onerror: null | (() => void);
  }> = [];
  const OriginalAudio = window.Audio;

  beforeEach(() => {
    audioInstances.length = 0;
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    window.Audio = jest.fn().mockImplementation(() => {
      const audio = {
        pause: jest.fn(),
        play: jest.fn().mockResolvedValue(undefined),
        onended: null,
        onerror: null,
      };
      audioInstances.push(audio);
      return audio;
    }) as any;
  });

  afterEach(() => {
    window.Audio = OriginalAudio;
    jest.clearAllMocks();
  });

  it('shows a bounded Carbon table and lets users reach remaining voices', () => {
    render(
      <MemoryRouter>
        <VoiceCatalog voices={voices} />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('voice-catalog-table')).toBeInTheDocument();
    expect(screen.getAllByRole('row')).toHaveLength(13);
    expect(screen.getByText('15 voices')).toBeInTheDocument();
    expect(screen.queryByText('Voice 15')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Next page (15)' }));

    expect(screen.getAllByRole('row')).toHaveLength(4);
    expect(screen.getByText('Voice 15')).toBeInTheDocument();
  });

  it('uses the Carbon auto-expanding toolbar search pattern', () => {
    render(
      <MemoryRouter>
        <VoiceCatalog voices={voices} />
      </MemoryRouter>,
    );

    const search = screen.getByRole('searchbox', { name: 'Search voices' });
    const searchContainer = search.closest(
      '.cds--toolbar-search-container-expandable',
    );

    expect(searchContainer).toHaveClass(
      'cds--toolbar-search-container-expandable',
    );
    expect(searchContainer).not.toHaveClass(
      'cds--toolbar-search-container-active',
    );

    fireEvent.focus(search);
    expect(searchContainer).toHaveClass('cds--toolbar-search-container-active');

    fireEvent.blur(search);
    expect(searchContainer).not.toHaveClass(
      'cds--toolbar-search-container-active',
    );
  });

  it('filters voice metadata from the URL and reports an empty result', () => {
    render(
      <MemoryRouter initialEntries={['/integration/models/test?query=spanish']}>
        <VoiceCatalog voices={voices} />
      </MemoryRouter>,
    );

    expect(screen.getByText('Voice 15')).toBeInTheDocument();
    expect(screen.queryByText('Voice 1')).not.toBeInTheDocument();
    expect(screen.getByText('1 voice')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('searchbox', { name: 'Search voices' }), {
      target: { value: 'not-found' },
    });

    expect(screen.getByText('No voices found')).toBeInTheDocument();
  });

  it('creates audio only on demand and stops the previous preview', () => {
    render(
      <MemoryRouter>
        <VoiceCatalog voices={voices.slice(0, 2)} />
      </MemoryRouter>,
    );

    expect(window.Audio).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: 'Preview Voice 1' }));
    expect(window.Audio).toHaveBeenCalledTimes(1);
    expect(audioInstances[0].play).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Preview Voice 2' }));
    expect(audioInstances[0].pause).toHaveBeenCalledTimes(1);
    expect(window.Audio).toHaveBeenCalledTimes(2);
    expect(audioInstances[1].play).toHaveBeenCalledTimes(1);
  });

  it('copies a voice ID from the Carbon table action', () => {
    render(
      <MemoryRouter>
        <VoiceCatalog voices={voices.slice(0, 1)} />
      </MemoryRouter>,
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'Copy Voice 1 voice ID' }),
    );

    expect(writeText).toHaveBeenCalledWith('voice-1');
  });

  it('ignores a stale failure after a newer preview starts', async () => {
    let rejectFirstPreview: (() => void) | undefined;
    (window.Audio as unknown as jest.Mock)
      .mockImplementationOnce(() => {
        const audio = {
          pause: jest.fn(),
          play: jest.fn(
            () =>
              new Promise<void>((_resolve, reject) => {
                rejectFirstPreview = () => reject(new Error('stale failure'));
              }),
          ),
          onended: null,
          onerror: null,
        };
        audioInstances.push(audio);
        return audio;
      })
      .mockImplementationOnce(() => {
        const audio = {
          pause: jest.fn(),
          play: jest.fn().mockResolvedValue(undefined),
          onended: null,
          onerror: null,
        };
        audioInstances.push(audio);
        return audio;
      });

    render(
      <MemoryRouter>
        <VoiceCatalog voices={voices.slice(0, 2)} />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Preview Voice 1' }));
    fireEvent.click(screen.getByRole('button', { name: 'Preview Voice 2' }));
    rejectFirstPreview?.();
    await Promise.resolve();

    expect(audioInstances[1].pause).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: 'Pause Voice 2' }),
    ).toBeInTheDocument();
  });
});
