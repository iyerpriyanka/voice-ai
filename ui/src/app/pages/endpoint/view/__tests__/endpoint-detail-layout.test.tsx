import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';

import { ViewEndpointPage } from '@/app/pages/endpoint/view';
import { EndpointViewLayout } from '@/app/pages/endpoint/view/endpoint-view.layout';
import { useEndpointPageStore } from '@/stores/endpoint';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

const mockNavigate = jest.fn();
const mockShowLoader = jest.fn();
const mockHideLoader = jest.fn();
const mockOnGetEndpoint = jest.fn();
const mockOnShowInstruction = jest.fn();
const mockOnShowUpdateDetailVisible = jest.fn();
const mockOnShowEditTagVisible = jest.fn();
const mockWriteText = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

jest.mock('@carbon/icons-react', () => ({
  Application: ({ size }: any) => (
    <span data-icon-size={size}>application</span>
  ),
  Checkmark: ({ size }: any) => <span data-icon-size={size}>checkmark</span>,
  Code: ({ size }: any) => <span data-icon-size={size}>code</span>,
  Copy: ({ size }: any) => <span data-icon-size={size}>copy</span>,
  Debug: ({ size }: any) => <span data-icon-size={size}>debug</span>,
  Edit: ({ size }: any) => <span data-icon-size={size}>edit</span>,
  Globe: ({ size }: any) => <span data-icon-size={size}>globe</span>,
  Information: ({ size }: any) => <span data-icon-size={size}>info</span>,
  LogoPython: ({ size }: any) => <span data-icon-size={size}>python</span>,
  LogoReact: ({ size }: any) => <span data-icon-size={size}>react</span>,
  Phone: ({ size }: any) => <span data-icon-size={size}>phone</span>,
  SourceControl: ({ size }: any) => (
    <span data-icon-size={size}>source-control</span>
  ),
  Tag: ({ size }: any) => <span data-icon-size={size}>tag</span>,
  SidePanelClose: () => <span>close panel</span>,
  SidePanelOpen: () => <span>open panel</span>,
}));

jest.mock('@/hooks/use-credential', () => ({
  useCredential: () => ['user-1', 'token-1', 'project-1'],
}));

jest.mock('@/stores/app', () => ({
  useRapidaStore: () => ({
    showLoader: mockShowLoader,
    hideLoader: mockHideLoader,
  }),
}));

jest.mock('@carbon/react', () => ({
  Breadcrumb: ({ children }: any) => <nav>{children}</nav>,
  BreadcrumbItem: ({ children, href, isCurrentPage }: any) =>
    isCurrentPage ? <span>{children}</span> : <a href={href}>{children}</a>,
  HeaderGlobalBar: ({ children, ...props }: any) => (
    <div role="toolbar" {...props}>
      {children}
    </div>
  ),
  HeaderGlobalAction: ({ children, tooltipAlignment, ...props }: any) => (
    <button data-tooltip-alignment={tooltipAlignment} {...props}>
      {children}
    </button>
  ),
  Tabs: ({ children, selectedIndex }: any) => (
    <div data-testid="endpoint-tabs" data-selected-index={selectedIndex}>
      {children}
    </div>
  ),
  TabList: ({ children, 'aria-label': ariaLabel }: any) => (
    <div role="tablist" aria-label={ariaLabel}>
      {children}
    </div>
  ),
  Tab: ({ children }: any) => <button role="tab">{children}</button>,
  TabPanels: ({ children }: any) => <div>{children}</div>,
  TabPanel: ({ children }: any) => <div role="tabpanel">{children}</div>,
  SideNav: ({ children, expanded, isRail, className, ...props }: any) => (
    <aside
      className={className}
      data-expanded={expanded}
      data-rail={isRail}
      {...props}
    >
      {children}
    </aside>
  ),
  SideNavItems: ({ children }: any) => <ul>{children}</ul>,
  SideNavLink: ({ children, isActive, href, renderIcon: Icon }: any) => (
    <a data-active={isActive} href={href}>
      {Icon ? <Icon size={16} /> : null}
      {children}
    </a>
  ),
  SideNavMenu: ({
    children,
    title,
    isActive,
    defaultExpanded,
    renderIcon: Icon,
  }: any) => (
    <li data-active={isActive} data-expanded={defaultExpanded}>
      {Icon ? <Icon size={16} /> : null}
      <span>{title}</span>
      {children}
    </li>
  ),
  SideNavMenuItem: ({ children, isActive, href }: any) => (
    <a data-active={isActive} href={href}>
      {children}
    </a>
  ),
  SkeletonText: () => <span>Loading nav item</span>,
}));

jest.mock('@/app/pages/endpoint/view/try-playground', () => ({
  Playground: () => <section>Endpoint playground</section>,
}));

jest.mock('@/app/pages/endpoint/view/pages/overview-page', () => ({
  EndpointOverviewPage: () => <section>Endpoint summary</section>,
}));

jest.mock('@/app/pages/endpoint/view/traces', () => ({
  EndpointTraces: () => <section>Endpoint logs</section>,
}));

jest.mock('@/app/pages/endpoint/view/version-list', () => ({
  Version: () => <section>Endpoint versions</section>,
}));

jest.mock(
  '@/app/components/dialogs/endpoint/endpoint-instruction-modal',
  () => ({
    EndpointInstructionDialog: () => null,
  }),
);

jest.mock('@/app/components/dialogs/shared/create-tag-modal', () => ({
  CreateTagDialog: () => null,
}));

jest.mock('@/app/components/dialogs/shared/update-description-modal', () => ({
  UpdateDescriptionDialog: () => null,
}));

