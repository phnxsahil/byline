import { createFileRoute } from "@tanstack/react-router";

import { DispatchWorkspace } from "@/components/dispatch/workspace";

export const Route = createFileRoute("/try")({
  head: () => ({
    meta: [
      { title: "Dispatch Workspace - The Wire and The Desk" },
      {
        name: "description",
        content:
          "Log a real dispatch, stream draft generation across LinkedIn, X, Reddit, and Threads, and edit every output from a single wire-room workspace.",
      },
    ],
  }),
  component: DispatchWorkspace,
});
