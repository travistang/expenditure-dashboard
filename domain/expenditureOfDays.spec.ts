import { ExpenditureRecord } from "@prisma/client";
import { expenditureOfEachDay } from "./expenditureOfDays";
import { parseISO } from "date-fns";

describe("expenditureOfDays", () => {
  describe("expenditureOfEachDay", () => {
    it("should bin all expenditures by day", () => {
      const mockRecords: ExpenditureRecord[] = [
        {
          date: parseISO("2021-11-01"),
          amount: 10,
          description: "record 1",
          labels: [],
          id: "1",
          recordedAt: new Date(),
          currency: null,
          exchangeRate: 1,
        },
        {
          date: parseISO("2021-11-01"),
          amount: 20,
          description: "record 2",
          labels: [],
          id: "2",
          recordedAt: new Date(),
          currency: null,
          exchangeRate: 1,
        },
        {
          date: parseISO("2021-11-02"),
          amount: 30,
          description: "record 3",
          labels: [],
          id: "3",
          recordedAt: new Date(),
          currency: null,
          exchangeRate: 1,
        },
        {
          date: parseISO("2021-11-03"),
          amount: 20,
          description: "record 4",
          labels: [],
          id: "4",
          recordedAt: new Date(),
          currency: null,
          exchangeRate: 1,
        },
        {
          date: parseISO("2021-11-04"),
          amount: 30,
          description: "record 5",
          labels: [],
          id: "5",
          recordedAt: new Date(),
          currency: null,
          exchangeRate: 1,
        },
      ];
      const expenditureEachDay = expenditureOfEachDay({
        fromDate: parseISO("2021-11-01"),
        toDate: parseISO("2021-11-05"),
        records: mockRecords,
      });
      expect(Object.keys(expenditureEachDay)).toMatchObject([
        "2021-11-01",
        "2021-11-02",
        "2021-11-03",
        "2021-11-04",
        "2021-11-05",
      ]);
      expect(expenditureEachDay["2021-11-01"]?.records?.length).toEqual(2);
    });
  });
});
