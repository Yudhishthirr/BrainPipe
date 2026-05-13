import prisma from "@/lib/db";
// import { trpc } from "@/trpc/server";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

import { headers } from "next/headers";


export async function GET(req: NextRequest) {

  const code = req.nextUrl.searchParams.get("code");

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      {
        error: "Unauthorized",
      },
      { status: 401 }
    );
  }

  const response = await fetch(
    "https://api.notion.com/v1/oauth/token",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization:
          `Basic ${Buffer.from(
            `${process.env.ClientID}:${process.env.Clientsecret}`
          ).toString("base64")}`,
      },

      body: JSON.stringify({
        grant_type: "authorization_code",
        code,
        redirect_uri:
          process.env.NOTION_REDIRECT_URI,
      }),
    }
  );

  const data = await response.json();
  const { access_token, refresh_token,workspace_id,workspace_name } = data;

  await prisma.integration.create({
    data: {
      provider: "notion",
      accessToken: access_token,
      refreshToken: refresh_token,
      metadata: {
        workspaceId: workspace_id,
        workspaceName:workspace_name,
      },
      userId:session.user.id,
    },
  });


  // return NextResponse.json(data);
  return NextResponse.redirect(
    new URL("/workflows", req.url)
  );


}