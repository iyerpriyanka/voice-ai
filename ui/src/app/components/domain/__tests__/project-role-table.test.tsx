import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectRoleTable } from '../project-role-table';

jest.mock('@carbon/icons-react', () => ({
  Add: () => <svg data-testid="add-icon" />,
  TrashCan: () => <svg data-testid="trash-icon" />,
}));

jest.mock('@carbon/react', () => ({
  Button: ({ iconDescription, onClick }: any) => (
    <button type="button" aria-label={iconDescription} onClick={onClick}>
      {iconDescription}
    </button>
  ),
  Dropdown: ({
    id,
    items,
    itemToString,
    label,
    onChange,
    selectedItem,
  }: any) => (
    <label htmlFor={id}>
      {label}
      <select
        id={id}
        value={selectedItem?.value || ''}
        onChange={event =>
          onChange({
            selectedItem:
              items.find((item: any) => item.value === event.target.value) ||
              null,
          })
        }
      >
        <option value="">{label}</option>
        {items.map((item: any) => (
          <option key={item.value} value={item.value}>
            {itemToString(item)}
          </option>
        ))}
      </select>
    </label>
  ),
  Table: ({ children }: any) => <table>{children}</table>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableCell: ({ children, colSpan }: any) => (
    <td colSpan={colSpan}>{children}</td>
  ),
  TableContainer: ({ children, title }: any) => (
    <section>
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  ),
  TableHead: ({ children }: any) => <thead>{children}</thead>,
  TableHeader: ({ children }: any) => <th>{children}</th>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
}));

jest.mock('@/app/components/ui/primitives', () => ({
  TertiaryButton: ({ children, onClick }: any) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}));

const projectOptions = [
  { name: 'Support operations', value: 'project-1' },
  { name: 'Sales enablement', value: 'project-2' },
];

const roleOptions = [
  { name: 'Admin', value: 'admin' },
  { name: 'Reader', value: 'reader' },
];

describe('ProjectRoleTable', () => {
  it('renders an empty state and adds a default project row', () => {
    const onChange = jest.fn();

    render(
      <ProjectRoleTable
        rows={[]}
        onChange={onChange}
        projectOptions={projectOptions}
        roleOptions={roleOptions}
        defaultProjectId="project-2"
        title="Project roles"
        addButtonLabel="Add role"
      />,
    );

    expect(screen.getByText('Project roles (0)')).toBeInTheDocument();
    expect(screen.getByText(/No project roles yet/)).toHaveTextContent(
      'No project roles yet. Click Add role below.',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add role' }));

    expect(onChange).toHaveBeenCalledWith([
      { projectId: 'project-2', projectRole: '' },
    ]);
  });

  it('updates project and role selections for an existing row', () => {
    const onChange = jest.fn();

    render(
      <ProjectRoleTable
        rows={[{ projectId: 'project-1', projectRole: 'admin' }]}
        onChange={onChange}
        projectOptions={projectOptions}
        roleOptions={roleOptions}
      />,
    );

    fireEvent.change(screen.getByLabelText('Select project'), {
      target: { value: 'project-2' },
    });
    expect(onChange).toHaveBeenLastCalledWith([
      { projectId: 'project-2', projectRole: 'admin' },
    ]);

    fireEvent.change(screen.getByLabelText('Select role'), {
      target: { value: 'reader' },
    });
    expect(onChange).toHaveBeenLastCalledWith([
      { projectId: 'project-1', projectRole: 'reader' },
    ]);
  });

  it('removes rows when the remove column is visible', () => {
    const onChange = jest.fn();

    render(
      <ProjectRoleTable
        rows={[
          { projectId: 'project-1', projectRole: 'admin' },
          { projectId: 'project-2', projectRole: 'reader' },
        ]}
        onChange={onChange}
        projectOptions={projectOptions}
        roleOptions={roleOptions}
      />,
    );

    fireEvent.click(
      screen.getAllByRole('button', {
        name: 'Remove project role',
      })[0],
    );

    expect(onChange).toHaveBeenCalledWith([
      { projectId: 'project-2', projectRole: 'reader' },
    ]);
  });

  it('supports fixed project rows without add or remove actions', () => {
    render(
      <ProjectRoleTable
        rows={[{ projectId: 'project-1', projectRole: 'reader' }]}
        onChange={jest.fn()}
        projectOptions={projectOptions}
        roleOptions={roleOptions}
        showAddButton={false}
        showRemoveColumn={false}
      />,
    );

    expect(
      screen.queryByRole('button', { name: 'Add project role' }),
    ).toBeNull();
    expect(
      screen.queryByRole('button', { name: 'Remove project role' }),
    ).toBeNull();
    expect(screen.queryByText('Actions')).toBeNull();
  });

  it('adds an empty row when no default project or options are available', () => {
    const onChange = jest.fn();

    render(
      <ProjectRoleTable
        rows={[]}
        onChange={onChange}
        projectOptions={[]}
        roleOptions={roleOptions}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add project role' }));

    expect(onChange).toHaveBeenCalledWith([{ projectId: '', projectRole: '' }]);
  });
});
