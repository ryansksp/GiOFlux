import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

export const initSentry = () => {
  // Only initialize Sentry in production
  if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: import.meta.env.MODE,
      beforeSend(event) {
        // Filter out development errors
        if (import.meta.env.DEV) {
          return null;
        }
        return event;
      },
    });
  }
};

export const captureException = (error, context) => {
  if (import.meta.env.PROD) {
    Sentry.captureException(error, {
      tags: {
        component: context?.component || 'unknown',
        action: context?.action || 'unknown',
      },
      extra: context,
    });
  } else {
    console.error('Error captured:', error, context);
  }
};

export const captureMessage = (message, level = 'info', context) => {
  if (import.meta.env.PROD) {
    Sentry.captureMessage(message, level, {
      tags: {
        component: context?.component || 'unknown',
      },
      extra: context,
    });
  } else {
    console.log(`[${level.toUpperCase()}] ${message}`, context);
  }
};
