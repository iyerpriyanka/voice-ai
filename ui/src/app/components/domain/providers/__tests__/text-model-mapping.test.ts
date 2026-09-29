import { Metadata } from '@rapidaai/react';
import { loadProviderData } from '@/providers/config-loader';
import { MapTextProviderModelSelection } from '../text/model-mapping';

const createMetadata = (key: string, value: string): Metadata => {
  const m = new Metadata();
  m.setKey(key);
  m.setValue(value);
  return m;
};

const getValue = (items: Metadata[], key: string): string | undefined =>
  items.find(item => item.getKey() === key)?.getValue();

describe('text model mapping', () => {
  it('resolves openai model name to canonical model.id/model.name', () => {
    const mapped = MapTextProviderModelSelection('openai', [
      createMetadata('model.name', 'gpt-4o'),
    ]);

    expect(getValue(mapped, 'model.id')).toBe('openai/gpt-4o');
    expect(getValue(mapped, 'model.name')).toBe('gpt-4o');
  });

  it('resolves gpt-5 model token to canonical openai model id/name', () => {
    const mapped = MapTextProviderModelSelection('openai', [
      createMetadata('model.id', 'gpt-5.5'),
      createMetadata('model.name', 'gpt-5.5'),
    ]);

    expect(getValue(mapped, 'model.id')).toBe('openai/gpt-5.5');
    expect(getValue(mapped, 'model.name')).toBe('gpt-5.5');
  });

  it('resolves gpt-5.2 model token to canonical openai model id/name', () => {
    const mapped = MapTextProviderModelSelection('openai', [
      createMetadata('model.id', 'gpt-5.2'),
      createMetadata('model.name', 'gpt-5.2'),
    ]);

    expect(getValue(mapped, 'model.id')).toBe('openai/gpt-5.2');
    expect(getValue(mapped, 'model.name')).toBe('gpt-5.2');
  });

  it('resolves gpt-5.1 model token to canonical openai model id/name', () => {
    const mapped = MapTextProviderModelSelection('openai', [
      createMetadata('model.id', 'gpt-5.1'),
      createMetadata('model.name', 'gpt-5.1'),
    ]);

    expect(getValue(mapped, 'model.id')).toBe('openai/gpt-5.1');
    expect(getValue(mapped, 'model.name')).toBe('gpt-5.1');
  });

  it('resolves gpt-5.4-nano model token to canonical openai model id/name', () => {
    const mapped = MapTextProviderModelSelection('openai', [
      createMetadata('model.id', 'gpt-5.4-nano'),
      createMetadata('model.name', 'gpt-5.4-nano'),
    ]);

    expect(getValue(mapped, 'model.id')).toBe('openai/gpt-5.4-nano');
    expect(getValue(mapped, 'model.name')).toBe('gpt-5.4-nano');
  });

  it('resolves vertex short model name to full publisher model id', () => {
    const mapped = MapTextProviderModelSelection('vertexai', [
      createMetadata('model.name', 'gemini-2.5-pro'),
    ]);
    const vertexModels = loadProviderData('vertexai', 'models.json');
    const expected = vertexModels.find((model: any) =>
      model.id.endsWith('/gemini-2.5-pro'),
    );

    expect(expected).toBeDefined();
    expect(getValue(mapped, 'model.id')).toBe(expected.id);
    expect(getValue(mapped, 'model.name')).toBe(expected.name);
  });

  it('prefers model.name resolution when id/name conflict', () => {
    const openaiModels = loadProviderData('openai', 'text-models.json');
    const mapped = MapTextProviderModelSelection('openai', [
      createMetadata('model.id', openaiModels[0].id),
      createMetadata('model.name', 'gpt-4o'),
    ]);

    expect(getValue(mapped, 'model.id')).toBe('openai/gpt-4o');
    expect(getValue(mapped, 'model.name')).toBe('gpt-4o');
  });

  it('keeps custom model values for providers that allow custom ids', () => {
    const mapped = MapTextProviderModelSelection('azure-foundry', [
      createMetadata('model.id', 'my-custom-deployment'),
      createMetadata('model.name', 'my-custom-deployment'),
    ]);

    expect(getValue(mapped, 'model.id')).toBe('my-custom-deployment');
    expect(getValue(mapped, 'model.name')).toBe('my-custom-deployment');
  });

  it('keeps custom model values for openrouter free-form models', () => {
    const mapped = MapTextProviderModelSelection('openrouter', [
      createMetadata('model.id', 'openrouter/custom-org/custom-model'),
      createMetadata('model.name', 'openrouter/custom-org/custom-model'),
    ]);

    expect(getValue(mapped, 'model.id')).toBe(
      'openrouter/custom-org/custom-model',
    );
    expect(getValue(mapped, 'model.name')).toBe(
      'openrouter/custom-org/custom-model',
    );
  });

  it('falls back to provider default when non-custom provider model is unknown', () => {
    const cohereModels = loadProviderData('cohere', 'text-models.json');
    const mapped = MapTextProviderModelSelection('cohere', [
      createMetadata('model.name', 'unknown-cohere-model'),
    ]);

    expect(getValue(mapped, 'model.id')).toBe(cohereModels[0].id);
    expect(getValue(mapped, 'model.name')).toBe(cohereModels[0].name);
  });

  it('returns same metadata when model fields are absent', () => {
    const input = [createMetadata('model.temperature', '0.7')];
    const mapped = MapTextProviderModelSelection('openai', input);

    expect(getValue(mapped, 'model.temperature')).toBe('0.7');
    expect(getValue(mapped, 'model.id')).toBeUndefined();
    expect(getValue(mapped, 'model.name')).toBeUndefined();
  });
});
