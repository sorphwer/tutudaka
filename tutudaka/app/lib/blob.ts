import { list, put } from "@vercel/blob";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { RecordMap } from "../types";

const BLOB_PATH = "data.json";
const LOCAL_DATA_PATH = path.join(process.cwd(), ".local-data.json");

// 判断是否使用本地模式：
// 1. 未设置 token 时使用本地模式
// 2. token 是占位符值时使用本地模式
// 3. 开发环境下且 token 看起来不像真实 token 时使用本地模式
const isLocalMode = () => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return true;
  // 检测占位符值
  if (token.includes("your_") || token === "placeholder" || token.length < 20) {
    return true;
  }
  return false;
};

const requireToken = () => {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
  }
  return token;
};

const readLocalRecords = async (): Promise<RecordMap> => {
  try {
    const raw = await readFile(LOCAL_DATA_PATH, "utf-8");
    const data = JSON.parse(raw) as { records?: RecordMap };
    return data.records ?? {};
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return {};
    }
    throw error;
  }
};

const writeLocalRecords = async (records: RecordMap) => {
  const payload = JSON.stringify({ records }, null, 2);
  await writeFile(LOCAL_DATA_PATH, payload, "utf-8");
  return records;
};

export const readRecords = async (): Promise<RecordMap> => {
  if (isLocalMode()) {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
    }
    return readLocalRecords();
  }

  const token = requireToken();
  const { blobs } = await list({ token });
  const target = blobs.find((blob) => blob.pathname === BLOB_PATH);
  if (!target) return {};

  const response = await fetch(target.url);
  if (!response.ok) {
    throw new Error(`Failed to fetch blob: ${response.status}`);
  }

  const data = await response.json();
  return data.records ?? {};
};

export const writeRecords = async (records: RecordMap) => {
  if (isLocalMode()) {
    if (process.env.NODE_ENV !== "development") {
      throw new Error("BLOB_READ_WRITE_TOKEN is not configured.");
    }
    return writeLocalRecords(records);
  }

  const token = requireToken();
  await put(BLOB_PATH, JSON.stringify({ records }), {
    access: "public",
    contentType: "application/json",
    token,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return records;
};
