'use client';

import { useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { useToast } from '@/hooks/use-toast';

export function FirebaseErrorListener() {
  const { toast } = useToast();

  useEffect(() => {
    const handlePermissionError = (error: FirestorePermissionError) => {
      // In development, this will trigger the Next.js error overlay
      // if the error is re-thrown. For now, we show a toast.
      toast({
        variant: "destructive",
        title: "Security Rule Denied",
        description: `Operation ${error.context.operation} at ${error.context.path} was denied.`,
      });
      
      // Re-throw in development to trigger overlay
      if (process.env.NODE_ENV === 'development') {
        // console.error(error); // Optional: if we want console too
      }
    };

    errorEmitter.on('permission-error', handlePermissionError);
    return () => {
      errorEmitter.off('permission-error', handlePermissionError);
    };
  }, [toast]);

  return null;
}
