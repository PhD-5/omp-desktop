import { describe, expect, it } from "vitest";
import {
  resolveClosedTabWorkspaceArchives,
  shouldArchiveClosedDraftWorkspace,
} from "@/workspace-tabs/close-cleanup";

describe("closed tab workspace cleanup", () => {
  it("archives a cross-workspace draft without archiving its non-empty tab host", () => {
    expect(
      resolveClosedTabWorkspaceArchives({
        routeWorkspaceId: "workspace-host",
        closingTarget: {
          kind: "draft",
          draftId: "draft-1",
          workspaceId: "workspace-draft",
        },
        routeWorkspaceEmpty: false,
      }),
    ).toEqual(["workspace-draft"]);
  });

  it("archives both workspace records when the hosted draft is the last tab", () => {
    expect(
      resolveClosedTabWorkspaceArchives({
        routeWorkspaceId: "workspace-host",
        closingTarget: {
          kind: "draft",
          draftId: "draft-1",
          workspaceId: "workspace-draft",
        },
        routeWorkspaceEmpty: true,
      }),
    ).toEqual(["workspace-draft", "workspace-host"]);
  });

  it("keeps legacy same-workspace cleanup behavior", () => {
    expect(
      resolveClosedTabWorkspaceArchives({
        routeWorkspaceId: "workspace-host",
        closingTarget: { kind: "draft", draftId: "legacy-draft" },
        routeWorkspaceEmpty: true,
      }),
    ).toEqual(["workspace-host"]);
  });
});

describe("sidebar draft deletion archive decision", () => {
  it("archives a self-hosted active draft once its close empties the project layout", () => {
    expect(
      shouldArchiveClosedDraftWorkspace({
        draftWorkspaceId: "workspace-draft",
        tabHostWorkspaceId: "workspace-draft",
        routeActive: true,
        routeWorkspaceEmpty: true,
      }),
    ).toBe(true);
  });

  it("keeps a self-hosted active draft's workspace while the layout still has content", () => {
    expect(
      shouldArchiveClosedDraftWorkspace({
        draftWorkspaceId: "workspace-draft",
        tabHostWorkspaceId: "workspace-draft",
        routeActive: true,
        routeWorkspaceEmpty: false,
      }),
    ).toBe(false);
  });

  it("archives a cross-workspace draft even while its route stays active", () => {
    expect(
      shouldArchiveClosedDraftWorkspace({
        draftWorkspaceId: "workspace-draft",
        tabHostWorkspaceId: "workspace-host",
        routeActive: true,
        routeWorkspaceEmpty: false,
      }),
    ).toBe(true);
  });

  it("archives an inactive draft hosted on its own workspace", () => {
    expect(
      shouldArchiveClosedDraftWorkspace({
        draftWorkspaceId: "workspace-draft",
        tabHostWorkspaceId: "workspace-draft",
        routeActive: false,
        routeWorkspaceEmpty: false,
      }),
    ).toBe(true);
  });
});
