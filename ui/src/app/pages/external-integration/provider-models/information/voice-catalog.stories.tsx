import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { MemoryRouter } from 'react-router-dom';
import { VoiceCatalog } from './voice-catalog';

const voices = [
  {
    title: 'Asteria',
    voiceId: 'asteria-en-us',
    description: 'A clear, conversational voice for customer support.',
    previewUrl: 'https://example.com/asteria.mp3',
    languages: ['English (US)'],
    persona: ['Warm', 'Female'],
    features: ['Support', 'Conversational'],
  },
  {
    title: 'Orion',
    voiceId: 'orion-en-gb',
    description: 'A measured voice suited to narration and training.',
    languages: ['English (UK)'],
    persona: ['Calm', 'Male'],
    features: ['Narration', 'Training'],
  },
];

const meta = {
  title: 'Pages/Integration/Voice Catalog',
  component: VoiceCatalog,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <MemoryRouter>
        <div className="min-h-[32rem]">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
  args: { voices },
} satisfies Meta<typeof VoiceCatalog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Empty: Story = {
  args: { voices: [] },
};
