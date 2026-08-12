export type ConnectionHealth="CONNECTED"|"EXPIRED"|"REVOKED"|"ERROR";
export type ProviderTransaction={providerId:string;accountId:string;date:string;description:string;amount:number;currency:string;raw:unknown};
export interface AccountingProvider {
  readonly id:string;
  createAuthorizationUrl(input:{state:string;redirectUri:string}):Promise<string>;
  exchangeAuthorizationCode(input:{code:string;redirectUri:string}):Promise<{secretReference:string;expiresAt:Date}>;
  listOrganisations(secretReference:string):Promise<{id:string;name:string}[]>;
  syncTransactions(input:{secretReference:string;organisationId:string;cursor?:string;from?:Date}):Promise<{transactions:ProviderTransaction[];nextCursor?:string}>;
  disconnect(secretReference:string):Promise<void>;
}
