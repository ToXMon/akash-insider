import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { Controller, FormProvider, type ControllerProps, type FieldPath, type FieldValues } from 'react-hook-form';
import { Label } from './label';
import { cn } from '@/lib/utils';

export function Form({ children, ...props }: { children: React.ReactNode } & Record<string, unknown>) {
  // Casting is required because FormProvider expects a specific generic shape from react-hook-form
  return <FormProvider {...(props as unknown as React.ComponentProps<typeof FormProvider>)}>{children}</FormProvider>;
}

export type FormFieldProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> = ControllerProps<TFieldValues, TName>;

export function FormField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({ ...props }: FormFieldProps<TFieldValues, TName>) {
  return <Controller {...props} />;
}

export const FormItem = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('space-y-2', className)} {...props} />
);

export const FormLabel = Label;

export const FormControl = React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(({ ...props }, ref) => (
  <Slot ref={ref} {...props} />
));
FormControl.displayName = 'FormControl';

export const FormDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-gray-500', className)} {...props} />
);

export const FormMessage = ({ className, children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p className={cn('text-sm text-red-600', className)} {...props}>{children}</p>
);

