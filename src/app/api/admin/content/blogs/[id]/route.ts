import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { verifyAdminApiRequest } from "@/lib/adminApiAuth";
import { deleteBlog, getBlog, updateBlog } from "@/lib/contentRepository";
import { blogDraftSchema } from "@/lib/contentValidation";
import { deleteUploadedImages } from "@/lib/imageUpload";
import { JsonBodyError, readBoundedJson } from "@/lib/boundedJson";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function response(body: object, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  if (!verifyAdminApiRequest(request)) return response({ message: "Unauthorized." }, 401);
  let body: unknown;
  try {
    body = await readBoundedJson(request);
  } catch (error) {
    return response(
      { message: error instanceof JsonBodyError ? error.message : "Invalid JSON body." },
      error instanceof JsonBodyError ? error.status : 400
    );
  }
  const parsed = blogDraftSchema.safeParse(body);
  if (!parsed.success) return response({ message: "Blog fields are invalid." }, 400);
  const { id } = await params;
  const previous = await getBlog(id);
  if (!previous) return response({ message: "Blog not found." }, 404);
  try {
    const item = await updateBlog(id, parsed.data);
    if (previous.imageKey && previous.imageKey !== item?.imageKey) {
      await deleteUploadedImages([previous.imageKey]);
    }
    return response({ item });
  } catch (error) {
    return response(
      { message: error instanceof Error ? error.message : "Blog could not be updated." },
      409
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  if (!verifyAdminApiRequest(request)) return response({ message: "Unauthorized." }, 401);
  const { id } = await params;
  const deleted = await deleteBlog(id);
  if (!deleted) return response({ message: "Blog not found." }, 404);
  await deleteUploadedImages([deleted.imageKey]);
  return response({ success: true });
}
