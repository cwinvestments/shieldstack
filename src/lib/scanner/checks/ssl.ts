import type { CheckResult, ScannerModule } from "@/types";

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

    // If we got here over HTTPS, SSL is working
    results.push({
      name: "ssl_valid",
      category: "security",
      severity: "pass",
      title: "SSL certificate valid",
      description:
        "The site has a valid SSL/TLS certificate and is properly serving over HTTPS.",
      recommendation: "No action needed.",
    });

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
  } catch {
    results.push({
      name: "ssl_error",
      category: "security",
      severity: "critical",
      title: "SSL/TLS connection failed",
      description:
        "Could not establish a secure connection. The SSL certificate may be expired, self-signed, or misconfigured.",
      recommendation:
        "Check your SSL certificate validity and configuration. Use a free certificate from Let's Encrypt if needed.",
    });
  }

  return results;
}

const sslCheck: ScannerModule = {
  name: "ssl",
  title: "SSL / TLS",
  run,
};

export default sslCheck;
