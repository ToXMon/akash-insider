import { toast as sonnerToast } from 'sonner';

export type ToastOptions = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive' | 'success';
};

export function useToast() {
  function toast({ title, description, variant = 'default' }: ToastOptions) {
    const style = variant === 'destructive' ? { style: { background: '#fee2e2', color: '#7f1d1d' } } :
      variant === 'success' ? { style: { background: '#ecfdf5', color: '#065f46' } } : {};
    sonnerToast(title || description || 'Notice', {
      description: title ? description : undefined,
      ...style,
    });
  }
  return { toast };
}

