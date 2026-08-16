import { requireAdvisor } from "@/lib/session";
import { getDb, getFiles } from "@/lib/cloudflare";

export async function GET(_:Request,{params}:{params:Promise<{id:string}>}){const session=await requireAdvisor();const {id}=await params;const db=await getDb();const report=await db.prepare("SELECT object_key FROM report_snapshots WHERE id=? AND firm_id=?").bind(id,session.firmId).first<{object_key:string}>();if(!report)return new Response("Not found",{status:404});const object=await (await getFiles()).get(report.object_key);if(!object)return new Response("Not found",{status:404});return new Response(object.body,{headers:{"content-type":"application/pdf","content-disposition":`attachment; filename="subscription-review-${id}.pdf"`}})}
