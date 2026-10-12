import type { WorkspaceTabTarget } from "@/workspace-tabs/model";

export function resolveClosedTabWorkspaceArchives(input: {
  routeWorkspaceId: string;
  closingTarget: WorkspaceTabTarget | null | undefined;
  routeWorkspaceEmpty: boolean;
}): string[] {
  const draftWorkspaceId =
    input.closingTarget?.kind === "draft" ? input.closingTarget.workspaceId?.trim() : undefined;
  const archiveWorkspaceIds: string[] = [];
  if (draftWorkspaceId && draftWorkspaceId !== input.routeWorkspaceId) {
    archiveWorkspaceIds.push(draftWorkspaceId);
  }
  if (input.routeWorkspaceEmpty) {
    archiveWorkspaceIds.push(input.routeWorkspaceId);
  }
  return archiveWorkspaceIds;
}

/**
 * Sidebar draft deletion archives the draft's own workspace unless the route still
 * hosts other content there. A self-hosted active draft is the first conversation of
 * a project; once its tab close empties the project layout nothing references the
 * record, so it must be retired too — otherwise the leftover record resurfaces in the
 * sidebar under its checkout/branch name (e.g. "main"). archiveEmptyWorkspace still
 * re-verifies emptiness with the server before anything is hidden.
 */
export function shouldArchiveClosedDraftWorkspace(input: {
  draftWorkspaceId: string;
  tabHostWorkspaceId: string;
  routeActive: boolean;
  routeWorkspaceEmpty: boolean;
}): boolean {
  return (
    input.draftWorkspaceId !== input.tabHostWorkspaceId ||
    !input.routeActive ||
    input.routeWorkspaceEmpty
  );
}
