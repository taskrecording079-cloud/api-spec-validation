import {
  DEFAULT_PAGE_LIMIT,
  ListItem,
  MAX_PAGE_LIMIT,
  MIN_PAGE_LIMIT,
  PaginatedListResponse,
  PaginationMeta,
} from "../types/pagination"

const ITEM_COUNT = 50

function buildSeedItems(): ListItem[] {
  const base = new Date("2026-01-01T00:00:00.000Z").getTime()
  return Array.from({ length: ITEM_COUNT }, (_, i) => {
    const id = `item-${String(i + 1).padStart(3, "0")}`
    const created = new Date(base + i * 86_400_000).toISOString()
    const updated = new Date(base + i * 86_400_000 + 3_600_000).toISOString()
    return {
      id,
      name: `Item ${i + 1}`,
      created_at: created,
      updated_at: updated,
    }
  })
}

const ALL_ITEMS: ListItem[] = buildSeedItems()

export function encodeCursor(id: string): string {
  return Buffer.from(id, "utf8").toString("base64url")
}

export function decodeCursor(cursor: string): string {
  return Buffer.from(cursor, "base64url").toString("utf8")
}

export class ItemsServiceError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number
  ) {
    super(message)
    this.name = "ItemsServiceError"
  }
}

export function parseLimit(raw: unknown): number {
  if (raw === undefined || raw === "") {
    return DEFAULT_PAGE_LIMIT
  }
  const limit = Number(raw)
  if (!Number.isInteger(limit) || limit < MIN_PAGE_LIMIT || limit > MAX_PAGE_LIMIT) {
    throw new ItemsServiceError(
      `limit must be an integer between ${MIN_PAGE_LIMIT} and ${MAX_PAGE_LIMIT}`,
      400
    )
  }
  return limit
}

export function listItems(
  cursor: string | undefined,
  limit: number
): PaginatedListResponse<ListItem> {
  let startIndex = 0
  if (cursor !== undefined && cursor !== "") {
    let decodedId: string
    try {
      decodedId = decodeCursor(cursor)
    } catch {
      throw new ItemsServiceError("Invalid cursor", 400)
    }
    const cursorIndex = ALL_ITEMS.findIndex((item) => item.id === decodedId)
    if (cursorIndex === -1) {
      throw new ItemsServiceError("Invalid cursor", 400)
    }
    startIndex = cursorIndex + 1
  }

  const page = ALL_ITEMS.slice(startIndex, startIndex + limit)
  const lastOnPage = page[page.length - 1]
  const hasMore = startIndex + page.length < ALL_ITEMS.length

  const meta: PaginationMeta = {
    next_cursor: hasMore && lastOnPage ? encodeCursor(lastOnPage.id) : null,
    total_count: ALL_ITEMS.length,
    limit,
  }

  return {
    success: true,
    data: page,
    meta,
  }
}
