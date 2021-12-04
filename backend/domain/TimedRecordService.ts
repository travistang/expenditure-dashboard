import { addMinutes, isAfter } from "date-fns";
import logger from "../../logger";

export default class TimedRecordService {
  records: Record<string, Date> = {};

  inquire(key: string, maxAgeMinutes: number): boolean {
    if (!this.records[key]) {
      logger.info(`Creating new timed record "${key}"`);
      this.records[key] = new Date();
      return true;
    }
    const now = new Date();
    if (isAfter(addMinutes(now, maxAgeMinutes), this.records[key])) {
      logger.info(`Updating timed record ${key}`);
      this.records[key] = now;
      return true;
    }
    logger.info(
      `Record not over rewritten for key "${key}" since its not aged enough`
    );
    return false;
  }
}
