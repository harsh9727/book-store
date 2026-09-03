import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminApiRequest } from "@/lib/adminApiAuth";
import { JsonBodyError, readBoundedJson } from "@/lib/boundedJson";
import { createCategory } from "@/lib/contentRepository";
import {
  categoryDraftSchema,
  MAX_CATALOG_DRAFT_BODY_BYTES,
} from "@/lib/contentValidation";

function response(body: object, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: NextRequest) {
  if (!verifyAdminApiRequest(request))
    return response({ message: "Unauthorized." }, 401);
  try {
    const body = await readBoundedJson(request, MAX_CATALOG_DRAFT_BODY_BYTES);
    const parsed = categoryDraftSchema.safeParse(body);
    if (!parsed.success)
      return response({ message: "Category fields are invalid." }, 400);
    return response({ item: await createCategory(parsed.data) }, 201);
  } catch (error) {
    if (error instanceof JsonBodyError)
      return response({ message: error.message }, error.status);
    return response(
      {
        message:
          error instanceof Error
            ? error.message
            : "Category could not be created.",
      },
      409,
    );
  }
}
