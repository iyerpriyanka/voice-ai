import {
  createFilterChip,
  formatDateFilterValue,
  joinMultiSelectValue,
  parseQuerySearchFilters,
  replaceCurrentToken,
  splitMultiSelectValue,
  type QuerySearchField,
} from '../query-search-model';

const fields: QuerySearchField[] = [
  {
    queryKey: 'status',
    text: 'Status',
    type: 'multi-select',
    items: [
      { id: 'ok', text: 'OK' },
      { id: 'failed', text: 'Failed' },
    ],
  },
  {
    queryKey: 'createdAt',
    text: 'Created at',
    type: 'date',
    logicOptions: [
      { label: 'after', logic: '>' },
      { label: 'before', logic: '<' },
    ],
  },
  {
    queryKey: 'message',
    text: 'Message',
    type: 'string',
  },
];

describe('query search model', () => {
  it('parses quoted values and explicit logic', () => {
    expect(
      parseQuerySearchFilters(
        fields,
        'status:ok createdAt~<:2026-09-19 message:"hello world"',
      ),
    ).toEqual([
      {
        key: 'status',
        label: 'Status',
        logic: '=',
        raw: 'status:ok',
        value: 'ok',
      },
      {
        key: 'createdAt',
        label: 'Created at',
        logic: '<',
        raw: 'createdAt~<:2026-09-19',
        value: '2026-09-19',
      },
      {
        key: 'message',
        label: 'Message',
        logic: '=',
        raw: 'message:"hello world"',
        value: 'hello world',
      },
    ]);
  });

  it('creates raw filter chips with default and non-default logic', () => {
    expect(createFilterChip(fields[1], '>', '2026-09-19')).toMatchObject({
      raw: 'createdAt:2026-09-19',
    });
    expect(createFilterChip(fields[1], '<', '2026-09-19')).toMatchObject({
      raw: 'createdAt~<:2026-09-19',
    });
  });

  it('deduplicates multi-select values while preserving order', () => {
    expect(splitMultiSelectValue('ok, failed, ok')).toEqual(['ok', 'failed']);
    expect(joinMultiSelectValue(['ok', 'failed', 'ok', ''])).toBe('ok,failed');
  });

  it('replaces only the current draft token', () => {
    expect(replaceCurrentToken('status:ok mess', 'message:error')).toBe(
      'status:ok message:error',
    );
    expect(replaceCurrentToken('status:ok ', 'message:error')).toBe(
      'status:ok message:error',
    );
  });

  it('formats raw date filters without timezone conversion', () => {
    expect(
      formatDateFilterValue('2026-09-19', '08:30', true, 'raw', false),
    ).toBe('2026-09-19T08:30');
    expect(
      formatDateFilterValue('2026-09-19', '08:30', false, 'raw', true),
    ).toBe('2026-09-19');
  });
});
