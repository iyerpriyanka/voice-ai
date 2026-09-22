import { AssistantTag } from '../assistant-tags';
import { EndpointTag } from '../endpoint-tags';
import { KnowledgeTags } from '../knowledge-tags';

const catalogs = [
  ['assistant', AssistantTag],
  ['endpoint', EndpointTag],
  ['knowledge', KnowledgeTags],
] as const;

describe('domain tag catalogs', () => {
  it.each(catalogs)('keeps %s tags unique and non-empty', (_name, tags) => {
    expect(tags.length).toBeGreaterThan(0);
    expect(new Set(tags).size).toBe(tags.length);
    expect(tags.every(tag => tag.trim() === tag && tag.length > 0)).toBe(true);
  });

  it('keeps product-critical assistant suggestions available', () => {
    expect(AssistantTag).toEqual(
      expect.arrayContaining([
        'agents',
        'chatbots',
        'evaluation',
        'interacting-with-apis',
      ]),
    );
  });

  it('keeps product-critical endpoint suggestions available', () => {
    expect(EndpointTag).toEqual(
      expect.arrayContaining([
        'agents',
        'chatbots',
        'evaluation',
        'interacting with apis',
      ]),
    );
  });

  it('keeps knowledge suggestions broad enough for support libraries', () => {
    expect(KnowledgeTags).toEqual(
      expect.arrayContaining([
        'knowledge base articles',
        'policy document',
        'service level agreement (sla)',
        'voice support call scripts',
      ]),
    );
  });
});
