import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { NotificationTriggerForm } from '../../components/notification-engine/trigger';
import { _fetch } from '../../utils';

const DISPATCH_PATH = '/notifications/dispatch';

// Request body shape expected by the dispatch endpoint.
export interface DispatchNotificationPayload {
  priority: NotificationTriggerForm['priority'];
  data: {
    webhookUrl: string;
    data: {
      message: string;
      handleType: NotificationTriggerForm['data']['data']['handleType'];
    };
  };
}

function toPayload(
  values: NotificationTriggerForm,
): DispatchNotificationPayload {
  return {
    priority: values.priority,
    data: {
      webhookUrl: values.data.webhookUrl,
      data: {
        message: values.data.data.message,
        handleType: values.data.data.handleType,
      },
    },
  };
}

// Error body shape returned by the API (NestJS exception filters). `message`
// may be a string, a string[], or a ZodError-style issues array — or absent.
interface ApiErrorBody {
  statusCode?: number;
  message?: unknown;
  error?: string;
  errors?: string;
}

function hasMessage(value: unknown): value is { message: unknown } {
  return typeof value === 'object' && value !== null && 'message' in value;
}

// Collapse the various `message` shapes into a single readable string.
function normalizeMessage(message: unknown): string | null {
  if (typeof message === 'string') return message || null;

  if (Array.isArray(message)) {
    const parts = message
      .map((item) => (hasMessage(item) ? String(item.message) : item))
      .filter((item): item is string => typeof item === 'string' && !!item);
    return parts.length ? parts.join(', ') : null;
  }

  return null;
}

// Pull a human-readable message out of a failed response, falling back through
// the other fields and finally the status code.
async function extractError(res: Response): Promise<string> {
  const fallback = `Dispatch failed (${res.status})`;
  try {
    const body: ApiErrorBody = await res.clone().json();
    return (
      normalizeMessage(body.message) ?? body.error ?? body.errors ?? fallback
    );
  } catch {
    const text = await res.text().catch(() => '');
    return text || fallback;
  }
}

async function dispatchNotification(values: NotificationTriggerForm) {
  const res = await _fetch(DISPATCH_PATH, {
    method: 'POST',
    body: JSON.stringify(toPayload(values)),
  });

  if (!res.ok) {
    throw new Error(await extractError(res));
  }

  return res.json();
}

export function useDispatchNotification() {
  return useMutation({
    mutationFn: dispatchNotification,
    onSuccess: () => {
      toast.success('Notification dispatched', {
        description: 'Your notification was accepted for delivery.',
      });
    },
    onError: (error) => {
      toast.error('Dispatch failed', {
        description:
          error instanceof Error
            ? error.message
            : 'Something went wrong while dispatching.',
      });
    },
  });
}
