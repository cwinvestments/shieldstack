import type { CheckResult, ScannerModule } from "@/types";

const CERT_ERROR_CODES = new Set([
  "CERT_HAS_EXPIRED",
  "CERT_NOT_YET_VALID",
  "DEPTH_ZERO_SELF_SIGNED_CERT",
  "SELF_SIGNED_CERT_IN_CHAIN",
  "UNABLE_TO_VERIFY_LEAF_SIGNATURE",
  "UNABLE_TO_GET_ISSUER_CERT",
  "UNABLE_TO_GET_ISSUER_CERT_LOCALLY",
  "ERR_TLS_CERT_ALTNAME_INVALID",
  "CERT_REVOKED",
  "CERT_SIGNATURE_FAILURE",
  "CERT_UNTRUSTED",
  "ERR_CERT_AUTHORITY_INVALID",
  "ERR_CERT_COMMON_NAME_INVALID",
  "ERR_CERT_DATE_INVALID",
]);

const CONNECTION_ERROR_CODES = new Set([
  "ECONNREFUSED",
  "ECONNRESET",
  "ENOTFOUND",
  "ETIMEDOUT",
  "EAI_AGAIN",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_HEADERS_TIMEOUT",
  "ABORT_ERR",
  "ERR_NETWORK",
]);

function getErrorCode(error: unknown): string {
  if (error instanceof Error) {
    // Node fetch stores the underlying error in `cause`
    const cause = (error as Error & { cause?: { code?: string } }).cause;
    if (cause?.code) return cause.code;
    // Some environments put it directly on the error
    const code = (error as Error & { code?: string }).code;
    if (code) return code;
    // Check for timeout abort
    if (error.name === "TimeoutError" || error.name === "AbortError")
      return "ABORT_ERR";
    // Try to extract from message
    const match = Array.from(CERT_ERROR_CODES).find((cert) =>
      error.message.includes(cert)
    );
    if (match) return match;
  }
  return "";
}

function isCertError(code: string): boolean {
  return CERT_ERROR_CODES.has(code);
}

function isTimeoutOrConnectionError(code: string): boolean {
  return CONNECTION_ERROR_CODES.has(code);
}

async function run(url: string): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const parsed = new URL(url);

  // Check if using HTTPS
  if (parsed.protocol !== "https:") {
    results.push({
      name: "no_https",
      category: "security",
      severity: "critical",
      title: "Site not using HTTPS",
      description: `The site is served over HTTP (${parsed.protocol}//). All traffic is unencrypted and vulnerable to interception.`,
      recommendation:
        "Enable HTTPS with a valid SSL/TLS certificate. Most hosting providers (Vercel, Netlify, Cloudflare) offer free SSL certificates.",
    });
    return results;
  }

  // Try to connect and check TLS
  try {
    const response = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: AbortSignal.timeout(10000),
    });

    // If we got here over HTTPS, SSL is working (even if site returns 401/403)
    results.push({
      name: "ssl_valid",
      category: "security",
      severity: "pass",
      title: "SSL certificate valid",
      description:
        "The site has a valid SSL/TLS certificate and is properly serving over HTTPS.",
      recommendation: "No action needed.",
    });

    // Note if site requires authentication (not an SSL issue)
    if (response.status === 401 || response.status === 403) {
      results.push({
        name: "site_auth_required",
        category: "security",
        severity: "info",
        title: "Site requires authentication (access protected)",
        description:
          "The site returned a 401/403 status, indicating it requires authentication. SSL/TLS is working correctly.",
        recommendation: "No action needed — this is expected for protected sites.",
      });
    }

    // Check if redirect landed on a login page
    const finalUrl = response.url?.toLowerCase() ?? "";
    if (
      finalUrl !== url.toLowerCase() &&
      (finalUrl.includes("/login") ||
        finalUrl.includes("/signin") ||
        finalUrl.includes("/auth") ||
        finalUrl.includes("/sso"))
    ) {
      results.push({
        name: "site_auth_redirect",
        category: "security",
        severity: "info",
        title: "Site requires authentication",
        description:
          "The site redirected to a login page. SSL/TLS is working correctly.",
        recommendation: "No action needed — this is expected for protected sites.",
      });
    }

    // Check for HTTP → HTTPS redirect
    const httpUrl = url.replace("https://", "http://");
    try {
      const httpResponse = await fetch(httpUrl, {
        method: "HEAD",
        redirect: "manual",
        signal: AbortSignal.timeout(10000),
      });
      const location = httpResponse.headers.get("location") || "";
      if (
        httpResponse.status >= 300 &&
        httpResponse.status < 400 &&
        location.startsWith("https")
      ) {
        results.push({
          name: "http_redirect",
          category: "security",
          severity: "pass",
          title: "HTTP redirects to HTTPS",
          description: "HTTP requests are properly redirected to HTTPS.",
          recommendation: "No action needed.",
        });
      } else if (httpResponse.ok) {
        results.push({
          name: "no_http_redirect",
          category: "security",
          severity: "medium",
          title: "HTTP does not redirect to HTTPS",
          description:
            "The site is accessible over plain HTTP without redirecting to HTTPS. Users who type the URL without https:// will get an insecure connection.",
          recommendation:
            "Configure your server or CDN to redirect all HTTP traffic to HTTPS with a 301 redirect.",
        });
      }
    } catch {
      // HTTP port might be closed — that's fine
    }

    // Check for mixed content indicators in response
    if (response.headers.get("content-security-policy")?.includes("upgrade-insecure-requests")) {
      results.push({
        name: "upgrade_insecure",
        category: "security",
        severity: "pass",
        title: "upgrade-insecure-requests enabled",
        description: "The CSP includes upgrade-insecure-requests, which automatically upgrades HTTP resources to HTTPS.",
        recommendation: "No action needed.",
      });
    }
  } catch (error: unknown) {
    const errorCode = getErrorCode(error);

    if (isCertError(errorCode)) {
      // Genuine SSL/TLS certificate problem
      results.push({
        name: "ssl_error",
        category: "security",
        severity: "critical",
        title: "SSL/TLS certificate error",
        description:
          `The SSL certificate is invalid or misconfigured (${errorCode || "certificate error"}). ` +
          "Visitors will see a browser security warning.",
        recommendation:
          "Check your SSL certificate validity and configuration. Use a free certificate from Let's Encrypt if needed.",
      });
    } else if (isTimeoutOrConnectionError(errorCode)) {
      // Connection refused, DNS failure, timeout — not an SSL issue
      results.push({
        name: "ssl_unreachable",
        category: "security",
        severity: "info",
        title: "Could not reach site for SSL scanning",
        description:
          `Could not connect to the site (${errorCode || "connection failed"}). ` +
          "This may be a temporary issue or the site may be behind a firewall.",
        recommendation:
          "Check the URL is correct and the site is accessible, then try again.",
      });
    } else {
      // Unknown error — report as info, not critical
      results.push({
        name: "ssl_check_failed",
        category: "security",
        severity: "info",
        title: "SSL/TLS check could not complete",
        description:
          `The SSL check encountered an unexpected error (${errorCode || "unknown"}). ` +
          "This does not necessarily indicate an SSL problem.",
        recommendation: "Try scanning again. If the issue persists, verify the URL is correct.",
      });
    }
  }

  return results;
}

const sslCheck: ScannerModule = {
  name: "ssl",
  title: "SSL / TLS",
  run,
};

export default sslCheck;
