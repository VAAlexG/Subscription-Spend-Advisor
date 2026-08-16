import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getBindings() {
  const { env } = await getCloudflareContext({ async: true });
  return env;
}

export async function getDb(): Promise<D1Database> {
  return (await getBindings()).DB;
}

export async function getFiles(): Promise<R2Bucket> {
  return (await getBindings()).FILES;
}
