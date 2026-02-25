import type { CheckResult, ScannerModule } from "@/types";

const SENSITIVE_PATHS: {
  path: string;
  name: string;
  title: string;
  severity: CheckResult["severity"];
  description: string;
  recommendation: string;
}[] = [
  {
    path: "/.env",
    name: "exposed_env",
    title: "/.env file publicly accessible",
    severity: "critical",
    description:
      "The .env file is accessible and may contain database credentials, API keys, and other secrets.",
    recommendation:
      "Block access to .env files in your web server config. In Nginx: location ~ /\\.env { deny all; }",
  },
  {
    path: "/.git/config",
    name: "exposed_git",
    title: "/.git directory publicly accessible",
    severity: "critical",
    description:
      "The .git directory is accessible, potentially exposing your entire source code history and secrets in past commits.",
    recommendation:
      "Block access to .git directories. In Nginx: location ~ /\\.git { deny all; }",
  },
  {
    path: "/wp-admin",
    name: "exposed_wp_admin",
    title: "/wp-admin path accessible",
    severity: "low",
    description:
      "WordPress admin panel detected. This is a common target for brute force attacks.",
    recommendation:
      "If this is a WordPress site, restrict /wp-admin access by IP or use a security plugin. If not WordPress, this may be a leftover route.",
  },
  {
    path: "/api/debug",
    name: "exposed_api_debug",
    title: "/api/debug endpoint accessible",
    severity: "high",
    description:
      "A debug API endpoint is accessible in production, potentially exposing internal state and configuration.",
    recommendation:
      "Remove or disable debug endpoints in production. Use environment-based feature flags to prevent debug routes from being registered.",
  },
  {
    path: "/admin",
    name: "exposed_admin",
    title: "/admin path accessible without authentication",
    severity: "medium",
    description:
      "An admin path is accessible. While it may require authentication, the path itself being discoverable can attract targeted attacks.",
    recommendation:
      "Consider using a non-obvious admin path and ensure proper authentication is required.",
  },
  {
    path: "/.DS_Store",
    name: "exposed_ds_store",
    title: "/.DS_Store file exposed",
    severity: "low",
    description:
      "macOS .DS_Store file is accessible, leaking directory structure information.",
    recommendation:
      "Block access to .DS_Store files and add them to .gitignore.",
  },
  {
    path: "/phpinfo.php",
    name: "exposed_phpinfo",
    title: "phpinfo() page accessible",
    severity: "high",
    description:
      "A phpinfo page is accessible, exposing detailed server configuration, PHP version, and environment variables.",
    recommendation: "Remove phpinfo.php from production servers.",
  },
  {
    path: "/server-status",
    name: "exposed_server_status",
    title: "/server-status page accessible",
    severity: "medium",
    description:
      "Apache server-status page is accessible, exposing active connections and server load information.",
    recommendation:
      "Restrict /server-status to localhost or authenticated users only.",
  },
];

async function run(url: string): Promise<CheckResult[]> {
  const results: CheckResult[] = [];
  const parsed = new URL(url);
  const baseUrl = `${parsed.protocol}//${parsed.host}`;

  // Probe each path in parallel
  const probes = await Promise.allSettled(
    SENSITIVE_PATHS.map(async (check) => {
      try {
        const response = await fetch(`${baseUrl}${check.path}`, {
          method: "GET",
          redirect: "manual",
          signal: AbortSignal.timeout(5000),
        });

        // Consider it exposed if we get a 200 OK (not a redirect or error)
        if (response.status === 200) {
          return { ...check, found: true };
        }
        return { ...check, found: false };
      } catch {
        return { ...check, found: false };
      }
    })
  );

  let foundExposed = false;

  for (const probe of probes) {
    if (probe.status === "fulfilled" && probe.value.found) {
      foundExposed = true;
      const p = probe.value;
      results.push({
        name: p.name,
        category: "security",
        severity: p.severity,
        title: p.title,
        description: p.description,
        recommendation: p.recommendation,
      });
    }
  }

  if (!foundExposed) {
    results.push({
      name: "no_exposed_paths",
      category: "security",
      severity: "pass",
      title: "No sensitive paths exposed",
      description:
        "Probed for common sensitive paths (/.env, /.git, /admin, /api/debug, /wp-admin, etc.) and none were publicly accessible.",
      recommendation: "No action needed.",
    });
  }

  return results;
}

const commonPathsCheck: ScannerModule = {
  name: "common-paths",
  title: "Common Paths",
  run,
};

export default commonPathsCheck;
