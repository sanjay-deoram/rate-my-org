import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitInterview } from "@/lib/api/interviews";

export function useSubmitInterview(onSuccess: () => void) {
  return useMutation({
    mutationFn: submitInterview,
    onSuccess: () => {
      toast.success("Interview experience published successfully.");
      onSuccess();
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to submit interview. Please try again.");
    },
  });
}
