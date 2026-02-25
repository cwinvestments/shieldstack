import type { CheckResult, ScannerModule } from "@/types";

function parseCookies(setCookieHeaders: string[]): { name: string; flags: string }[] {
  return setCookieHeaders.map((header) => {
    const parts = header.split(";").map((s) => s.trim());
    const name = parts[0]?.split("=")[0] || "unknown";
    return { name, flags: header.toLowerCase() };
  });
}

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
    return results; // Can't check cookies if we can't reach the site
  }

  // Collect all set-cookie headers
  const setCookieHeaders: string[] = [];
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") {
      setCookieHeaders.push(value);
    }
  });

  if (setCookieHeaders.length === 0) {
    results.push({
      name: "no_cookies",
      category: "security",
      severity: "pass",
      title: "No cookies set on initial page load",
      description:
        "The server does not set any cookies on the initial page load, reducing attack surface.",
      recommendation: "No action needed.",
    });
    return results;
  }

  const cookies = parseCookies(setCookieHeaders);

  for (const cookie of cookies) {
    // Check HttpOnly
    if (!cookie.flags.includes("httponly")) {
      results.push({
        name: "cookie_no_httponly",
        category: "security",
        severity: "medium",
        title: `Cookie "${cookie.name}" missing HttpOnly flag`,
        description: `The cookie "${cookie.name}" can be accessed by JavaScript, making it vulnerable to XSS attacks that steal session tokens.`,
        recommendation: `Add the HttpOnly flag to the "${cookie.name}" cookie: Set-Cookie: ${cookie.name}=value; HttpOnly`,
      });
    }

    // Check Secure
    if (!cookie.flags.includes("secure")) {
      results.push({
        name: "cookie_no_secure",
        category: "security",
        severity: "medium",
        title: `Cookie "${cookie.name}" missing Secure flag`,
        description: `The cookie "${cookie.name}" can be sent over insecure HTTP connections, allowing interception.`,
        recommendation: `Add the Secure flag to the "${cookie.name}" cookie: Set-Cookie: ${cookie.name}=value; Secure`,
      });
    }

    // Check SameSite
    if (!cookie.flags.includes("samesite")) {
      results.push({
        name: "cookie_no_samesite",
        category: "security",
        severity: "medium",
        title: `Cookie "${cookie.name}" missing SameSite attribute`,
        description: `The cookie "${cookie.name}" does not specify SameSite, making it vulnerable to CSRF attacks in older browsers.`,
        recommendation: `Add SameSite=Lax or SameSite=Strict to the "${cookie.name}" cookie.`,
      });
    }

    // If all flags present, it's a pass
    if (
      cookie.flags.includes("httponly") &&
      cookie.flags.includes("secure") &&
      cookie.flags.includes("samesite")
    ) {
      results.push({
        name: "cookie_secure",
        category: "security",
        severity: "pass",
        title: `Cookie "${cookie.name}" properly secured`,
        description: `The cookie "${cookie.name}" has HttpOnly, Secure, and SameSite flags set.`,
        recommendation: "No action needed.",
      });
    }
  }

  return results;
}

const cookiesCheck: ScannerModule = {
  name: "cookies",
  title: "Cookie Security",
  run,
};

export default cookiesCheck;
