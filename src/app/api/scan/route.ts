import { NextRequest, NextResponse } from "next/server";
import { runScan } from "@/lib/scanner";

// POST /api/scan — Start a new scan
export async function POST(request: NextRequest) {
  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { url } = body;
  if (!url || typeof url !== "string") {
    return NextResponse.json(
      { error: "Missing required field: url" },
      { status: 400 }
    );
  }

  // Normalize URL
  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = `https://${targetUrl}`;
  }

  // Validate URL
  try {
    new URL(targetUrl);
  } catch {
    return NextResponse.json(
      { error: "Invalid URL format" },
      { status: 400 }
    );
  }

  // Generate a scan ID (use crypto for UUID)
  const scanId = crypto.randomUUID();

  // Try to save to Supabase if configured, otherwise run scan-only mode
  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (hasSupabase) {
    const { supabaseAdmin } = await import("@/lib/supabase");

    // Create scan record
    const { error: insertError } = await supabaseAdmin
      .from("scans")
      .insert({
        id: scanId,
        target_url: targetUrl,
        scan_type: "security",
        status: "running",
        started_at: new Date().toISOString(),
      });

    if (insertError) {
      console.error("Failed to create scan record:", insertError);
      return NextResponse.json(
        { error: "Failed to create scan" },
        { status: 500 }
      );
    }
  }

  try {
    // Run the scan
    const { results, score, grade, summary } = await runScan(targetUrl);

    if (hasSupabase) {
      const { supabaseAdmin } = await import("@/lib/supabase");

      // Update scan with results
      await supabaseAdmin
        .from("scans")
        .update({
          status: "completed",
          score,
          grade,
          summary,
          results,
          completed_at: new Date().toISOString(),
        })
        .eq("id", scanId);

      // Insert individual check results
      const checks = results.map((r) => ({
        scan_id: scanId,
        category: r.category,
        check_name: r.name,
        severity: r.severity,
        title: r.title,
        description: r.description,
        recommendation: r.recommendation,
        code_snippet: r.codeSnippet || null,
        file_path: r.filePath || null,
      }));

      if (checks.length > 0) {
        await supabaseAdmin.from("scan_checks").insert(checks);
      }
    }

    return NextResponse.json({
      id: scanId,
      target_url: targetUrl,
      status: "completed",
      score,
      grade,
      summary,
      // Free tier: only return titles and severities, not full details
      results: results.map((r) => ({
        name: r.name,
        severity: r.severity,
        title: r.title,
        category: r.category,
      })),
    });
  } catch (error) {
    console.error("Scan failed:", error);

    if (hasSupabase) {
      const { supabaseAdmin } = await import("@/lib/supabase");
      await supabaseAdmin
        .from("scans")
        .update({ status: "failed" })
        .eq("id", scanId);
    }

    return NextResponse.json(
      { error: "Scan failed. Please check the URL and try again." },
      { status: 500 }
    );
  }
}
