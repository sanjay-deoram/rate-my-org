import type { InterviewFormValues } from "@/lib/schemas/interview";

export type SubmitInterviewResponse = {
  interview: { id: string; createdAt: string };
};

export type InterviewPostBody = Omit<InterviewFormValues, "companyName">;

export async function submitInterview(body: InterviewPostBody): Promise<SubmitInterviewResponse> {
  const res = await fetch("/api/interviews", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error ?? "Submission failed");
  }
  return res.json();
}
