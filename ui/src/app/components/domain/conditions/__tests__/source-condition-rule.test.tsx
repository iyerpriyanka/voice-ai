import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SourceConditionRule } from '../source-condition-rule';

const conditionOptions = [
  { label: 'Equals', value: '=' },
  { label: 'Not equals', value: '!=' },
];

const sourceOptions = [
  { label: 'Phone', value: 'phone' },
  { label: 'Web', value: 'web' },
];

const keyOptions = [
  { label: 'Source', value: 'source' },
  { label: 'Mode', value: 'conversation_mode' },
];

const valueOptionsByKey = {
  source: sourceOptions,
  conversation_mode: [
    { label: 'Voice', value: 'voice' },
    { label: 'Text', value: 'text' },
  ],
};

jest.mock('@carbon/icons-react', () => ({
  Add: () => <svg data-testid="add-icon" />,
  Information: () => <svg data-testid="information-icon" />,
  TrashCan: () => <svg data-testid="trash-icon" />,
}));

jest.mock('@carbon/react', () => ({
  Button: ({
    children,
    className: _className,
    disabled,
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
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Icon ? <Icon /> : null}
      {children}
    </button>
  ),
  Select: ({ children, id, labelText, onChange, value }: any) => (
    <label htmlFor={id}>
      {labelText}
      <select id={id} data-testid={id} value={value} onChange={onChange}>
        {children}
      </select>
    </label>
  ),
  SelectItem: ({ text, value }: any) => <option value={value}>{text}</option>,
  Table: ({ children }: any) => <table>{children}</table>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableCell: ({ children, colSpan }: any) => (
    <td colSpan={colSpan}>{children}</td>
  ),
  TableContainer: ({ children }: any) => <section>{children}</section>,
  TableHead: ({ children }: any) => <thead>{children}</thead>,
  TableHeader: ({ children }: any) => <th>{children}</th>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
  Tooltip: ({ children, label }: any) => (
    <span title={typeof label === 'string' ? label : undefined}>
      {children}
    </span>
  ),
}));

describe('SourceConditionRule', () => {
  it('renders a default row and adds a new default condition', () => {
    const onChangeConditions = jest.fn();

    render(
      <SourceConditionRule
        conditions={[]}
        onChangeConditions={onChangeConditions}
        conditionOptions={conditionOptions}
        sourceOptions={sourceOptions}
      />,
    );

    expect(screen.getByText('Rule')).toBeInTheDocument();
    expect(screen.getByTestId('tool-condition-key')).toHaveValue('source');
    expect(screen.getByTestId('tool-condition-op')).toHaveValue('=');
    expect(screen.getByTestId('tool-condition-source-value')).toHaveValue(
      'phone',
    );
    expect(screen.getByRole('button', { name: 'Remove' })).toBeDisabled();

    fireEvent.click(screen.getByRole('button', { name: 'Add rule' }));

    expect(onChangeConditions).toHaveBeenCalledWith([
      { key: 'source', condition: '=', value: 'phone' },
      { key: 'source', condition: '=', value: 'phone' },
    ]);
  });

  it('updates key, condition, and value while resetting values by key', () => {
    const onChangeConditions = jest.fn();

    render(
      <SourceConditionRule
        conditions={[{ key: 'source', condition: '=', value: 'phone' }]}
        onChangeConditions={onChangeConditions}
        conditionOptions={conditionOptions}
        sourceOptions={sourceOptions}
        keyOptions={keyOptions}
        valueOptionsByKey={valueOptionsByKey}
      />,
    );

    fireEvent.change(screen.getByTestId('tool-condition-key'), {
      target: { value: 'conversation_mode' },
    });
    expect(onChangeConditions).toHaveBeenLastCalledWith([
      { key: 'conversation_mode', condition: '=', value: 'voice' },
    ]);

    fireEvent.change(screen.getByTestId('tool-condition-op'), {
      target: { value: '!=' },
    });
    expect(onChangeConditions).toHaveBeenLastCalledWith([
      { key: 'source', condition: '!=', value: 'phone' },
    ]);

    fireEvent.change(screen.getByTestId('tool-condition-source-value'), {
      target: { value: 'web' },
    });
    expect(onChangeConditions).toHaveBeenLastCalledWith([
      { key: 'source', condition: '=', value: 'web' },
    ]);
  });

  it('removes rows only when more than one row is present', () => {
    const onChangeConditions = jest.fn();

    const { rerender } = render(
      <SourceConditionRule
        conditions={[{ key: 'source', condition: '=', value: 'phone' }]}
        onChangeConditions={onChangeConditions}
        conditionOptions={conditionOptions}
        sourceOptions={sourceOptions}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onChangeConditions).not.toHaveBeenCalled();

    rerender(
      <SourceConditionRule
        conditions={[
          { key: 'source', condition: '=', value: 'phone' },
          { key: 'source', condition: '!=', value: 'web' },
        ]}
        onChangeConditions={onChangeConditions}
        conditionOptions={conditionOptions}
        sourceOptions={sourceOptions}
      />,
    );

    fireEvent.click(screen.getAllByRole('button', { name: 'Remove' })[0]);

    expect(onChangeConditions).toHaveBeenCalledWith([
      { key: 'source', condition: '!=', value: 'web' },
    ]);
  });

  it('falls back when option lists are empty', () => {
    const onChangeConditions = jest.fn();

    render(
      <SourceConditionRule
        conditions={[]}
        onChangeConditions={onChangeConditions}
        conditionOptions={[]}
        sourceOptions={[]}
        keyOptions={[]}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add rule' }));

    expect(onChangeConditions).toHaveBeenCalledWith([
      { key: 'source', condition: '=', value: '' },
      { key: 'source', condition: '=', value: '' },
    ]);
  });

  it('uses an empty value when the selected key has no value options', () => {
    const onChangeConditions = jest.fn();

    render(
      <SourceConditionRule
        conditions={[{ key: 'source', condition: '=', value: 'phone' }]}
        onChangeConditions={onChangeConditions}
        conditionOptions={conditionOptions}
        sourceOptions={sourceOptions}
        keyOptions={[
          { label: 'Source', value: 'source' },
          { label: 'Empty key', value: 'empty' },
        ]}
        valueOptionsByKey={{
          empty: [],
        }}
      />,
    );

    fireEvent.change(screen.getByTestId('tool-condition-key'), {
      target: { value: 'empty' },
    });

    expect(onChangeConditions).toHaveBeenCalledWith([
      { key: 'empty', condition: '=', value: '' },
    ]);
  });
});
