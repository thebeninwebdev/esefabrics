import Visitor from "../../../../models/visitor";
import { NextRequest, NextResponse } from "next/server";

// Helper to parse the User-Agent for Browser and OS
function getBrowserAndOS(userAgent: string | null): { browser: string, os: string } {
  if (!userAgent) return { browser: "Unknown", os: "Unknown" };

  // Browser detection
  let browser = "Unknown";
  if (userAgent.includes("Firefox")) browser = "Firefox";
  else if (userAgent.includes("Edg")) browser = "Edge";
  else if (userAgent.includes("Chrome")) browser = "Chrome";
  else if (userAgent.includes("Safari")) browser = "Safari";
  else if (userAgent.includes("Opera") || userAgent.includes("OPR")) browser = "Opera";

  // OS detection
  let os = "Unknown";
  if (userAgent.includes("Windows NT")) os = "Windows";
  else if (userAgent.includes("Mac OS X")) os = "MacOS";
  else if (userAgent.includes("Android")) os = "Android";
  else if (userAgent.includes("iPhone") || userAgent.includes("iPad")) os = "iOS";

  return { browser, os };
}

async function getCountryFromIP(ip: string): Promise<string> {
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}`);
    const data = await response.json();
    return data.country || "Unknown";
  } catch (error) {
    console.error("Error fetching country info:", error);
    return "Unknown";
  }
}

async function trackVisitor(req: NextRequest) {
  const ipRaw = req.headers.get("x-forwarded-for") || "unknown";
  const ip = ipRaw === "::1" ? "127.0.0.1" : ipRaw;

  if (!ip || ip === "unknown") return null; // Could not track

  const userAgent = req.headers.get("user-agent");
  const { browser, os } = getBrowserAndOS(userAgent);

  // Get country from IP address
  const country = req.headers.get("x-vercel-ip-country") || await getCountryFromIP(ip) || "Unknown"
   
  
  const referrer = req.headers.get("referer") || "Direct";

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  // Check if IP has already visited this month
  const existingVisit = await Visitor.findOne({
    ip,
    createdAt: {
      $gte: new Date(currentYear, currentMonth, 1),
      $lt: new Date(currentYear, currentMonth + 1, 1),
    },
  });

  if (!existingVisit) {
    // If not visited this month, create a new visitor
    await Visitor.create({ ip, country, browser, os, referrer });
  }

  return { ip, country, browser, os, referrer };
}

// The actual API route
export async function GET(req: NextRequest) {
  try {
    const visitorInfo = await trackVisitor(req);

    if (!visitorInfo) {
      return NextResponse.json({ message: "Could not determine visitor info" }, { status: 400 });
    }

    return NextResponse.json(visitorInfo, { status: 200 });
  } catch (error) {
    console.error("[TRACK_VISITOR_ERROR]", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
