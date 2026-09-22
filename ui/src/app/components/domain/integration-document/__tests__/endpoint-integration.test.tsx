import React from 'react';
import { render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EndpointIntegration } from '../endpoint-integration';

jest.mock('@carbon/react', () => ({
  CodeSnippet: ({ children, copyText, ...props }: any) => (
    <pre
      aria-label={props['aria-label']}
      data-copy-text={copyText}
      data-language={props['data-language']}
    >
      {children}
    </pre>
  ),
  Tag: ({ children }: any) => <span>{children}</span>,
}));

jest.mock('@/app/components/ui/primitives', () => ({
  Tab: ({ active, className, tabs }: any) => (
    <div className={className} data-active-tab={active}>
      {tabs.map((tab: any) => (
        <section aria-label={`${tab.label} panel`} key={tab.label}>
          <h2>{tab.label}</h2>
          {tab.element}
        </section>
      ))}
    </div>
  ),
}));

jest.mock('@/app/components/domain/cards/rapida-credential-card', () => ({
  RapidaCredentialCard: () => <div>SDK credential card</div>,
}));

const makeVariable = (name: string, type: string) => ({
  getName: () => name,
  getType: () => type,
});

const makeEndpointProviderModel = (variables: any[], hasPrompt = true) => ({
  getChatcompleteprompt: () =>
    hasPrompt
      ? {
          getPromptvariablesList: () => variables,
        }
      : undefined,
  getEndpointid: () => 'support-router',
  getId: () => 'version-42',
});

const makeEndpoint = (epm?: any) => ({
  getEndpointprovidermodel: () => epm,
});

describe('EndpointIntegration', () => {
  it('renders Carbon-backed SDK instructions for each supported language', () => {
    render(
      <EndpointIntegration
        endpoint={
          makeEndpoint(
            makeEndpointProviderModel([
              makeVariable('voiceAudio', 'audio-files'),
              makeVariable('attachment', 'files'),
              makeVariable('landingUrl', 'url'),
              makeVariable('customerName', 'text'),
            ]),
          ) as any
        }
      />,
    );

    expect(screen.getByText('Python')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Golang')).toBeInTheDocument();
    expect(screen.getAllByText('SDK credential card')).toHaveLength(3);
    expect(screen.getAllByText('Step 4')).toHaveLength(3);

    const pythonPanel = screen.getByRole('region', { name: 'Python panel' });
    expect(
      within(pythonPanel).getByText(/pip install rapida-python/),
    ).toBeInTheDocument();
    expect(
      within(pythonPanel).getByText(/"voiceAudio": AudioValue/),
    ).toBeInTheDocument();
    expect(
      within(pythonPanel).getByText(/"attachment": FileValue/),
    ).toBeInTheDocument();
    expect(
      within(pythonPanel).getByText(/"landingUrl": URLValue/),
    ).toBeInTheDocument();
    expect(
      within(pythonPanel).getByText(/"customerName": StringValue/),
    ).toBeInTheDocument();

    const typeScriptPanel = screen.getByRole('region', {
      name: 'TypeScript panel',
    });
    expect(
      within(typeScriptPanel).getByText(/npm install/),
    ).toBeInTheDocument();
    expect(
      within(typeScriptPanel).getByText(/new AudioValue/),
    ).toBeInTheDocument();
    expect(
      within(typeScriptPanel).getByText(/new FileValue/),
    ).toBeInTheDocument();
    expect(
      within(typeScriptPanel).getByText(/new URLValue/),
    ).toBeInTheDocument();
    expect(
      within(typeScriptPanel).getByText(/new StringValue/),
    ).toBeInTheDocument();

    const goPanel = screen.getByRole('region', { name: 'Golang panel' });
    expect(within(goPanel).getAllByText(/rapida-go/).length).toBeGreaterThan(0);
    expect(
      within(goPanel).getByText(/WithEndpointId\("support-router"\)/),
    ).toBeInTheDocument();
  });

  it('uses placeholder endpoint values when the model is unavailable', () => {
    render(<EndpointIntegration endpoint={makeEndpoint() as any} />);

    expect(screen.getAllByText(/ENDPOINT_ID/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ENDPOINT_VERSION/).length).toBeGreaterThan(0);
    expect(
      screen.getByText(/WithEndpointId\("ENDPOINT_ID"\)/),
    ).toBeInTheDocument();
  });

  it('renders empty input objects when prompt variables are absent', () => {
    render(
      <EndpointIntegration
        endpoint={makeEndpoint(makeEndpointProviderModel([], false)) as any}
        credentialCard={<div>Static credential</div>}
      />,
    );

    expect(screen.getAllByText('Static credential')).toHaveLength(3);
    expect(screen.getAllByText(/inputs: \{\}/)).toHaveLength(1);
    expect(screen.getAllByText(/inputs=\{\}/)).toHaveLength(1);
  });
});
