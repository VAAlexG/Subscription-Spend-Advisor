import type {AccountingProvider,ProviderTransaction} from "./types";
export class XeroAccountingProvider implements AccountingProvider {
 readonly id="xero";
 async createAuthorizationUrl({state,redirectUri}:{state:string;redirectUri:string}){const id=process.env.XERO_CLIENT_ID;if(!id)throw new Error("Xero integration is not configured");const q=new URLSearchParams({response_type:"code",client_id:id,redirect_uri:redirectUri,scope:"openid profile email accounting.transactions offline_access",state});return `https://login.xero.com/identity/connect/authorize?${q}`}
 async exchangeAuthorizationCode():Promise<{secretReference:string;expiresAt:Date}>{throw new Error("Xero token exchange requires the production Key Vault adapter")}
 async listOrganisations():Promise<{id:string;name:string}[]>{throw new Error("Xero organisation discovery requires an active connection")}
 async syncTransactions():Promise<{transactions:ProviderTransaction[];nextCursor?:string}>{throw new Error("Xero transaction sync is reserved for Phase 2")}
 async disconnect():Promise<void>{/* Production implementation deletes the Key Vault secret. */}
}
