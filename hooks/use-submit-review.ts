import { useMutation } from "@tanstack/react-query";
import { submitReview } from "@/lib/api/reviews";

export function useSubmitReview(onSuccess: () => void) {
  return useMutation({
    mutationFn: submitReview,
    onSuccess,
    onError: (error: Error) => {
      console.error("Review submission failed:", error.message);
    },
  });
}
