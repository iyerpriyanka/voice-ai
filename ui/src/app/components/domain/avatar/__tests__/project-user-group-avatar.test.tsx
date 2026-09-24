import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProjectUserGroupAvatar } from '../project-user-group-avatar';

jest.mock('@/app/components/ui/primitives', () => ({
  TextImage: ({ name, size }: any) => (
    <span data-size={size}>{name.charAt(0)}</span>
  ),
}));

describe('ProjectUserGroupAvatar', () => {
  it('renders member initials with an accessible group label', () => {
    render(
      <ProjectUserGroupAvatar
        label="Workspace collaborators"
        size={8}
        members={[{ name: 'Priyanka Iyer' }, { name: 'Amara Shah' }]}
      />,
    );

    const group = screen.getByRole('list', {
      name: 'Workspace collaborators',
    });

    expect(within(group).getAllByRole('listitem')).toHaveLength(2);
    expect(
      within(screen.getByLabelText('Priyanka Iyer')).getByText('P'),
    ).toHaveAttribute('data-size', '8');
    expect(screen.getByLabelText('Amara Shah')).toHaveTextContent('A');
  });

  it('renders an empty member list without placeholder content', () => {
    render(<ProjectUserGroupAvatar members={[]} />);

    expect(
      screen.getByRole('list', { name: 'Project members' }),
    ).toBeEmptyDOMElement();
  });
});
