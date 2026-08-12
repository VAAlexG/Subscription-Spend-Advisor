export type BillingCycle = "WEEKLY"|"MONTHLY"|"QUARTERLY"|"ANNUAL";
const multipliers:Record<BillingCycle,number>={WEEKLY:52,MONTHLY:12,QUARTERLY:4,ANNUAL:1};
export function annualise(amount:number,cycle:BillingCycle){if(!Number.isFinite(amount)||amount<0)throw new Error("Amount must be a non-negative number");return Math.round(amount*multipliers[cycle]*100)/100}
export function exclusiveOfGst(inclusive:number,gstRate=.1){if(gstRate<0)throw new Error("GST rate cannot be negative");return Math.round((inclusive/(1+gstRate))*100)/100}
export function activePotentialSavings(items:{state:string;outcome:string;estimatedSaving:number}[]){return items.filter(x=>x.state!=="DISMISSED"&&x.outcome!=="DISMISSED"&&x.outcome!=="VERIFIED").reduce((n,x)=>n+x.estimatedSaving,0)}
