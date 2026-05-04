import {
  questions,
  traits,
  dimensions,
  pairArchetypes,
  dominantProfiles,
  fallback,
  validResultImages,
  FALLBACK_IMAGE,
  type Trait,
  type Archetype,
} from './content';
import { t } from '@/lib/i18n';

export type Scores = Record<Trait, number>;

export type ResolvedResult = Archetype & {
  resultImage: string;
  archetypeKey: string;
};

export function calculateScores(answers: Array<number | null>): Scores {
  const scores: Scores = { D: 0, T: 0, B: 0, N: 0, C: 0, S: 0 };
  for (let i = 0; i < questions.length; i++) {
    const a = answers[i];
    if (a == null) continue;
    const opt = questions[i].options[a];
    if (!opt) continue;
    for (const k of Object.keys(opt.weights) as Trait[]) {
      scores[k] += opt.weights[k] ?? 0;
    }
  }
  return scores;
}

function rankedScores(scores: Scores): Array<[Trait, number]> {
  return (Object.entries(scores) as Array<[Trait, number]>).sort(
    (a, b) => b[1] - a[1],
  );
}

function pickImage(k1: Trait, k2?: Trait): string {
  if (!k2) return validResultImages.has(k1) ? k1 : FALLBACK_IMAGE;
  if (validResultImages.has(`${k1}+${k2}`)) return `${k1}+${k2}`;
  if (validResultImages.has(`${k2}+${k1}`)) return `${k2}+${k1}`;
  return FALLBACK_IMAGE;
}

function buildDominantResult(primary: Trait, tiedSecondary: Trait[]): Archetype {
  const profile = dominantProfiles[primary];
  const secondaryText = tiedSecondary.map((k) => dimensions[k]).join(' / ');
  return {
    ...profile,
    summary: `${profile.summary}${t.tiedSecondaryAddendum(secondaryText)}`,
  };
}

export function resolveResult(scores: Scores): ResolvedResult {
  const ranked = rankedScores(scores);
  const topScore = ranked[0][1];
  const topKeys = ranked.filter(([, v]) => v === topScore).map(([k]) => k);

  // Multiple traits tied for first
  if (topKeys.length > 1) {
    const pairKey = `${topKeys[0]}+${topKeys[1]}`;
    const reverseKey = `${topKeys[1]}+${topKeys[0]}`;
    
    let mappedKey = pairArchetypes[pairKey] ? pairKey : (pairArchetypes[reverseKey] ? reverseKey : null);
    
    // If not found in pairArchetypes, check custom tied fallback mapping
    if (!mappedKey) {
      const tiedFallbackMap: Record<string, string> = {
        'D+C': 'D+N', 'C+D': 'D+N',
        'D+S': 'D+T', 'S+D': 'D+T',
        'T+S': 'T', 'S+T': 'T',
        'T+N': 'T+C', 'N+T': 'T+C',
        'C+N': 'C', 'N+C': 'C',
      };
      mappedKey = tiedFallbackMap[pairKey] ?? tiedFallbackMap[reverseKey] ?? null;
    }

    if (mappedKey) {
      const isSingle = mappedKey.length === 1;
      const archetype = isSingle ? dominantProfiles[mappedKey as Trait] : pairArchetypes[mappedKey];
      const parts = mappedKey.split('+') as Trait[];
      const resultImage = isSingle ? pickImage(parts[0]) : pickImage(parts[0], parts[1]);
      
      return {
        ...archetype,
        resultImage,
        archetypeKey: mappedKey,
      };
    }

    return {
      ...fallback,
      resultImage: FALLBACK_IMAGE,
      archetypeKey: 'fallback',
    };
  }

  const primary = topKeys[0];
  const secondaryEntry = ranked.find(([, v]) => v < topScore);

  // No secondary (everyone tied at zero is impossible normally; only top exists)
  if (!secondaryEntry) {
    const dom = dominantProfiles[primary] ?? fallback;
    return {
      ...dom,
      resultImage: dom !== fallback ? pickImage(primary) : FALLBACK_IMAGE,
      archetypeKey: dom === fallback ? 'fallback' : primary,
    };
  }

  const secondaryScore = secondaryEntry[1];
  const secondaryKeys = ranked.filter(([, v]) => v === secondaryScore).map(([k]) => k);

  if (secondaryKeys.length === 1) {
    const pairKey = `${primary}+${secondaryKeys[0]}`;
    const reverseKey = `${secondaryKeys[0]}+${primary}`;
    const archetype = pairArchetypes[pairKey] ?? pairArchetypes[reverseKey];
    
    if (archetype) {
      // Find which key actually exists in the pairArchetypes map
      const actualKey = pairArchetypes[pairKey] ? pairKey : reverseKey;
      return {
        ...archetype,
        resultImage: pickImage(primary, secondaryKeys[0]),
        archetypeKey: actualKey,
      };
    }
    const dom = dominantProfiles[primary];
    return {
      ...(dom ?? fallback),
      resultImage: dom ? pickImage(primary) : FALLBACK_IMAGE,
      archetypeKey: dom ? primary : 'fallback',
    };
  }

  return {
    ...buildDominantResult(primary, secondaryKeys),
    resultImage: pickImage(primary),
    archetypeKey: primary,
  };
}

export { traits, dimensions };
