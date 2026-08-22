import { Router } from "express";
import { ensureGifCached } from "../lib/gifCache";

const router = Router();

router.get("/:id", async (req, res) => {
  const url = await ensureGifCached(req.params.id);

  if (!url) {
    return res.status(404).json({ error: "GIF not available" });
  }

  res.redirect(302, url);
});

export default router;
