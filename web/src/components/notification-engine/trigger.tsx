import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '../../utils';
import { Button } from '../ui/button';
import { SectionHeader } from '../ui/section-header';

enum NotificationPriority {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}

enum NotificationHandleType {
  SUCCESS = 'success',
  ERROR = 'error',
}

const FAN_OUT_OPTIONS = [1, 5, 10, 15, 20] as const;

const notificationTriggerValidator = z.object({
  priority: z.enum(NotificationPriority),
  fanOut: z.literal(FAN_OUT_OPTIONS),
  data: z.object({
    webhookUrl: z.url('Please enter a valid webhook URL'),
    data: z.object({
      message: z.string().min(1, 'Message is required'),
      handleType: z.enum(NotificationHandleType),
    }),
  }),
});

type NotificationTriggerForm = z.infer<typeof notificationTriggerValidator>;

const fieldClass =
  'w-full border border-border bg-bg-elev px-4 py-3 font-mono text-[13px] text-text outline-none transition-colors duration-150 placeholder:text-text-4 focus:border-accent-line';

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <label className="font-mono text-[11px] tracking-[0.14em] uppercase text-text-3">
      {children}
    </label>
  );
}

function FieldError({ children }: { children?: string }) {
  if (!children) return null;
  return <p className="font-mono text-[11px] text-red">{children}</p>;
}

export const NotificationTrigger = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<NotificationTriggerForm>({
    resolver: zodResolver(notificationTriggerValidator),
    defaultValues: {
      priority: NotificationPriority.MEDIUM,
      fanOut: 1,
      data: {
        webhookUrl: '',
        data: {
          message: JSON.stringify(
            {
              event: 'order.created',
              orderId: 12345,
            },
            null,
            2,
          ),
          handleType: NotificationHandleType.SUCCESS,
        },
      },
    },
  });

  const onSubmit = (values: NotificationTriggerForm) => {
    console.log(values);
  };

  return (
    <section className="border-t border-border pt-12 pb-16 sm:pb-24">
      <div className="max-w-[1240px] mx-auto px-[22px] sm:px-8">
        <SectionHeader eyebrow="TRIGGER" title="Dispatch a notification." />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="border border-border bg-bg-card overflow-hidden">
          {/* Card header bar */}
          <div className="flex justify-between items-center px-[18px] py-3 border-b border-border bg-bg-elev">
            <div className="flex items-center gap-[10px] font-mono text-[12px] text-text">
              <span
                className="w-2 h-2 rounded-full bg-green shrink-0"
                style={{
                  boxShadow: '0 0 0 3px rgba(34,197,94,0.15)',
                  animation: 'pulse 2.4s infinite',
                }}
              />
              Trigger Configuration
            </div>
            <div className="font-mono text-[10px] text-text-3 tracking-[0.1em] uppercase">
              POST /dispatch
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 flex flex-col gap-6">
            {/* Message */}
            <div className="flex flex-col gap-2">
              <FieldLabel>Message Body</FieldLabel>
              <textarea
                rows={6}
                {...register('data.data.message')}
                className={cn(fieldClass, 'resize-none leading-relaxed')}
              />
              <FieldError>{errors.data?.data?.message?.message}</FieldError>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {/* Webhook URL */}
              <div className="flex flex-col gap-2">
                <FieldLabel>Webhook URL</FieldLabel>
                <input
                  {...register('data.webhookUrl')}
                  className={fieldClass}
                  placeholder="https://example.com/webhook"
                />
                <FieldError>{errors.data?.webhookUrl?.message}</FieldError>
              </div>

              {/* Priority */}
              <div className="flex flex-col gap-2">
                <FieldLabel>Priority</FieldLabel>
                <select {...register('priority')} className={fieldClass}>
                  {Object.values(NotificationPriority).map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              {/* Handle Type */}
              <div className="flex flex-col gap-2">
                <FieldLabel>Handle Type</FieldLabel>
                <select
                  {...register('data.data.handleType')}
                  className={fieldClass}>
                  {Object.values(NotificationHandleType).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fan-out */}
              <div className="flex flex-col gap-2">
                <FieldLabel>Fan-out</FieldLabel>
                <select
                  {...register('fanOut', { valueAsNumber: true })}
                  className={fieldClass}>
                  {FAN_OUT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full justify-center">
              {isSubmitting ? 'Dispatching...' : 'Dispatch'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  );
};
