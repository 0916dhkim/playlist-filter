import { createMachine } from "xstate";

type Context = {};
type Events =
  | {
      type: "LOAD_PLAYLIST";
    }
  | {
      type: "CHANGE_FILTER";
    }
  | {
      type: "CALCULATE_TRACKS";
    }
  | {
      type: "START_EXPORT";
    }
  | {
      type: "EXPORT";
    };

export default createMachine({
  id: "track-filter",
  tsTypes: {} as import("./trackFilterMachine.typegen").Typegen0,
  schema: {
    context: {} as Context,
    events: {} as Events,
  },
  initial: "LOADING_PLAYLIST",
  states: {
    LOADING_PLAYLIST: {
      on: {
        LOAD_PLAYLIST: {
          target: "LOADED",
        },
      },
    },
    LOADED: {
      on: {
        CHANGE_FILTER: { target: "CALCULATING_TRACKS" },
        START_EXPORT: { target: "EXPORTING" },
      },
    },
    CALCULATING_TRACKS: {
      on: {
        CALCULATE_TRACKS: { target: "LOADED" },
      },
    },
    EXPORTING: {
      on: {
        EXPORT: { target: "COMPLETE" },
      },
    },
    COMPLETE: {
      type: "final",
    },
  },
});
