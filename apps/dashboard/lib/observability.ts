import * as Sentry from '@sentry/nextjs';
import posthog from 'posthog-js';

type LogContextValue = string | number | boolean | Date | null | LogContext;
type LogContext = { [key: string]: LogContextValue };

export function initAnalytics(context: Record<string, string | number>) {
  if (typeof window === 'undefined') return;

  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.POSTHOG_PROJECT_API_KEY;
  if (posthogKey && !posthog.has_opted_out_capturing()) {
    posthog.init(posthogKey, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
      loaded: (client) => client.capture('pageview', { path: window.location.pathname, ...context })
    });
  }

  const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;
  if (Sentry.getCurrentHub().getClient() === undefined && sentryDsn) {
    Sentry.init({
      dsn: sentryDsn,
      tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_SAMPLE_RATE || 0.1)
    });
  }
}

export async function logAppEvent(message: string, metadata?: LogContext) {
  if (typeof window !== 'undefined') {
    console.info('[observability-dashboard]', message, metadata);
    return;
  }

  if (!process.env.BETTERSTACK_SOURCE_TOKEN) {
    console.info('[observability-dashboard]', message, metadata);
    return;
  }

  const context = metadata && Object.keys(metadata).length ? metadata : undefined;
  const { Logtail } = await import('@logtail/node');
  const client = new Logtail(process.env.BETTERSTACK_SOURCE_TOKEN);
  await client.log(message, undefined, context);
}
