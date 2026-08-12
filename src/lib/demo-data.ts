export const clients = [
  {id:"acme",name:"Acme Digital",industry:"Professional services",spend:38420,savings:7460,subscriptions:31,status:"Review ready",progress:92},
  {id:"harbour",name:"Harbour Health",industry:"Allied health",spend:29180,savings:3840,subscriptions:24,status:"In review",progress:68},
  {id:"northstar",name:"Northstar Build",industry:"Construction",spend:47550,savings:6120,subscriptions:38,status:"In review",progress:54},
  {id:"wildflower",name:"Wildflower Studio",industry:"Creative",spend:18960,savings:2240,subscriptions:19,status:"Draft",progress:31},
];

export const subscriptions = [
  {provider:"Microsoft 365",category:"Productivity",cost:4953.60,cycle:"Monthly",owner:"Operations",renewal:"Rolling"},
  {provider:"HubSpot",category:"CRM",cost:6720,cycle:"Monthly",owner:"Sales",renewal:"14 Sep 2026"},
  {provider:"Adobe Creative Cloud",category:"Design",cost:1320,cycle:"Annual",owner:"Marketing",renewal:"03 Oct 2026"},
  {provider:"Dropbox",category:"Storage",cost:1800,cycle:"Annual",owner:"Operations",renewal:"18 Oct 2026"},
  {provider:"Canva Teams",category:"Design",cost:720,cycle:"Annual",owner:"Marketing",renewal:"26 Nov 2026"},
];

export const recommendations = [
  {title:"Review Dropbox requirement",provider:"Dropbox",type:"Consolidate",saving:1800,confidence:"Medium",state:"Needs approval",reason:"Microsoft 365 Business Premium includes OneDrive and SharePoint."},
  {title:"Consolidate design tools",provider:"Adobe Creative Cloud",type:"Existing software",saving:1320,confidence:"Medium",state:"Draft",reason:"Canva Teams may cover the reported social-media design workflow."},
  {title:"Review unused HubSpot seats",provider:"HubSpot",type:"Licence review",saving:2240,confidence:"High",state:"Approved",reason:"Eight paid seats were identified; client records indicate five active users."},
];

export const money = (value:number) => new Intl.NumberFormat("en-AU",{style:"currency",currency:"AUD",maximumFractionDigits:0}).format(value);
