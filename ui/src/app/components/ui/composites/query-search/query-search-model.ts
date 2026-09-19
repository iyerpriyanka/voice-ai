export type QuerySearchOption = {
  id: string;
  text: string;
};

export type QuerySearchField = {
  category?: string;
  formatValue?: (value: string) => string;
  items?: QuerySearchOption[];
  logicLabel?: string;
  logicOptions?: QuerySearchLogicOption[];
  queryKey: string;
  text: string;
  type: 'date' | 'multi-select' | 'number' | 'string';
};

export type QuerySearchLogicOption = {
  label: string;
  logic: string;
};

export type QuerySearchDateTimeMode = 'local-to-utc' | 'raw';

export type QuerySearchTab = {
  id: string;
  text: string;
};

export type QuerySearchLabels = {
  allTab: string;
  includeTime: string;
  nextMonth: string;
  previousMonth: string;
  save: string;
  time: string;
};

export type QuerySearchProps = {
  className?: string;
  dateTimeMode?: QuerySearchDateTimeMode;
  fields: QuerySearchField[];
  labels?: Partial<QuerySearchLabels>;
  maxOptions?: number;
  onApply: (value: string) => void;
  onChange: (value: string) => void;
  placeholder?: string;
  preserveDateOnly?: boolean;
  tabs?: QuerySearchTab[];
  timeOptions?: string[];
  value: string;
};

type QueryTokenPart = {
  end: number;
  start: number;
  text: string;
};

export type QueryFilterChip = {
  key: string;
  label: string;
  logic: string;
  raw: string;
  value: string;
};

export type QuerySearchFilter = QueryFilterChip;

const padDatePart = (value: number): string => String(value).padStart(2, '0');

const hasExplicitTimeZone = (value: string): boolean =>
  /(?:z|[+-]\d{2}:?\d{2})$/i.test(value.trim());

