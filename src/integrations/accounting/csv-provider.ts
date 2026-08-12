import Papa from "papaparse"; import type {AccountingProvider,ProviderTransaction} from "./types"; import {transactionFingerprint} from "@/domain/transactions";
export type ColumnMap={date:string;description:string;amount:string;account?:string;reference?:string};
export function parseCsv(csv:string,map:ColumnMap){const parsed=Papa.parse<Record<string,string>>(csv,{header:true,skipEmptyLines:true});const errors:string[]=[];const transactions:ProviderTransaction[]=[];parsed.data.forEach((row,i)=>{const amount=Number(String(row[map.amount]||"").replace(/[$,]/g,""));const date=row[map.date],description=row[map.description];if(!date||Number.isNaN(Date.parse(date))||!description||!Number.isFinite(amount)){errors.push(`Row ${i+2}: invalid date, description or amount`);return}const input={date,description,amount,account:map.account?row[map.account]:undefined,reference:map.reference?row[map.reference]:undefined};transactions.push({providerId:transactionFingerprint(input),accountId:input.account||"csv",date,description,amount,currency:"AUD",raw:row})});return{transactions,errors,parseErrors:parsed.errors}}
export class CsvAccountingProvider implements AccountingProvider {
  readonly id="csv";
  async createAuthorizationUrl():Promise<string>{throw new Error("CSV does not use OAuth")}
  async exchangeAuthorizationCode():Promise<{secretReference:string;expiresAt:Date}>{throw new Error("CSV does not use OAuth")}
  async listOrganisations():Promise<{id:string;name:string}[]>{return[]}
  async syncTransactions():Promise<{transactions:ProviderTransaction[];nextCursor?:string}>{return{transactions:[]}}
  async disconnect():Promise<void>{}
}
