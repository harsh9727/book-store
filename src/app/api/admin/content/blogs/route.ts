import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminApiRequest } from "@/lib/adminApiAuth";
import { createBlog } from "@/lib/contentRepository";
import {
  blogDraftSchema,
  MAX_BLOG_DRAFT_BODY_BYTES,
} from "@/lib/contentValidation";
import { JsonBodyError, readBoundedJson } from "@/lib/boundedJson";

function response(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
  if (!verifyAdminApiRequest(request))
    return response({ message: "Unauthorized." }, 401);
  let body: unknown;
  try {
    body = await readBoundedJson(request, MAX_BLOG_DRAFT_BODY_BYTES);
  } catch (error) {
    return response(
      {
        message:
          error instanceof JsonBodyError ? error.message : "Invalid JSON body.",
      },
      error instanceof JsonBodyError ? error.status : 400,
    );
  }
  const parsed = blogDraftSchema.safeParse(body);
  if (!parsed.success)
    return response({ message: "Blog fields are invalid." }, 400);
  try {
    return response({ item: await createBlog(parsed.data) }, 201);
  } catch (error) {
    return response(
      {
        message:
          error instanceof Error ? error.message : "Blog could not be created.",
      },
      409,
    );
  }
}
