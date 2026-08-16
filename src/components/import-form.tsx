"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { importTransactions, type ImportActionState } from "@/app/actions";

type ImportClient = { id: string; name: string };

const initialState: ImportActionState = { error: null };

export function ImportForm({ clients, selected }: { clients: ImportClient[]; selected: string }) {
  const [state, formAction] = useActionState(importTransactions, initialState);

  return (
    <form action={formAction} className="form-grid">
      <label className="wide">
        <span>Client workspace</span>
        <select name="clientId" defaultValue={selected} required>
          {clients.map((client) => (
            <option value={client.id} key={client.id}>
              {client.name}
            </option>
          ))}
        </select>
      </label>
      <label className="wide file-field">
        <span>CSV export (maximum 20 MB)</span>
        <input name="file" type="file" accept=".csv,text/csv" required />
      </label>
      <div className="wide card-sub">Column names can be changed to match the exported file.</div>
      <label>
        <span>Date column</span>
        <input name="dateColumn" defaultValue="Date" required />
      </label>
      <label>
        <span>Description column</span>
        <input name="descriptionColumn" defaultValue="Description" required />
      </label>
      <label>
        <span>Amount column</span>
        <input name="amountColumn" defaultValue="Amount" required />
      </label>
      <label>
        <span>Account column</span>
        <input name="accountColumn" defaultValue="Account" />
      </label>
      <label>
        <span>Reference column</span>
        <input name="referenceColumn" defaultValue="Reference" />
      </label>
      {state.error ? (
        <div className="form-error wide" role="alert">
          {state.error}
        </div>
      ) : null}
      <ImportButton />
    </form>
  );
}

function ImportButton() {
  const { pending } = useFormStatus();
  return (
    <button className="btn primary" type="submit" disabled={pending} aria-busy={pending}>
      {pending ? "Importing and detecting…" : "Import and detect"}
    </button>
  );
}
