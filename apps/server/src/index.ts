import express from "express";
import { prisma } from "@repo/db";

const app = express();
app.use(express.json());

app.get("/api/health", async (_req, res) => {
  const [{ now }] = await prisma.$queryRaw<{ now: Date }[]>`SELECT NOW() as now`;
  res.json({ ok: true, now });
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`);
});
