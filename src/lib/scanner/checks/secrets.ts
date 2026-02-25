import type { CheckResult, ScannerModule } from "@/types";

// Patterns that indicate leaked secrets in page source / JS bundles
const SECRET_PATTERNS: {
  name: string;
  pattern: RegExp;
  title: string;
  severity: CheckResult["severity"];
}[] = [
  {
    name: "aws_key",
    pattern: /AKIA[0-9A-Z]{16}/,
    title: "AWS Access Key exposed in page source",
    severity: "critical",
  },
  {
    name: "stripe_secret",
    pattern: /sk_live_[0-9a-zA-Z]{24,}/,
    title: "Stripe secret key exposed in page source",
    severity: "critical",
  },
  {
    name: "stripe_publishable",
    pattern: /pk_live_[0-9a-zA-Z]{24,}/,
    title: "Stripe publishable key found (verify it's intentional)",
    severity: "info",
  },
  {
    name: "github_token",
    pattern: /ghp_[0-9a-zA-Z]{36}/,
    title: "GitHub personal access token exposed",
    severity: "critical",
  },
  {
    name: "google_api_key",
    pattern: /AIza[0-9A-Za-z\-_]{35}/,
    title: "Google API key exposed in page source",
    severity: "high",
  },
  {
    name: "firebase_key",
    pattern: /firebase[a-zA-Z0-9_]*\s*[:=]\s*['"][A-Za-z0-9_\-]{20,}['"]/i,
    title: "Firebase configuration key found in source",
    severity: "medium",
  },
  {
    name: "jwt_token",
    pattern: /eyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}/,
    title: "JWT token found in page source",
    severity: "high",
  },
  {
    name: "private_key",
    pattern: /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/,
    title: "Private key exposed in page source",
    severity: "critical",
  },
  {
    name: "env_pattern",
    pattern: /(?:DATABASE_URL|DB_PASSWORD|SECRET_KEY|API_SECRET)\s*[:=]\s*['"][^'"]{8,}['"]/i,
    title: "Environment variable with secret value found in source",
    severity: "critical",
  },
  {
    name: "supabase_service",
    pattern: /eyJ[A-Za-z0-9_-]+\.eyJ[A-Za-z0-9_-]*"role"\s*:\s*"service_role"/,
    title: "Supabase service role key exposed",
    severity: "critical",
  },
];

async function run(url: string): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  let html: string;
  try {
    const response = await fetch(url, {
      signal: AbortSignal.timeout(15000),
    });
    html = await response.text();
  } catch {
    results.push({
      name: "secrets_fetch_failed",
      category: "security",
      severity: "info",
      title: "Could not fetch page source for secret scanning",
      description: `Failed to retrieve page source from ${url}.`,
      recommendation: "Ensure the URL is accessible and try again.",
    });
    return results;
  }

  let foundSecrets = false;

  for (const check of SECRET_PATTERNS) {
    const match = check.pattern.exec(html);
    if (match) {
      foundSecrets = true;
      // Mask the matched value for safety
      const masked = match[0].substring(0, 8) + "..." + match[0].slice(-4);
      results.push({
        name: check.name,
        category: "security",
        severity: check.severity,
        title: check.title,
        description: `Found pattern matching ${check.name} in page source: ${masked}`,
        recommendation: `Immediately rotate this credential and remove it from client-side code. Use environment variables on the server side only.`,
        codeSnippet: masked,
      });
    }
  }

  if (!foundSecrets) {
    results.push({
      name: "no_exposed_secrets",
      category: "security",
      severity: "pass",
      title: "No exposed API keys or secrets in page source",
      description:
        "Scanned page source for common API key patterns (AWS, Stripe, GitHub, Google, Firebase, JWT, private keys) and found none.",
      recommendation: "No action needed.",
    });
  }

  return results;
}

const secretsCheck: ScannerModule = {
  name: "secrets",
  title: "Exposed Secrets",
  run,
};

export default secretsCheck;
