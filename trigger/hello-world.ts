import { task, logger } from "@trigger.dev/sdk";

export const helloWorldTask = task({
  id: "hello-world",
  run: async (payload: { message?: string } = {}) => {
    logger.log("Executing hello-world task in Trigger.dev", { payload });
    return {
      success: true,
      message: payload.message || "Hello from Trigger.dev!",
      timestamp: new Date().toISOString(),
    };
  },
});