const getLocalDateParts = (
  date: Date,
): { dateValue: string; hasTime: boolean; timeValue: string } => ({
  dateValue: [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join('-'),
  hasTime: true,
  timeValue: `${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`,
});

export const getDateInputParts = (
  value: string,
  dateTimeMode: QuerySearchDateTimeMode,
): { dateValue: string; hasTime: boolean; timeValue: string } => {
  const emptyParts = { dateValue: '', hasTime: false, timeValue: '00:00' };
  if (!value) return emptyParts;

  if (dateTimeMode === 'local-to-utc' && hasExplicitTimeZone(value)) {
    const date = new Date(value);
    if (Number.isFinite(date.getTime())) return getLocalDateParts(date);
  }

  const localDateTime = value.match(
    /^(\d{4}-\d{2}-\d{2})(?:[T\s](\d{2}:\d{2})(?::\d{2}(?:\.\d{1,3})?)?)?/,
  );
  if (localDateTime) {
    const hasTime = /^[0-9]{4}-[0-9]{2}-[0-9]{2}[T\s]/.test(value);
    return {
      dateValue: localDateTime[1],
      hasTime,
      timeValue: hasTime ? localDateTime[2] : emptyParts.timeValue,
    };
  }

  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return emptyParts;

  return getLocalDateParts(date);
};

export const formatDateTimeValue = (
  value: string,
  dateTimeMode: QuerySearchDateTimeMode,
): string => {
  const dateParts = getDateInputParts(value, dateTimeMode);
  if (!dateParts.dateValue) return value;
  return dateParts.hasTime
    ? `${dateParts.dateValue} ${dateParts.timeValue}`
    : dateParts.dateValue;
};

export const formatDateValue = (date: Date): string =>
  [
    date.getFullYear(),
    padDatePart(date.getMonth() + 1),
    padDatePart(date.getDate()),
  ].join('-');

export const formatDateFilterValue = (
  dateValue: string,
  timeValue: string,
  includeTime: boolean,
  dateTimeMode: QuerySearchDateTimeMode,
  preserveDateOnly: boolean,
): string => {
  if (!includeTime && preserveDateOnly) return dateValue;

  if (dateTimeMode === 'raw') {
    return includeTime ? `${dateValue}T${timeValue || '00:00'}` : dateValue;
  }

  const [year, month, day] = dateValue.split('-').map(Number);
  if (!year || !month || !day) return dateValue;

  const [hour = 0, minute = 0] = includeTime
    ? (timeValue || '00:00').split(':').map(Number)
    : [];
  return new Date(year, month - 1, day, hour, minute, 0, 0).toISOString();
};

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const getDateFromValue = (value: string): Date | null => {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

export const isSameDateValue = (date: Date, dateValue: string): boolean =>
  formatDateValue(date) === dateValue;

export const getCalendarOffset = (month: Date): number =>
  new Date(month.getFullYear(), month.getMonth(), 1).getDay();

export const getDaysInMonth = (month: Date): number =>
  new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();

export const TIME_OPTIONS = Array.from({ length: 96 }, (_, index) => {
  const minutes = index * 15;
  return `${padDatePart(Math.floor(minutes / 60))}:${padDatePart(minutes % 60)}`;
});

export const DEFAULT_QUERY_SEARCH_LABELS: QuerySearchLabels = {
  allTab: 'All',
  includeTime: 'Include time',
  nextMonth: 'Next month',
  previousMonth: 'Previous month',
  save: 'Save',
  time: 'Time',
};

const QUERY_TOKEN_PATTERN =
  /[^\s:]+:(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\S*)|"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\S+/g;

export const splitQueryParts = (query: string): QueryTokenPart[] =>
  Array.from(query.matchAll(QUERY_TOKEN_PATTERN)).map(match => ({
    end: (match.index || 0) + match[0].length,
    start: match.index || 0,
    text: match[0],
  }));

export const getCurrentTokenRange = (value: string) => {
  const queryParts = splitQueryParts(value);
  const lastPart = queryParts[queryParts.length - 1];
  if (!lastPart || /\s$/.test(value)) {
    return {
      end: value.length,
      start: value.length,
      text: '',
    };
  }
  return lastPart;
};

export const quoteFilterValue = (value: string): string =>
  /\s/.test(value) ? `"${value.replace(/"/g, '\\"')}"` : value;

export const splitMultiSelectValue = (value: string): string[] =>
  Array.from(
    new Set(
      value
        .split(',')
        .map(item => item.trim())
        .filter(Boolean),
    ),
  );

export const joinMultiSelectValue = (values: string[]): string =>
  Array.from(new Set(values.map(value => value.trim()).filter(Boolean))).join(
    ',',
  );

const getOptionText = (field: QuerySearchField, value: string): string =>
  field.items?.find(option => option.id === value)?.text || value;

export const formatMultiSelectDisplayValue = (
  field: QuerySearchField,
  value: string,
): string =>
  splitMultiSelectValue(value)
    .map(selectedValue => getOptionText(field, selectedValue))
    .join(' or ');

export const formatFilterDisplayValue = (
  field: QuerySearchField,
  value: string,
  dateTimeMode: QuerySearchDateTimeMode,
): string => {
  if (field.type === 'date') return formatDateTimeValue(value, dateTimeMode);
  if (field.type === 'multi-select') {
    return formatMultiSelectDisplayValue(field, value);
  }
  return field.formatValue?.(value) || value;
};

export const unquoteFilterValue = (value: string): string => {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
};

export const splitFilterToken = (
  token: string,
): { key: string; logic?: string; value: string } | null => {
  const separatorIndex = token.indexOf(':');
  if (separatorIndex <= 0) return null;
  const keyToken = token.slice(0, separatorIndex);
  const logicIndex = keyToken.indexOf('~');

  return {
    key: logicIndex > 0 ? keyToken.slice(0, logicIndex) : keyToken,
    logic: logicIndex > 0 ? keyToken.slice(logicIndex + 1) : undefined,
    value: token.slice(separatorIndex + 1),
  };
};

export const joinQueryParts = (
  chips: QueryFilterChip[],
  draft: string,
): string =>
  [...chips.map(chip => chip.raw), draft.trim()].filter(Boolean).join(' ');

export const replaceCurrentToken = (
  value: string,
  nextToken: string,
): string => {
  const token = getCurrentTokenRange(value);
  const before = value.slice(0, token.start).trimEnd();
  const after = value.slice(token.end).trimStart();
  return [before, nextToken, after].filter(Boolean).join(' ');
};

export const completeCurrentToken = (
  value: string,
  nextToken: string,
): string => replaceCurrentToken(value, nextToken).trim();

export const getFieldByKey = (
  fields: QuerySearchField[],
  queryKey: string,
): QuerySearchField | undefined =>
  fields.find(field => field.queryKey === queryKey);

export const getSelectedLogic = (
  field: QuerySearchField,
  logic?: string,
): QuerySearchLogicOption =>
  field.logicOptions?.find(option => option.logic === logic) || {
    label: field.logicLabel || 'is',
    logic: field.logicOptions?.[0]?.logic || '=',
  };

export const getFilterRawKey = (
  field: QuerySearchField,
  logic: string,
): string => {
  const defaultLogic = getSelectedLogic(field).logic;
  return logic === defaultLogic ? field.queryKey : `${field.queryKey}~${logic}`;
};

export const matchesOptionSearch = (
  option: QuerySearchOption,
  search: string,
) =>
  option.id.toLowerCase().includes(search) ||
  option.text.toLowerCase().includes(search);

export const parseQueryFilterChip = (
  fields: QuerySearchField[],
  token: string,
): QueryFilterChip | null => {
  const filterToken = splitFilterToken(token);
  if (!filterToken) return null;

  const { key, value: rawValue } = filterToken;
  const field = getFieldByKey(fields, key);
  if (!field) return null;
  const logic = getSelectedLogic(field, filterToken.logic).logic;

  return {
    key,
    label: field.text,
    logic,
    raw: token,
    value: unquoteFilterValue(rawValue),
  };
};

export const parseQuerySearchFilters = (
  fields: QuerySearchField[],
  query: string,
): QuerySearchFilter[] =>
  splitQueryParts(query)
    .map(part => parseQueryFilterChip(fields, part.text))
    .filter((filter): filter is QuerySearchFilter => Boolean(filter));

export const createFilterChip = (
  field: QuerySearchField,
  logic: string,
  value: string,
): QueryFilterChip => ({
  key: field.queryKey,
  label: field.text,
  logic,
  raw: `${getFilterRawKey(field, logic)}:${quoteFilterValue(value)}`,
  value,
});
