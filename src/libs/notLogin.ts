import { VerseService } from "storverse-sao-api";

export async function getHomeVerses(
  userDataId?: string,
  limit?: number,
  offset?: number
) {
  return VerseService.GetHomeVerses(userDataId, limit, offset);
}
