import { ProviderVoicePage } from '@/app/pages/external-integration/provider-models/information/provider-voice-page';
import { VoiceCatalogItem } from '@/app/pages/external-integration/provider-models/information/voice-catalog';
import { ELEVENLABS_VOICE, TEXT_TO_SPEECH } from '@/providers';

const voices: VoiceCatalogItem[] = ELEVENLABS_VOICE().map(voice => ({
  title: voice.name,
  voiceId: voice.voice_id,
  description: voice.description,
  languages: voice.verified_languages?.flatMap(
    language => language.language,
  ) ?? [voice.labels.language],
  persona: [voice.labels.accent, voice.labels.gender],
  features: [voice.labels.use_case, voice.category],
  previewUrl: voice.preview_url,
}));

export function ElevanlabModelInformationPage() {
  return (
    <ProviderVoicePage
      provider={TEXT_TO_SPEECH('elevenlabs')}
      voices={voices}
    />
  );
}
