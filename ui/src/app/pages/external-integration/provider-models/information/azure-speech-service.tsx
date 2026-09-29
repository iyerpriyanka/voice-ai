import { ProviderVoicePage } from '@/app/pages/external-integration/provider-models/information/provider-voice-page';
import { VoiceCatalogItem } from '@/app/pages/external-integration/provider-models/information/voice-catalog';
import { AZURE_TEXT_TO_SPEECH_VOICE, TEXT_TO_SPEECH } from '@/providers';

const voices: VoiceCatalogItem[] = AZURE_TEXT_TO_SPEECH_VOICE().map(voice => ({
  title: voice.properties.DisplayName,
  voiceId: voice.shortName,
  description: voice.description,
  languages: [voice.locale],
  persona: [
    voice.properties.Personality,
    voice.properties.AgeGroups,
    voice.properties.Gender,
  ],
  features: voice.properties.TailoredScenarios?.split(',') ?? [],
  previewUrl: voice.samples.styleSamples.at(0)?.audioFileEndpointWithSas,
}));

export function ProviderAzureSpeechServiceModelInformationPage() {
  return (
    <ProviderVoicePage
      provider={TEXT_TO_SPEECH('azure-speech-service')}
      voices={voices}
    />
  );
}
