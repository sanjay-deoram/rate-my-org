import { useMutation } from "@tanstack/react-query";
import { submitInterview } from "@/lib/api/interviews";

export function useSubmitInterview(onSuccess: () => void) {
  return useMutation({
    mutationFn: submitInterview,
    onSuccess,
    onError: (error: Error) => {
      console.error("Interview submission failed:", error.message);
    },
  });
}
