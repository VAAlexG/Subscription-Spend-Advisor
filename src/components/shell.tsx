import Link from "next/link";
import type { ReactNode } from "react";

const nav = [
  ["Overview", "/"], ["Clients", "/clients"], ["Imports", "/imports"],
  ["Subscriptions", "/subscriptions"], ["Recommendations", "/recommendations"],
  ["Reports", "/reports"], ["Connections", "/connections"], ["Audit log", "/audit"]
] as const;

export function Shell({ children, active = "Overview" }: { children: ReactNode; active?: string }) {
  return <div className="shell">
    <aside className="sidebar">
      <div className="brand"><img src="/va-mark.svg" alt="Versatile Accounting"/><span>Spend advisor</span></div>
      <div className="nav-label">Workspace</div>
      <nav className="nav">{nav.slice(0,6).map(([label,href]) => <Link className={active===label?"active":""} href={href} key={label}><b>·</b><span>{label}</span></Link>)}</nav>
      <div className="nav-label">Administration</div>
      <nav className="nav">{nav.slice(6).map(([label,href]) => <Link className={active===label?"active":""} href={href} key={label}><b>·</b><span>{label}</span></Link>)}</nav>
      <div className="sidebar-foot"><em>Building Better Business</em><br/>Internal advisor pilot · AUD</div>
    </aside>
    <main className="main">
      <header className="topbar"><div className="crumb">Firm portfolio / {active}</div><div className="user"><div className="avatar">AG</div><div><b>Alex Grant</b><div className="muted">Firm administrator</div></div></div></header>
      <div className="content">{children}</div>
    </main>
  </div>
}
