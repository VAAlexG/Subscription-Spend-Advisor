import { Shell } from "@/components/shell";
import { ImportForm } from "@/components/import-form";
import { requireAdvisor } from "@/lib/session";
import { listCandidates, listClients, listImports } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ client?: string }> }) {
  const session = await requireAdvisor();
  const clients = await listClients(session);
  const imports = await listImports(session);
  const candidates = await listCandidates(session);
  const selected = (await searchParams).client || clients[0]?.id || "";

  return (
    <Shell active="Imports">
      <div className="page-head">
        <div>
          <div className="eyebrow">Transaction intake</div>
          <h1>Import Xero CSV</h1>
          <p>Upload, map, validate and analyse transactions for recurring payments.</p>
        </div>
      </div>
      <div className="grid">
        <section className="card">
          <div className="card-title">Import transactions</div>
          {clients.length ? (
            <ImportForm clients={clients.map(({ id, name }) => ({ id, name }))} selected={selected} />
          ) : (
            <div className="empty-state">Add a client before importing transactions.</div>
          )}
        </section>
        <aside className="card">
          <div className="card-title">Import safeguards</div>
          <div className="renewal">
            <div>
              <h4>Duplicate protection</h4>
              <p>Stable transaction fingerprints prevent repeat imports.</p>
            </div>
          </div>
          <div className="renewal">
            <div>
              <h4>Source retained</h4>
              <p>The original CSV is retained in protected object storage.</p>
            </div>
          </div>
          <div className="renewal">
            <div>
              <h4>Evidence exposed</h4>
              <p>{candidates.filter((candidate) => candidate.status === "PENDING").length} candidates currently await advisor review.</p>
            </div>
          </div>
        </aside>
      </div>
      <section className="card top-gap">
        <div className="card-title">Import history</div>
        {imports.length ? (
          <table className="table">
            <thead>
              <tr>
                <th>Client</th>
                <th>File</th>
                <th>Accepted</th>
                <th>Rejected</th>
                <th>Imported</th>
              </tr>
            </thead>
            <tbody>
              {imports.map((item) => (
                <tr key={String(item.id)}>
                  <td className="client-name">{String(item.client_name)}</td>
                  <td>{String(item.filename)}</td>
                  <td>{String(item.imported_rows)}</td>
                  <td>{String(item.rejected_rows)}</td>
                  <td>{new Date(String(item.created_at) + "Z").toLocaleString("en-AU")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="empty-state">No imports yet.</div>
        )}
      </section>
    </Shell>
  );
}
