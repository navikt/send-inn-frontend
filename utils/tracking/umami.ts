import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler';

const isLocalOrTest = process.env.NEXT_PUBLIC_APP_ENV === 'local' || process.env.NEXT_PUBLIC_APP_ENV === 'test';

interface EventData {
  [key: string]: string | number | boolean | undefined;
}

// See the analytics taxonomy for standardized event names: https://github.com/navikt/analytics-taxonomy
type EventName = 'skjema fullført' | 'skjemainnsending feilet';

export function logUmamiEvent(eventName: EventName, data: EventData) {
  (async () => {
    try {
      if (isLocalOrTest) {
        console.log(`Log umami event: ${eventName}`, data);
      } else {
        const tracker = getAnalyticsInstance('fyllut-sendinn');
        await tracker(eventName, data);
      }
    } catch (e) {
      console.warn('Failed to log umami event', e);
    }
  })();
}
