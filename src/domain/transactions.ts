import {createHash} from "node:crypto";
export type TransactionInput={date:string;description:string;amount:number;account?:string;reference?:string};
export function normaliseMerchant(value:string){return value.toUpperCase().replace(/\b(PAYMENT|DIRECT DEBIT|CARD|AU|AUS|PTY|LTD)\b/g," ").replace(/[*#_\-]+/g," ").replace(/\s+/g," ").trim()}
export function transactionFingerprint(x:TransactionInput){return createHash("sha256").update([x.date,Number(x.amount).toFixed(2),x.account||"",x.reference||"",normaliseMerchant(x.description)].join("|")).digest("hex")}
export function validateTransaction(x:Partial<TransactionInput>){const issues:string[]=[];if(!x.date||Number.isNaN(Date.parse(x.date)))issues.push("Invalid date");if(!x.description?.trim())issues.push("Description is required");if(typeof x.amount!=="number"||!Number.isFinite(x.amount))issues.push("Invalid amount");return issues}
