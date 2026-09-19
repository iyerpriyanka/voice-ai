import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { SidebarNavigation } from '@/app/components/layout/navigation/sidebar';
import developmentConfig from '@/configs/config.development.json';
import { ThemeManifest } from '@/theme/types';

const theme = developmentConfig.theme as unknown as ThemeManifest;

let mockOpen = true;
let mockLocked = false;
let mockSetLocked = jest.fn();

jest.mock('@/context/sidebar-context', () => ({
  useSidebar: () => ({
    open: mockOpen,
    locked: mockLocked,
    setOpen: jest.fn(),
    setLocked: mockSetLocked,
  }),
}));

jest.mock('@carbon/react', () => ({
  Button: ({ children, kind, ...props }: any) => (
    <button data-design-system-button-kind={kind} {...props}>
      {children}
    </button>
  ),
}));

jest.mock('@/theme/theme-provider', () => ({
  useTheme: () => {
    const config = jest.requireActual('@/configs/config.development.json');
    return { resolvedMode: 'dark', theme: config.theme };
  },
}));

jest.mock('@/workspace', () => ({
  useWorkspace: () => ({ features: { knowledge: false } }),
}));

jest.mock('@/hooks', () => ({
  useRapidaStore: () => ({ loading: false, loadingType: undefined }),
}));

jest.mock('@/app/components/ui/text', () => ({
  Text: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock('@/app/components/layout/navigation/sidebar/dashboard', () => ({
  Dashboard: () => null,
}));
jest.mock('@/app/components/layout/navigation/sidebar/deployment', () => ({
  Deployment: () => null,
}));
jest.mock('@/app/components/layout/navigation/sidebar/knowledge', () => ({
  Knowledge: () => null,
}));
jest.mock('@/app/components/layout/navigation/sidebar/observability', () => ({
  Observability: () => null,
}));
jest.mock('@/app/components/layout/navigation/sidebar/external-tools', () => ({
  ExternalTool: () => null,
}));
jest.mock('@/app/components/layout/navigation/sidebar/vault', () => ({
  Vault: () => null,
}));
jest.mock('@/app/components/layout/navigation/sidebar/team', () => ({
  Team: () => null,
}));
jest.mock('@/app/components/layout/navigation/sidebar/project', () => ({
  Project: () => null,
}));

describe('sidebar shell', () => {
  beforeEach(() => {
    mockOpen = true;
    mockLocked = false;
    mockSetLocked = jest.fn();
  });

  it('uses the shared shell surface and aligned full logo when expanded', () => {
    const { container } = render(<SidebarNavigation />);

    expect(container.firstChild).toHaveClass(
      'bg-shell',
      'border-border-subtle',
    );
    expect(screen.getByAltText('Rapida AI')).toHaveAttribute(
      'src',
      theme.brand.logos?.full.dark,
    );
    expect(screen.getByAltText('Rapida AI').parentElement).toHaveClass(
      'justify-start',
    );
  });

  it('uses the compact square logo centered in the collapsed rail', () => {
    mockOpen = false;

    render(<SidebarNavigation />);

    expect(screen.getByAltText('Rapida AI')).toHaveAttribute(
      'src',
      theme.brand.logos?.compact.dark,
    );
    expect(screen.getByAltText('Rapida AI')).toHaveClass('h-6', 'w-6');
    expect(screen.getByAltText('Rapida AI').parentElement).toHaveClass(
      'justify-center',
    );
  });

  it('uses the design-system ghost button to lock and unlock the sidebar', () => {
    render(<SidebarNavigation />);

    const toggle = screen.getByRole('button', { name: 'Expand sidebar' });
    expect(toggle).toHaveAttribute('data-design-system-button-kind', 'ghost');

    fireEvent.click(toggle);
    expect(mockSetLocked).toHaveBeenCalledWith(true);
  });
});
