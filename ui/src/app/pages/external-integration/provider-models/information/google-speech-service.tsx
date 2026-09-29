import { ProviderVoicePage } from '@/app/pages/external-integration/provider-models/information/provider-voice-page';
import { VoiceCatalogItem } from '@/app/pages/external-integration/provider-models/information/voice-catalog';
import { GOOGLE_CLOUD_VOICE, TEXT_TO_SPEECH } from '@/providers';

const voices: VoiceCatalogItem[] = GOOGLE_CLOUD_VOICE().map(voice => ({
  title: voice.name,
  voiceId: voice.name,
  languages: voice.languageCodes,
  persona: [voice.ssmlGender],
  features: [],
  previewUrl: `https://docs.cloud.google.com/static/text-to-speech/docs/audio/${voice.name}.wav`,
}));

export function GoogleSpeechServiceModelInformationPage() {
  return (
    <ProviderVoicePage
      provider={TEXT_TO_SPEECH('google-speech-service')}
      voices={voices}
    />
  );
}