jest.mock('@/app/components/app-shell/helmet', () => ({
  Helmet: () => null,
}));

jest.mock('react-hot-toast/headless', () => ({
  error: jest.fn(),
}));

const makeTimestamp = (date: Date) => ({
  getSeconds: () => Math.floor(date.getTime() / 1000),
  getNanos: () => 0,
  toDate: () => date,
});

const makeEndpoint = () =>
  ({
    getId: () => 'endpoint-1',
    getName: () => 'Production endpoint',
    getDescription: () => 'Endpoint description',
    getEndpointtag: () => ({ getTagList: () => [] }),
    getEndpointprovidermodel: () => ({
      getId: () => 'epm-1',
      getCreateddate: () => makeTimestamp(new Date()),
    }),
  }) as any;

const renderEndpointDetailRoute = (
  initialEntry = '/deployment/endpoint/endpoint-1/overview',
) =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/deployment/endpoint/:endpointId"
          element={<EndpointViewLayout />}
        >
          <Route
            path="create-endpoint-version"
            element={<section>Create endpoint version</section>}
          />
          <Route path=":tab" element={<ViewEndpointPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe('Endpoint detail layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: mockWriteText },
    });
    useEndpointPageStore.setState({
      currentEndpoint: makeEndpoint(),
      currentEndpointProviderModel: {
        getId: () => 'epm-1',
      },
      instructionVisible: false,
      editTagVisible: false,
      updateDetailVisible: false,
      onGetEndpoint: mockOnGetEndpoint,
      onShowInstruction: mockOnShowInstruction,
      onShowUpdateDetailVisible: mockOnShowUpdateDetailVisible,
      onShowEditTagVisible: mockOnShowEditTagVisible,
    } as any);
    mockOnGetEndpoint.mockImplementation(
      (
        _endpointId,
        _endpointProviderId,
        _projectId,
        _token,
        _userId,
        _onError,
        onSuccess,
      ) => {
        onSuccess(makeEndpoint());
      },
    );
  });

  it('uses Carbon tabs for overview, playground, versions, and logs', () => {
    const overviewRender = renderEndpointDetailRoute(
      '/deployment/endpoint/endpoint-1/overview',
    );
    expect(screen.getByText('Production endpoint')).toBeInTheDocument();
    expect(screen.getByText('Endpoint summary')).toBeInTheDocument();
    expect(
      screen.getByRole('tablist', { name: 'Endpoint sections' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Overview' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Playground' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Logs' })).toBeInTheDocument();
    expect(screen.getByTestId('endpoint-tabs')).toHaveAttribute(
      'data-selected-index',
      '0',
    );

    overviewRender.unmount();
    renderEndpointDetailRoute('/deployment/endpoint/endpoint-1/logs');

    expect(screen.getByText('Production endpoint')).toBeInTheDocument();
    expect(screen.getByText('Endpoint logs')).toBeInTheDocument();
    expect(screen.queryByText('Endpoint playground')).not.toBeInTheDocument();
  });

  it('keeps endpoint tabs visible and marks versions on the create version URL', () => {
    renderEndpointDetailRoute(
      '/deployment/endpoint/endpoint-1/create-endpoint-version',
    );

    expect(
      screen.getByRole('tablist', { name: 'Endpoint sections' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Create endpoint version')).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: 'Versions' })).toBeInTheDocument();
    expect(screen.getByTestId('endpoint-tabs')).toHaveAttribute(
      'data-selected-index',
      '2',
    );
  });

  it('uses a Carbon shell header with right-side global actions', () => {
    renderEndpointDetailRoute();

    const toolbar = screen.getByRole('toolbar', {
      name: 'Endpoint header actions',
    });
    expect(toolbar).toBeInTheDocument();
    expect(
      within(toolbar)
        .getAllByText(/source-control|info|edit|tag|copy/)
        .map(icon => icon),
    ).toHaveLength(5);
    within(toolbar)
      .getAllByText(/source-control|info|edit|tag|copy/)
      .forEach(icon => expect(icon).toHaveAttribute('data-icon-size', '16'));
    expect(screen.getByText('Endpoints')).toBeInTheDocument();
    expect(screen.getByText('Production endpoint')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Create new version' }));
    expect(mockNavigate).toHaveBeenCalledWith(
      '/deployment/endpoint/endpoint-1/create-endpoint-version',
    );
    expect(
      screen.getByRole('button', { name: 'Create new version' }),
    ).toHaveAttribute('data-tooltip-alignment', 'end');

    fireEvent.click(screen.getByRole('button', { name: 'View instructions' }));
    expect(mockOnShowInstruction).toHaveBeenCalledTimes(1);
    expect(
      screen.getByRole('button', { name: 'View instructions' }),
    ).toHaveAttribute('data-tooltip-alignment', 'end');

    fireEvent.click(screen.getByRole('button', { name: 'Edit details' }));
    expect(mockOnShowUpdateDetailVisible).toHaveBeenCalledWith(
      expect.objectContaining({
        getId: expect.any(Function),
      }),
    );
    expect(
      screen.getByRole('button', { name: 'Edit details' }),
    ).toHaveAttribute('data-tooltip-alignment', 'end');

    fireEvent.click(screen.getByRole('button', { name: 'Edit tags' }));
    expect(mockOnShowEditTagVisible).toHaveBeenCalledWith(
      expect.objectContaining({
        getId: expect.any(Function),
      }),
    );

    expect(screen.getByRole('button', { name: 'Edit tags' })).toHaveAttribute(
      'data-tooltip-alignment',
      'end',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Copy endpoint ID' }));
    expect(mockWriteText).toHaveBeenCalledWith('endpoint-1');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
  });
});
