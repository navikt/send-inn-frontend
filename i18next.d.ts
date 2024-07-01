import type { DefaultNamespace, Namespace, ParseKeys } from 'i18next';
import { defaultNS, resources } from './i18n';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: typeof defaultNS;
    resources: (typeof resources)['nb'];
  }
}

export type TranslationKey<NS extends Namespace = DefaultNamespace> = ParseKeys<NS>;
