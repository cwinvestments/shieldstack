import { NextRequest, NextResponse } from "next/server";

// GET /api/scan/[id] — Get scan results
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id || typeof id !== "string") {
    return NextResponse.json(
      { error: "Missing scan ID" },
      { status: 400 }
    );
  }

  const hasSupabase =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!hasSupabase) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  const { supabaseAdmin } = await import("@/lib/supabase");

  // Fetch scan
  const { data: scan, error } = await supabaseAdmin
    .from("scans")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !scan) {
    return NextResponse.json(
      { error: "Scan not found" },
      { status: 404 }
    );
  }

  // Fetch check details
  const { data: checks } = await supabaseAdmin
    .from("scan_checks")
    .select("*")
    .eq("scan_id", id)
    .order("created_at", { ascending: true });

  // Determine if this is a paid scan
  const isPaid = scan.is_paid;

  // Build response — gate details based on payment status
  const response = {
    id: scan.id,
    target_url: scan.target_url,
    scan_type: scan.scan_type,
    status: scan.status,
    score: scan.score,
    grade: scan.grade,
    summary: scan.summary,
    is_paid: isPaid,
    created_at: scan.created_at,
    completed_at: scan.completed_at,
    checks: (checks || []).map((check: Record<string, unknown>) => {
      if (isPaid) {
        // Paid: return everything
        return {
          id: check.id,
          check_name: check.check_name,
          category: check.category,
          severity: check.severity,
          title: check.title,
          description: check.description,
          recommendation: check.recommendation,
          code_snippet: check.code_snippet,
          file_path: check.file_path,
        };
      }
      // Free: titles and severity only
      return {
        id: check.id,
        check_name: check.check_name,
        category: check.category,
        severity: check.severity,
        title: check.title,
        description: null,
        recommendation: null,
        code_snippet: null,
        file_path: null,
      };
    }),
  };

  return NextResponse.json(response);
}
