import { useEffect, useState } from 'react';
import { KeyValueTable } from './key-value-table';
import type { KeyValueRow } from './key-value-table';

interface ApiHeaderProps {
  inputClass?: string;
  headers: KeyValueRow[];
  setHeaders: (headers: KeyValueRow[]) => void;
}

interface ApiStringHeaderProps {
  inputClass?: string;
  headerValue?: string;
  setHeaderValue: (value: string) => void;
}

export function ApiHeader({ headers, setHeaders }: ApiHeaderProps) {
  return (
    <KeyValueTable
      addButtonLabel="Add header"
      emptyLabel="headers"
      keyInputPrefix="api-header-key"
      rows={headers}
      valueInputPrefix="api-header-val"
      onChange={setHeaders}
    />
  );
}

export function ApiStringHeader({
  headerValue = '{}',
  setHeaderValue,
}: ApiStringHeaderProps) {
  const [headers, setHeaders] = useState<KeyValueRow[]>([
    { key: '', value: '' },
  ]);

  useEffect(() => {
    try {
      const parsedHeaders = JSON.parse(headerValue);
      if (
        !parsedHeaders ||
        typeof parsedHeaders !== 'object' ||
        Array.isArray(parsedHeaders)
      ) {
        setHeaders([{ key: '', value: '' }]);
        return;
      }

      const headerArray = Object.entries(parsedHeaders).map(([key, value]) => ({
        key,
        value: String(value),
      }));
      setHeaders(
        headerArray.length > 0 ? headerArray : [{ key: '', value: '' }],
      );
    } catch {
      setHeaders([{ key: '', value: '' }]);
    }
  }, [headerValue]);

  const handleSetHeaders = (updatedHeaders: KeyValueRow[]) => {
    setHeaders(updatedHeaders);
    const headersObject = updatedHeaders.reduce(
      (acc, header) => {
        const key = header.key.trim();
        if (key) {
          acc[key] = header.value;
        }
        return acc;
      },
      {} as Record<string, string>,
    );
    setHeaderValue(JSON.stringify(headersObject));
  };

  return <ApiHeader headers={headers} setHeaders={handleSetHeaders} />;
}

export const APiHeader = ApiHeader;
export const APiStringHeader = ApiStringHeader;
