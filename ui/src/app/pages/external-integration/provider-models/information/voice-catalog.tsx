import { EmptyState } from '@/app/components/ui/feedback';
import { Pagination } from '@/app/components/ui/primitives';
import { Pause, Play, Search } from '@carbon/icons-react';
import {
  Button,
  CopyButton,
  DataTable,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tag,
} from '@carbon/react';
import {
  ChangeEvent,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

const DEFAULT_PAGE_SIZE = 12;
const VOICE_TABLE_HEADERS = [
  { key: 'name', header: 'Voice' },
  { key: 'languages', header: 'Languages' },
  { key: 'persona', header: 'Persona' },
  { key: 'features', header: 'Use cases' },
  { key: 'voiceId', header: 'Voice ID' },
  { key: 'preview', header: 'Preview' },
];

export interface VoiceCatalogItem {
  title: string;
  voiceId: string;
  description?: string | null;
  previewUrl?: string;
  languages: Array<string | undefined>;
  persona: Array<string | undefined>;
  features: Array<string | undefined>;
}

function MetadataTags({ values }: { values: Array<string | undefined> }) {
  const visibleValues = values.filter((value): value is string =>
    Boolean(value),
  );

  if (visibleValues.length === 0) {
    return (
      <span className="text-sm text-[var(--cds-text-secondary)]">Not set</span>
    );
  }

  const displayedValues = visibleValues.slice(0, 2);
  const remainingCount = visibleValues.length - displayedValues.length;

  return (
    <div className="flex flex-wrap gap-1">
      {displayedValues.map(value => (
        <Tag key={value} size="sm" type="gray">
          {value}
        </Tag>
      ))}
      {remainingCount > 0 && (
        <Tag size="sm" type="outline">
          +{remainingCount}
        </Tag>
      )}
    </div>
  );
}

export function VoiceCatalog(props: {
  voices: VoiceCatalogItem[];
  actions?: ReactNode;
}) {
  const { voices, actions } = props;
  const location = useLocation();
  const queryFromUrl = useMemo(
    () => new URLSearchParams(location.search).get('query') ?? '',
    [location.search],
  );
  const [query, setQuery] = useState(queryFromUrl);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setQuery(queryFromUrl);
    setPage(1);
  }, [queryFromUrl]);

  useEffect(
    () => () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.onended = null;
      audio.onerror = null;
      audio.pause();
      audioRef.current = null;
    },
    [],
  );

  const filteredVoices = useMemo(() => {
    const searchTerm = query.trim().toLocaleLowerCase();
    if (!searchTerm) return voices;

    return voices.filter(voice =>
      [
        voice.title,
        voice.voiceId,
        voice.description,
        ...voice.languages,
        ...voice.persona,
        ...voice.features,
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase()
        .includes(searchTerm),
    );
  }, [query, voices]);

  const firstItemIndex = (page - 1) * pageSize;
  const visibleVoices = filteredVoices.slice(
    firstItemIndex,
    firstItemIndex + pageSize,
  );
  const tableRows = visibleVoices.map((voice, index) => ({
    id: `${firstItemIndex + index}-${voice.voiceId}`,
    name: voice.title,
    languages: voice.languages.filter(Boolean).join(', '),
    persona: voice.persona.filter(Boolean).join(', '),
    features: voice.features.filter(Boolean).join(', '),
    voiceId: voice.voiceId,
    preview: voice.previewUrl ? 'Available' : 'Unavailable',
  }));
  const voiceByRowId = new Map(
    tableRows.map((row, index) => [row.id, visibleVoices[index]]),
  );

  const stopPreview = (audio = audioRef.current) => {
    if (!audio || audioRef.current !== audio) return;
    audio.pause();
    audioRef.current = null;
    setPlayingVoiceId(null);
  };

  const togglePreview = (voice: VoiceCatalogItem) => {
    if (!voice.previewUrl) return;
    if (playingVoiceId === voice.voiceId) {
      stopPreview(audioRef.current);
      return;
    }

    audioRef.current?.pause();
    const audio = new Audio(voice.previewUrl);
    audioRef.current = audio;
    setPlayingVoiceId(voice.voiceId);
    audio.onended = () => stopPreview(audio);
    audio.onerror = () => stopPreview(audio);
    audio.play().catch(() => stopPreview(audio));
  };

  const onSearch = (event: '' | ChangeEvent<HTMLInputElement>, value = '') => {
    setQuery(event === '' ? value : event.target.value);
    setPage(1);
    stopPreview();
  };

  const resultLabel = `${filteredVoices.length} ${
    filteredVoices.length === 1 ? 'voice' : 'voices'
  }`;

  return (
    <section aria-label="Voice catalogue" className="flex flex-1 flex-col">
      <DataTable rows={tableRows} headers={VOICE_TABLE_HEADERS}>
        {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
          <TableContainer
            title="Available voices"
            description={resultLabel}
            className="flex flex-1 flex-col"
          >
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  key={queryFromUrl}
                  defaultValue={queryFromUrl}
                  labelText="Search voices"
                  placeholder="Search by voice, language, or use case"
                  onChange={onSearch}
                  onClear={() => onSearch('', '')}
                />
                {actions}
              </TableToolbarContent>
            </TableToolbar>

            {rows.length > 0 ? (
              <div className="overflow-x-auto">
                <Table
                  {...getTableProps()}
                  data-testid="voice-catalog-table"
                  size="lg"
                  useZebraStyles
                >
                  <TableHead>
                    <TableRow>
                      {headers.map(header => (
                        <TableHeader
                          {...getHeaderProps({ header })}
                          key={header.key}
                        >
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => {
                      const voice = voiceByRowId.get(row.id);
                      if (!voice) return null;

                      return (
                        <TableRow {...getRowProps({ row })} key={row.id}>
                          {row.cells.map(cell => {
                            let content: ReactNode = cell.value;

                            if (cell.info.header === 'name') {
                              content = (
                                <div className="min-w-44 max-w-80">
                                  <p className="font-semibold capitalize text-[var(--cds-text-primary)]">
                                    {voice.title}
                                  </p>
                                  {voice.description && (
                                    <p className="mt-1 line-clamp-2 text-xs leading-4 text-[var(--cds-text-secondary)]">
                                      {voice.description}
                                    </p>
                                  )}
                                </div>
                              );
                            }

                            if (cell.info.header === 'languages') {
                              content = (
                                <MetadataTags values={voice.languages} />
                              );
                            }

                            if (cell.info.header === 'persona') {
                              content = <MetadataTags values={voice.persona} />;
                            }

                            if (cell.info.header === 'features') {
                              content = (
                                <MetadataTags values={voice.features} />
                              );
                            }

                            if (cell.info.header === 'voiceId') {
                              content = (
                                <div className="flex min-w-52 items-center justify-between gap-2">
                                  <code className="truncate text-xs text-[var(--cds-text-primary)]">
                                    {voice.voiceId}
                                  </code>
                                  <CopyButton
                                    align="left"
                                    size="sm"
                                    feedback="Copied"
                                    iconDescription={`Copy ${voice.title} voice ID`}
                                    onClick={() =>
                                      navigator.clipboard?.writeText(
                                        voice.voiceId,
                                      )
                                    }
                                  />
                                </div>
                              );
                            }

                            if (cell.info.header === 'preview') {
                              content = voice.previewUrl ? (
                                <Button
                                  hasIconOnly
                                  kind="ghost"
                                  size="sm"
                                  renderIcon={
                                    playingVoiceId === voice.voiceId
                                      ? Pause
                                      : Play
                                  }
                                  iconDescription={
                                    playingVoiceId === voice.voiceId
                                      ? `Pause ${voice.title}`
                                      : `Preview ${voice.title}`
                                  }
                                  tooltipPosition="left"
                                  onClick={() => togglePreview(voice)}
                                />
                              ) : (
                                <span className="text-sm text-[var(--cds-text-secondary)]">
                                  Not available
                                </span>
                              );
                            }

                            return (
                              <TableCell key={cell.id}>{content}</TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <EmptyState
                icon={Search}
                title="No voices found"
                subtitle="Try a different voice name, ID, language, or use case."
              />
            )}

            {filteredVoices.length > pageSize && (
              <Pagination
                className="mt-auto border-t border-[var(--cds-border-subtle-01)]"
                id="voice-catalog-pagination"
                totalItems={filteredVoices.length}
                page={page}
                pageSize={pageSize}
                pageSizes={[12, 24, 48]}
                onChange={next => {
                  setPage(next.page);
                  setPageSize(next.pageSize);
                  stopPreview();
                }}
              />
            )}
          </TableContainer>
        )}
      </DataTable>
    </section>
  );
}
