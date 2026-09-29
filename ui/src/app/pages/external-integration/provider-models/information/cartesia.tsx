import { ProviderVoicePage } from '@/app/pages/external-integration/provider-models/information/provider-voice-page';
import { VoiceCatalogItem } from '@/app/pages/external-integration/provider-models/information/voice-catalog';
import { CARTESIA_VOICE, TEXT_TO_SPEECH } from '@/providers';

const voices: VoiceCatalogItem[] = CARTESIA_VOICE().map(voice => ({
  title: voice.name,
  voiceId: voice.id,
  description: voice.description,
  languages: [voice.language],
  persona: [],
  features: [voice.mode],
}));

export function CartesiaModelInformationPage() {
  return (
    <ProviderVoicePage provider={TEXT_TO_SPEECH('cartesia')} voices={voices} />
  );
}
