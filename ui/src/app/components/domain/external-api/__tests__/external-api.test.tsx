import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ApiHeader, ApiStringHeader, APiStringHeader } from '../api-header';
import { ApiParameter, APiParameter } from '../api-parameter';

jest.mock('@carbon/icons-react', () => ({
  Add: () => <svg data-testid="add-icon" />,
  TrashCan: () => <svg data-testid="trash-icon" />,
}));

jest.mock('@carbon/react', () => ({
  Button: ({
    children,
    className: _className,
    hasIconOnly: _hasIconOnly,
    iconDescription,
    kind: _kind,
    onClick,
    renderIcon: Icon,
    size: _size,
    ...props
  }: any) => (
    <button
      aria-label={
        iconDescription || (typeof children === 'string' ? children : undefined)
      }
      onClick={onClick}
      {...props}
    >
      {Icon ? <Icon /> : null}
      {children}
    </button>
  ),
  Table: ({ children }: any) => <table>{children}</table>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableCell: ({ children, colSpan }: any) => (
    <td colSpan={colSpan}>{children}</td>
  ),
  TableContainer: ({ children }: any) => <section>{children}</section>,
  TableHead: ({ children }: any) => <thead>{children}</thead>,
  TableHeader: ({ children }: any) => <th>{children}</th>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
}));

jest.mock('@/app/components/ui/primitives/form', () => ({
  TextInput: ({ id, value, onChange, placeholder, labelText }: any) => (
    <label htmlFor={id}>
      {labelText}
      <input
        id={id}
        data-testid={id}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={onChange}
      />
    </label>
  ),
}));

describe('external API key value editors', () => {
  it('edits, adds, and removes header rows', () => {
    const setHeaders = jest.fn();

    render(
      <ApiHeader
        headers={[
          { key: 'Authorization', value: 'Bearer token' },
          { key: 'X-Trace', value: 'trace-id' },
        ]}
        setHeaders={setHeaders}
      />,
    );

    fireEvent.change(screen.getByTestId('api-header-key-0'), {
      target: { value: 'X-Trace' },
    });
    expect(setHeaders).toHaveBeenCalledWith([
      { key: 'X-Trace', value: 'Bearer token' },
      { key: 'X-Trace', value: 'trace-id' },
    ]);

    fireEvent.change(screen.getByTestId('api-header-val-1'), {
      target: { value: 'trace-id-2' },
    });
    expect(setHeaders).toHaveBeenCalledWith([
      { key: 'Authorization', value: 'Bearer token' },
      { key: 'X-Trace', value: 'trace-id-2' },
    ]);

    fireEvent.click(screen.getByRole('button', { name: 'Add header' }));
    expect(setHeaders).toHaveBeenCalledWith([
      { key: 'Authorization', value: 'Bearer token' },
      { key: 'X-Trace', value: 'trace-id' },
      { key: '', value: '' },
    ]);

    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0]);
    expect(setHeaders).toHaveBeenCalledWith([
      { key: 'X-Trace', value: 'trace-id' },
    ]);
  });

  it('serializes valid header JSON and ignores blank keys', async () => {
    const setHeaderValue = jest.fn();

    render(
      <ApiStringHeader
        headerValue='{"Authorization":"Bearer token"}'
        setHeaderValue={setHeaderValue}
      />,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('Authorization')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId('api-header-key-0'), {
      target: { value: '  X-Trace  ' },
    });
    expect(JSON.parse(setHeaderValue.mock.calls.at(-1)?.[0])).toEqual({
      'X-Trace': 'Bearer token',
    });

    fireEvent.change(screen.getByTestId('api-header-key-0'), {
      target: { value: '' },
    });
    expect(JSON.parse(setHeaderValue.mock.calls.at(-1)?.[0])).toEqual({});
  });

  it('falls back to one empty header row for invalid or non-object JSON', async () => {
    const { rerender } = render(
      <APiStringHeader headerValue="not-json" setHeaderValue={jest.fn()} />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('api-header-key-0')).toHaveValue('');
    });

    rerender(<APiStringHeader headerValue="[]" setHeaderValue={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId('api-header-val-0')).toHaveValue('');
    });

    rerender(<APiStringHeader headerValue="{}" setHeaderValue={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId('api-header-key-0')).toHaveValue('');
    });
  });

  it('uses empty JSON when no header value is provided', async () => {
    render(<ApiStringHeader setHeaderValue={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByTestId('api-header-key-0')).toHaveValue('');
    });
  });

  it('edits, adds, and removes parameter rows with the configured label', () => {
    const setParameterValue = jest.fn();

    render(
      <ApiParameter
        initialValues={[]}
        setParameterValue={setParameterValue}
        actionButtonLabel="Add parameter"
      />,
    );

    expect(screen.getByText(/No parameter yet/)).toHaveTextContent(
      'No parameter yet. Click Add parameter below.',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add parameter' }));
    expect(setParameterValue).toHaveBeenCalledWith([{ key: '', value: '' }]);

    render(
      <APiParameter
        initialValues={[{ key: 'body.name', value: 'profile.name' }]}
        setParameterValue={setParameterValue}
      />,
    );

    fireEvent.change(screen.getByTestId('api-param-val-0'), {
      target: { value: 'customer.name' },
    });
    expect(setParameterValue).toHaveBeenCalledWith([
      { key: 'body.name', value: 'customer.name' },
    ]);
  });
});
