import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { ReviewPostBody } from "@/lib/schemas/review";
import type { InterviewPostBody } from "@/lib/schemas/interview";

type ReviewData = ReviewPostBody;
type InterviewData = InterviewPostBody;

const TO_ADDRESS = "brandondeoram8931@gmail.com";
const FROM = "RateMyOrg <notifications@rate-my-org.com>";
const RESEND_URL = "https://api.resend.com/emails";

export interface SubmissionGeo {
  city: string;
  region: string;
  country: string;
}

export function getSubmissionGeo(req: Request): SubmissionGeo {
  try {
    const cf = getCloudflareContext().cf;
    if (cf) {
      return {
        city: (cf.city as string | undefined) ?? "Unknown",
        region: (cf.region as string | undefined) ?? "Unknown",
        country: (cf.country as string | undefined) ?? "Unknown",
      };
    }
  } catch {
    // getCloudflareContext throws in plain next dev without platform proxy
  }

  const country = req.headers.get("cf-ipcountry") ?? "Unknown";
  return { city: "Unknown", region: "Unknown", country };
}

async function sendEmail(subject: string, html: string, text: string): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.log("[notify] RESEND_API_KEY not set — skipping notification");
    return;
  }

  const res = await fetch(RESEND_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: [TO_ADDRESS], subject, html, text }),
  });

  if (!res.ok) {
    throw new Error(`Resend ${res.status}: ${await res.text()}`);
  }
}

export async function sendReviewNotification(
  review: ReviewData,
  company: { name: string },
  geo: SubmissionGeo,
): Promise<void> {
  try {
    const subject = `New review: ${review.jobTitle} @ ${company.name} (★${review.overallRating})`;

    const formerYearRow =
      review.employmentStatus === "former_employee" && review.formerYear
        ? `<tr><td><b>Former year</b></td><td>${review.formerYear}</td></tr>`
        : "";

    const formerYearText =
      review.employmentStatus === "former_employee" && review.formerYear
        ? `Former year: ${review.formerYear}\n`
        : "";

    const html = [
      `<h2>${subject}</h2>`,
      `<table>`,
      `<tr><td><b>Company</b></td><td>${esc(company.name)}</td></tr>`,
      `<tr><td><b>Job title</b></td><td>${esc(review.jobTitle)}</td></tr>`,
      `<tr><td><b>Overall rating</b></td><td>${review.overallRating}/5</td></tr>`,
      `<tr><td><b>Employment status</b></td><td>${esc(review.employmentStatus)}</td></tr>`,
      formerYearRow,
      `<tr><td><b>Employment type</b></td><td>${esc(review.employmentType)}</td></tr>`,
      `</table>`,
      review.headline ? `<h3>Headline</h3><p>${esc(review.headline)}</p>` : "",
      `<h3>Pros</h3><p>${esc(review.pros)}</p>`,
      `<h3>Cons</h3><p>${esc(review.cons)}</p>`,
      review.adviceToManagement
        ? `<h3>Advice to management</h3><p>${esc(review.adviceToManagement)}</p>`
        : "",
      `<hr/><p><i>Submitted from: ${esc(geo.city)}, ${esc(geo.region)}, ${esc(geo.country)}</i></p>`,
    ]
      .filter(Boolean)
      .join("\n");

    const text = [
      `Company: ${company.name}`,
      `Job title: ${review.jobTitle}`,
      `Overall rating: ${review.overallRating}/5`,
      `Employment status: ${review.employmentStatus}`,
      formerYearText,
      `Employment type: ${review.employmentType}`,
      review.headline ? `\nHeadline: ${review.headline}` : "",
      `\nPros:\n${review.pros}`,
      `\nCons:\n${review.cons}`,
      review.adviceToManagement ? `\nAdvice to management:\n${review.adviceToManagement}` : "",
      `\nSubmitted from: ${geo.city}, ${geo.region}, ${geo.country}`,
    ]
      .filter(Boolean)
      .join("\n");

    await sendEmail(subject, html, text);
  } catch (err) {
    console.error("[notify] Failed to send review notification:", err);
  }
}

export async function sendInterviewNotification(
  interview: InterviewData,
  company: { name: string },
  geo: SubmissionGeo,
): Promise<void> {
  try {
    const subject = `New interview: ${interview.roleTitle} @ ${company.name}`;

    const roundsHtml = interview.rounds
      .map((r, i) => `<h4>Round ${i + 1}: ${esc(r.type)}</h4><p>${esc(r.notes)}</p>`)
      .join("\n");

    const roundsText = interview.rounds
      .map((r, i) => `Round ${i + 1}: ${r.type}\n${r.notes}`)
      .join("\n\n");

    const html = [
      `<h2>${subject}</h2>`,
      `<table>`,
      `<tr><td><b>Company</b></td><td>${esc(company.name)}</td></tr>`,
      `<tr><td><b>Role</b></td><td>${esc(interview.roleTitle)}</td></tr>`,
      interview.department
        ? `<tr><td><b>Department</b></td><td>${esc(interview.department)}</td></tr>`
        : "",
      `<tr><td><b>Difficulty</b></td><td>${interview.difficulty}/5</td></tr>`,
      `<tr><td><b>Overall experience</b></td><td>${esc(interview.overallExperience)}</td></tr>`,
      `<tr><td><b>Offer received</b></td><td>${esc(interview.offerReceived)}</td></tr>`,
      `</table>`,
      `<h3>Interview rounds</h3>`,
      roundsHtml,
      `<hr/><p><i>Submitted from: ${esc(geo.city)}, ${esc(geo.region)}, ${esc(geo.country)}</i></p>`,
    ]
      .filter(Boolean)
      .join("\n");

    const text = [
      `Company: ${company.name}`,
      `Role: ${interview.roleTitle}`,
      interview.department ? `Department: ${interview.department}` : "",
      `Difficulty: ${interview.difficulty}/5`,
      `Overall experience: ${interview.overallExperience}`,
      `Offer received: ${interview.offerReceived}`,
      `\nInterview rounds:\n${roundsText}`,
      `\nSubmitted from: ${geo.city}, ${geo.region}, ${geo.country}`,
    ]
      .filter(Boolean)
      .join("\n");

    await sendEmail(subject, html, text);
  } catch (err) {
    console.error("[notify] Failed to send interview notification:", err);
  }
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
