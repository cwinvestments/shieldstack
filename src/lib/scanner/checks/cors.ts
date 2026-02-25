import type { CheckResult, ScannerModule } from "@/types";

async function run(url: string): Promise<CheckResult[]> {
  const results: CheckResult[] = [];

  try {
    // Send a request with an Origin header to trigger CORS response
    const response = await fetch(url, {
      method: "GET",
      headers: { Origin: "https://evil-test-origin.example.com" },
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });

    const acao = response.headers.get("access-control-allow-origin");
    const acac = response.headers.get("access-control-allow-credentials");

    if (!acao) {
      results.push({
        name: "cors_no_header",
        category: "security",
        severity: "pass",
        title: "No CORS headers exposed",
        description:
          "The server does not return Access-Control-Allow-Origin headers, meaning cross-origin requests from browsers are blocked by default.",
        recommendation: "No action needed.",
      });
    } else if (acao === "*") {
      if (acac === "true") {
        results.push({
          name: "cors_wildcard_credentials",
          category: "security",
          severity: "critical",
          title: "CORS allows all origins with credentials",
          description:
            "Access-Control-Allow-Origin is set to * with Access-Control-Allow-Credentials: true. This is a dangerous misconfiguration that allows any website to make authenticated requests to your API.",
          recommendation:
            "Never combine Access-Control-Allow-Origin: * with Access-Control-Allow-Credentials: true. Specify exact allowed origins instead.",
        });
      } else {
        results.push({
          name: "cors_wildcard",
          category: "security",
          severity: "medium",
          title: "CORS allows all origins (wildcard *)",
          description:
            "Access-Control-Allow-Origin is set to *, allowing any website to read responses. This may be intentional for public APIs but risky for private data.",
          recommendation:
            "If this endpoint serves private data, restrict CORS to specific trusted origins instead of using the wildcard.",
        });
      }
    } else if (acao === "https://evil-test-origin.example.com") {
      results.push({
        name: "cors_reflects_origin",
        category: "security",
        severity: "high",
        title: "CORS reflects arbitrary Origin header",
        description:
          "The server echoes back any Origin in the Access-Control-Allow-Origin header. This effectively allows all origins and bypasses CORS protection.",
        recommendation:
          "Validate the Origin header against a whitelist of trusted domains. Do not reflect the Origin value directly.",
      });
    } else {
      results.push({
        name: "cors_specific_origin",
        category: "security",
        severity: "pass",
        title: "CORS properly configured with specific origin",
        description: `Access-Control-Allow-Origin is set to: ${acao}`,
        recommendation: "No action needed.",
      });
    }
  } catch {
    results.push({
      name: "cors_check_failed",
      category: "security",
      severity: "info",
      title: "Could not check CORS configuration",
      description: `Failed to connect to ${url} to check CORS headers.`,
      recommendation: "Ensure the URL is accessible and try again.",
    });
  }

  return results;
}

const corsCheck: ScannerModule = {
  name: "cors",
  title: "CORS Policy",
  run,
};

export default corsCheck;
