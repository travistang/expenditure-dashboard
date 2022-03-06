import Express from "express";
import BudgetNotificationJob from "../../../jobs/BudgetNotificationJob";
import logger from "../../../logger";

const handler = async (req: Express.Request, res: Express.Response) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Unrecognized method" });
  }
  try {
    await BudgetNotificationJob.run();
    return res.status(200).json({ ok: true });
  } catch (e) {
    logger.error(
      `[/api/jobs/budgetNotification] Error while executing job: ${
        (e as Error).message
      }`
    );
    res.status(500).json({ error: "Error while executing job." });
  }
};

export default handler;
