import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MAX_PROMPT_MESSAGE_LENGTH } from '@/configs';
import { ConfigPrompt } from '../config-prompt';

jest.mock('random-words', () => ({
  generate: () => 'stub-word',
}));

jest.mock('@carbon/react', () => {
  const actual = jest.requireActual('@carbon/react');
  return {
    ...actual,
    Button: ({
      children,
      className: _className,
      hasIconOnly: _hasIconOnly,
      iconDescription: _iconDescription,
      kind,
      renderIcon: Icon,
      size: _size,
      ...props
    }: any) => (
      <button type="button" data-design-system-button-kind={kind} {...props}>
        {children}
        {Icon ? <Icon /> : null}
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
    Toggletip: ({ children }: any) => <span>{children}</span>,
    ToggletipButton: ({ children, label }: any) => (
      <button type="button" aria-label={label}>
        {children || label}
      </button>
    ),
    ToggletipContent: ({ children }: any) => <span>{children}</span>,
  };
});

jest.mock('@carbon/icons-react', () => {
  const actual = jest.requireActual('@carbon/icons-react');
  return {
    ...actual,
    Add: () => <svg data-testid="add-message-icon" />,
  };
});

jest.mock(
  '@/app/components/domain/configuration/config-prompt/advanced-prompt-input',
  () => ({
    __esModule: true,
    default: (props: any) => (
      <div
        data-testid="advanced-message-input"
        data-can-delete={String(props.canDelete)}
        data-enable-reserved={String(props.enableReservedVariableSuggestions)}
        data-instance-id={props.instanceId}
        data-type={props.type}
      >
        <button
          type="button"
          onClick={() =>
            props.onChange(
              'Hello {{assistant.name}} and {{customer_name}} {{args.city}}',
            )
          }
        >
          trigger-change
        </button>
        <button
          type="button"
          onClick={() => props.onChange('Hello {{customer_name}}')}
        >
          trigger-change-custom-only
        </button>
        <button type="button" onClick={() => props.onTypeChange('assistant')}>
          trigger-type-change
        </button>
        <button
          type="button"
          disabled={!props.canDelete}
          onClick={props.onDelete}
        >
          trigger-delete
        </button>
      </div>
    ),
  }),
);

jest.mock(
  '@/app/components/domain/configuration/config-prompt/type-of-variable',
  () => ({
    TypeOfVariable: ({ allType, onChange, type }: any) => (
      <select
        aria-label="Variable type"
        value={type}
        onChange={event => onChange(event.target.value)}
      >
        {allType.map((item: string) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    ),
  }),
);

describe('ConfigPrompt', () => {
  const basePrompt = {
    prompt: [{ role: 'system', content: 'You are {{assistant.name}}' }],
    variables: [{ name: 'assistant.name', type: 'text', defaultvalue: '' }],
  };

  it('shows runtime argument hint text when hints are provided', () => {
    render(
      <ConfigPrompt
        existingPrompt={basePrompt}
        showRuntimeReplacementHint
        onChange={() => {}}
      />,
    );

    expect(
      screen.getByRole('button', { name: /Reserved Variables/i }),
    ).toHaveAttribute('data-design-system-button-kind', 'ghost');
    expect(
      screen.getByText(
        /These variables are preserved and replaced at runtime/i,
      ),
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole('button', { name: /Reserved Variables/i }),
    );

    expect(screen.getByText(/Runtime value/i)).toBeInTheDocument();
    expect(
      screen.getAllByText('{{system.current_date}}').length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText('{{assistant.name}}').length).toBeGreaterThan(0);
    expect(screen.getAllByText('{{client.phone}}').length).toBeGreaterThan(0);
    expect(
      screen.getAllByText('{{client.provider_call_id}}').length,
    ).toBeGreaterThan(0);
    expect(screen.queryByText('{{session.mode}}')).not.toBeInTheDocument();
  });

  it('does not show runtime argument hint text when hints are not provided', () => {
    render(<ConfigPrompt existingPrompt={basePrompt} onChange={() => {}} />);

    expect(screen.queryByText(/Reserved Variables/i)).not.toBeInTheDocument();
  });

  it('shows arguments guidance even when template-specific variable list is empty', () => {
    render(
      <ConfigPrompt
        existingPrompt={{
          prompt: [{ role: 'system', content: 'hello' }],
          variables: [],
        }}
        showRuntimeReplacementHint
        onChange={() => {}}
      />,
    );

    expect(screen.getByText('Arguments')).toBeInTheDocument();
    expect(
      screen.getByText(
        /Reserved variables are preserved and replaced at runtime/i,
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/No template-specific variables yet/i),
    ).toBeInTheDocument();
  });

  it('can hide the arguments runtime hint while still showing arguments', () => {
    render(
      <ConfigPrompt
        existingPrompt={basePrompt}
        showRuntimeReplacementHint
        hideArgumentRuntimeHint
        onChange={() => {}}
      />,
    );

    expect(screen.getByText('Arguments')).toBeInTheDocument();
    expect(
      screen.queryByText(/Add only your template-specific variables here/i),
    ).not.toBeInTheDocument();
  });

  it('keeps reserved variables in arguments list with runtime hint enabled', () => {
    const onChange = jest.fn();
    render(
      <ConfigPrompt
        existingPrompt={{
          prompt: [{ role: 'system', content: '' }],
          variables: [],
        }}
        showRuntimeReplacementHint
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'trigger-change' }));

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.variables).toEqual([
      { name: 'assistant.name', type: 'text', defaultvalue: '' },
      { name: 'customer_name', type: 'text', defaultvalue: '' },
      { name: 'args.city', type: 'text', defaultvalue: '' },
    ]);
  });

  it('marks reserved variables with Reserved label in arguments list', () => {
    render(
      <ConfigPrompt
        existingPrompt={{
          prompt: [{ role: 'system', content: '' }],
          variables: [
            { name: 'assistant.name', type: 'text', defaultvalue: '' },
            { name: 'customer_name', type: 'text', defaultvalue: '' },
          ],
        }}
        showRuntimeReplacementHint
        onChange={() => {}}
      />,
    );

    expect(screen.getAllByText('Reserved').length).toBe(1);
  });

  it('removes reserved variables from arguments once removed from prompt content', () => {
    const onChange = jest.fn();
    render(
      <ConfigPrompt
        existingPrompt={{
          prompt: [{ role: 'system', content: '' }],
          variables: [],
        }}
        showRuntimeReplacementHint
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'trigger-change' }));
    fireEvent.click(
      screen.getByRole('button', { name: 'trigger-change-custom-only' }),
    );

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.variables).toEqual([
      { name: 'customer_name', type: 'text', defaultvalue: '' },
    ]);
  });

  it('keeps all extracted variables when runtime hints are disabled', () => {
    const onChange = jest.fn();
    render(
      <ConfigPrompt
        existingPrompt={{
          prompt: [{ role: 'system', content: '' }],
          variables: [],
        }}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'trigger-change' }));

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.variables).toEqual([
      { name: 'assistant.name', type: 'text', defaultvalue: '' },
      { name: 'customer_name', type: 'text', defaultvalue: '' },
      { name: 'args.city', type: 'text', defaultvalue: '' },
    ]);
  });

  it('preserves existing variable configuration when prompt content still references it', () => {
    const onChange = jest.fn();
    render(
      <ConfigPrompt
        existingPrompt={{
          prompt: [{ role: 'system', content: '' }],
          variables: [
            {
              name: 'customer_name',
              type: 'paragraph',
              defaultvalue: 'Existing customer',
            },
          ],
        }}
        onChange={onChange}
      />,
    );

    fireEvent.click(
      screen.getByRole('button', { name: 'trigger-change-custom-only' }),
    );

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.variables).toEqual([
      {
        name: 'customer_name',
        type: 'paragraph',
        defaultvalue: 'Existing customer',
      },
    ]);
  });

  it('updates one prompt message without changing the other messages', () => {
    const onChange = jest.fn();
    render(
      <ConfigPrompt
        existingPrompt={{
          prompt: [
            { role: 'system', content: 'system message' },
            { role: 'user', content: 'user message' },
          ],
          variables: [],
        }}
        onChange={onChange}
      />,
    );

    fireEvent.click(
      screen.getAllByRole('button', { name: 'trigger-change' })[0],
    );

    const lastCall = onChange.mock.calls[onChange.mock.calls.length - 1][0];
    expect(lastCall.prompt).toEqual([
      {
        role: 'system',
        content: 'Hello {{assistant.name}} and {{customer_name}} {{args.city}}',
      },
      { role: 'user', content: 'user message' },
    ]);
  });

  it('adds a new message with the next alternating role', () => {
    const onChange = jest.fn();

    render(
      <ConfigPrompt
        existingPrompt={{
          prompt: [{ role: 'user', content: 'hello' }],
          variables: [],
        }}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add new message' }));

    expect(onChange).toHaveBeenCalledWith({
      prompt: [
        { role: 'user', content: 'hello' },
        { role: 'assistant', content: '' },
      ],
      variables: [],
    });
  });

  it('adds a user message after an assistant message', () => {
    const onChange = jest.fn();

    render(
      <ConfigPrompt
        existingPrompt={{
          prompt: [{ role: 'assistant', content: 'hello' }],
          variables: [],
        }}
        onChange={onChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add new message' }));

    expect(onChange).toHaveBeenCalledWith({
      prompt: [
        { role: 'assistant', content: 'hello' },
        { role: 'user', content: '' },
      ],
      variables: [],
    });
  });

  it('does not show add message after the maximum message count', () => {
    render(
      <ConfigPrompt
        existingPrompt={{
          prompt: Array.from(
            { length: MAX_PROMPT_MESSAGE_LENGTH },
            (_, index) => ({
              role: index % 2 === 0 ? 'user' : 'assistant',
              content: `message ${index}`,
            }),
          ),
          variables: [],
        }}
        onChange={() => {}}
      />,
    );

    expect(
      screen.queryByRole('button', { name: 'Add new message' }),
    ).not.toBeInTheDocument();
  });

  it('updates message role and deletes prompt messages', () => {
    const onChange = jest.fn();

    render(
      <ConfigPrompt
        existingPrompt={{
          prompt: [
            { role: 'user', content: 'hello' },
            { role: 'assistant', content: 'hi' },
          ],
          variables: [],
        }}
        instanceId="prompt"
        enableReservedVariableSuggestions
        onChange={onChange}
      />,
    );

    expect(screen.getAllByTestId('advanced-message-input')[0]).toHaveAttribute(
      'data-instance-id',
      'prompt-user-0',
    );
    expect(screen.getAllByTestId('advanced-message-input')[0]).toHaveAttribute(
      'data-enable-reserved',
      'true',
    );

    fireEvent.click(
      screen.getAllByRole('button', { name: 'trigger-type-change' })[0],
    );
    expect(onChange).toHaveBeenLastCalledWith({
      prompt: [
        { role: 'assistant', content: 'hello' },
        { role: 'assistant', content: 'hi' },
      ],
      variables: [],
    });

    fireEvent.click(
      screen.getAllByRole('button', { name: 'trigger-delete' })[0],
    );
    expect(onChange).toHaveBeenLastCalledWith({
      prompt: [{ role: 'assistant', content: 'hi' }],
      variables: [],
    });
  });

  it('updates argument type and default value', () => {
    const onChange = jest.fn();

    render(
      <ConfigPrompt
        existingPrompt={{
          prompt: [{ role: 'system', content: 'Hello {{customer_name}}' }],
          variables: [
            { name: 'customer_name', type: 'text', defaultvalue: 'Priyanka' },
            { name: 'account_id', type: 'text', defaultvalue: '123' },
          ],
        }}
        onChange={onChange}
      />,
    );

    fireEvent.change(screen.getAllByLabelText('Variable type')[0], {
      target: { value: 'number' },
    });
    expect(onChange).toHaveBeenLastCalledWith({
      prompt: [{ role: 'system', content: 'Hello {{customer_name}}' }],
      variables: [
        { name: 'customer_name', type: 'number', defaultvalue: 'Priyanka' },
        { name: 'account_id', type: 'text', defaultvalue: '123' },
      ],
    });

    fireEvent.change(
      screen.getByPlaceholderText("Default value for 'customer_name'"),
      {
        target: { value: '42' },
      },
    );
    expect(onChange).toHaveBeenLastCalledWith({
      prompt: [{ role: 'system', content: 'Hello {{customer_name}}' }],
      variables: [
        { name: 'customer_name', type: 'text', defaultvalue: '42' },
        { name: 'account_id', type: 'text', defaultvalue: '123' },
      ],
    });
  });

  it('uses the standard add icon for adding a prompt message', () => {
    render(<ConfigPrompt existingPrompt={basePrompt} onChange={() => {}} />);

    expect(screen.getByTestId('add-message-icon')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add new message' }),
    ).toHaveAttribute('data-design-system-button-kind', 'tertiary');
  });
});
