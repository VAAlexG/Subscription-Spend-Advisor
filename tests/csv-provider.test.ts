import {describe,expect,it} from "vitest";
import {parseCsv} from "@/integrations/accounting/csv-provider";

describe("CSV provider",()=>{
 it("maps valid rows and reports invalid rows",()=>{const result=parseCsv("When,Payee,Value\n2026-01-01,Vendor,-12.50\ninvalid,,x",{date:"When",description:"Payee",amount:"Value"});expect(result.transactions).toHaveLength(1);expect(result.transactions[0].amount).toBe(-12.5);expect(result.errors).toEqual(["Row 3: invalid date, description or amount"])});
 it("creates stable provider identifiers",()=>{const csv="Date,Description,Amount\n2026-01-01,Vendor,-12.50";const first=parseCsv(csv,{date:"Date",description:"Description",amount:"Amount"});const second=parseCsv(csv,{date:"Date",description:"Description",amount:"Amount"});expect(first.transactions[0].providerId).toBe(second.transactions[0].providerId)});
});
