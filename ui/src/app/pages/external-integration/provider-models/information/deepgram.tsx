import { ProviderVoicePage } from '@/app/pages/external-integration/provider-models/information/provider-voice-page';
import { VoiceCatalogItem } from '@/app/pages/external-integration/provider-models/information/voice-catalog';
import { DEEPGRAM_VOICE, TEXT_TO_SPEECH } from '@/providers';

const voices: VoiceCatalogItem[] = DEEPGRAM_VOICE().map(voice => ({
  title: voice.name,
  voiceId: voice.code ?? voice.name,
  languages: [voice.locale],
  persona: [voice.gender, voice.age, voice.accent],
  features: [voice.use_case, ...(voice.style ?? [])],
  previewUrl: voice.audio,
}));

export function DeepgramModelInformationPage() {
  return (
    <ProviderVoicePage provider={TEXT_TO_SPEECH('deepgram')} voices={voices} />
  );
}
