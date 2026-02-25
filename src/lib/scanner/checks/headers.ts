import type { CheckResult, ScannerModule } from "@/types";

const REQUIRED_HEADERS: {
  header: string;
  name: string;
  severity: CheckResult["severity"];
  recommendation: string;
}[] = [
  {
    header: "content-security-policy",
    name: "missing_csp",
    severity: "high",
    recommendation:
      "Add a Content-Security-Policy header to prevent XSS and data injection attacks. Start with: Content-Security-Policy: default-src 'self'; script-src 'self'",
  },
  {
    header: "strict-transport-security",
    name: "missing_hsts",
    severity: "high",
    recommendation:
      "Add Strict-Transport-Security header to enforce HTTPS. Example: Strict-Transport-Security: max-age=31536000; includeSubDomains",
  },
  {
    header: "x-frame-options",
    name: "missing_x_frame_options",
    severity: "medium",
    recommendation:
      "Add X-Frame-Options: DENY or SAMEORIGIN to prevent clickjacking attacks.",
  },
  {
    header: "x-content-type-options",
    name: "missing_x_content_type_options",
    severity: "medium",
    recommendation:
      "Add X-Content-Type-Options: nosniff to prevent MIME-type sniffing.",
  },
  {
    header: "referrer-policy",
    name: "missing_referrer_policy",
    severity: "medium",
    recommendation:
      "Add Referrer-Policy: strict-origin-when-cross-origin to control referrer information leakage.",
  },
  {
    header: "permissions-policy",
    name: "missing_permissions_policy",
    severity: "low",
    recommendation:
      "Add a Permissions-Policy header to control browser feature access. Example: Permissions-Policy: camera=(), microphone=(), geolocation=()",
  },
];

async function run(url: string): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  let response: Response;
  try {
    response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });
  } catch {
    results.push({
      name: "headers_fetch_failed",
      category: "security",
      severity: "info",
      title: "Could not fetch headers",
      description: `Failed to connect to ${url} to check HTTP headers.`,
      recommendation: "Ensure the URL is accessible and try again.",
    });
    return results;
  }

  const headers = response.headers;

  for (const check of REQUIRED_HEADERS) {
    const value = headers.get(check.header);
    if (value) {
      results.push({
        name: check.name,
        category: "security",
        severity: "pass",
        title: `${check.header} header present`,
        description: `The ${check.header} header is set to: ${value}`,
        recommendation: "No action needed.",
      });
    } else {
      results.push({
        name: check.name,
        category: "security",
        severity: check.severity,
        title: `Missing ${check.header} header`,
        description: `The ${check.header} header is not set. This leaves the application vulnerable to common web attacks.`,
        recommendation: check.recommendation,
      });
    }
  }

  return results;
}

const headersCheck: ScannerModule = {
  name: "headers",
  title: "HTTP Security Headers",
  run,
};

export default headersCheck;
