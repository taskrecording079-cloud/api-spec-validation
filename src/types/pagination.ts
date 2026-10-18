export interface ListItem {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface PaginationMeta {
  next_cursor: string | null
  total_count: number
  limit: number
}

export interface PaginatedListResponse<T> {
  success: true
  data: T[]
  meta: PaginationMeta
}

export const DEFAULT_PAGE_LIMIT = 20
export const MIN_PAGE_LIMIT = 1
export const MAX_PAGE_LIMIT = 100
