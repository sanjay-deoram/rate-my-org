import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitReview } from "@/lib/api/reviews";

export function useSubmitReview(onSuccess: () => void) {
  return useMutation({
    mutationFn: submitReview,
    onSuccess: () => {
      toast.success("Review published successfully.");
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit review. Please try again.");
    },
  });
}
