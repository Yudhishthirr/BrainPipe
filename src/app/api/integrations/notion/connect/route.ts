import { NextResponse } from "next/server";

export async function GET() {

  const authUrl =
    `https://api.notion.com/v1/oauth/authorize` +
    `?client_id=${process.env.ClientID}` +
    `&response_type=code` +
    `&owner=user` +
    `&redirect_uri=${encodeURIComponent(
      process.env.NOTION_REDIRECT_URI!
    )}`;

  console.log("Redirecting to Notion auth URL:", authUrl);  
  return NextResponse.redirect(authUrl);
}