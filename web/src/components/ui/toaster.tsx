import { Toaster as SonnerToaster } from 'sonner';

/**
 * App-wide toast host, themed to match the codebase UI:
 * dark elevated surface, sharp corners, mono type, palette-aligned accents.
 * Mounted once at the root; fire toasts anywhere via `toast` from 'sonner'.
 */
export function Toaster() {
  return (
    <SonnerToaster
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            '!rounded-none !border !border-border !bg-bg-elev !text-text !font-mono !text-[13px] !shadow-lg',
          title: '!font-medium !tracking-[-0.01em]',
          description: '!text-text-2 !text-[12px]',
        },
      }}
    />
  );
}
