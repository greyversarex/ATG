import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertBrandSchema, insertCategorySchema, insertProductSchema,
  insertBannerSchema, insertNewsSchema, insertServiceSchema
} from "@shared/schema";
import { ZodError } from "zod";
import multer from "multer";
import path from "path";
import fs from "fs";
import { randomUUID } from "crypto";
import express from "express";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads", { recursive: true });
}

const uploadStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, "uploads"),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || ".jpg";
    cb(null, `${randomUUID()}${ext}`);
  },
});
const upload = multer({
  storage: uploadStorage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i;
    if (allowed.test(path.extname(file.originalname))) {
      cb(null, true);
    } else {
      cb(new Error("Допустимы только изображения (jpg, png, gif, webp, svg)"));
    }
  },
});

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (!req.session.userId) {
    return res.status(401).json({ message: "Необходима авторизация" });
  }
  next();
}

function handleZodError(res: any, error: unknown) {
  if (error instanceof ZodError) {
    return res.status(400).json({ message: error.errors.map(e => e.message).join(", ") });
  }
  return res.status(400).json({ message: (error as Error).message });
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.use("/uploads", (_req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Cache-Control", "no-cache");
    next();
  }, express.static("uploads"));

  app.post("/api/upload", requireAuth, upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Файл не загружен" });
    }
    res.json({ url: `/uploads/${req.file.filename}` });
  });

  app.get("/api/uploads", requireAuth, (_req, res) => {
    try {
      const uploadsDir = "uploads";
      if (!fs.existsSync(uploadsDir)) {
        return res.json([]);
      }
      const files = fs.readdirSync(uploadsDir)
        .filter(f => /\.(jpg|jpeg|png|gif|webp|svg|avif)$/i.test(f))
        .map(f => {
          const stat = fs.statSync(path.join(uploadsDir, f));
          return {
            url: `/uploads/${f}`,
            name: f,
            size: stat.size,
            createdAt: stat.birthtime.toISOString(),
          };
        })
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      res.json(files);
    } catch {
      res.json([]);
    }
  });

  app.delete("/api/uploads/:filename", requireAuth, (req, res) => {
    const filename = path.basename(req.params.filename as string);
    if (!filename || filename.includes("..")) {
      return res.status(400).json({ message: "Недопустимое имя файла" });
    }
    const filePath = path.join("uploads", filename);
    const resolved = path.resolve(filePath);
    if (!resolved.startsWith(path.resolve("uploads"))) {
      return res.status(400).json({ message: "Недопустимый путь" });
    }
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      res.json({ ok: true });
    } else {
      res.status(404).json({ message: "Файл не найден" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Введите логин и пароль" });
    }
    const user = await storage.getUserByUsername(username);
    if (!user) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }
    req.session.userId = user.id;
    res.json({ id: user.id, username: user.username, role: user.role });
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy(() => {
      res.json({ ok: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    const user = await storage.getUser(req.session.userId);
    if (!user) {
      return res.status(401).json({ message: "Не авторизован" });
    }
    res.json({ id: user.id, username: user.username, role: user.role });
  });

  app.get("/api/brands", async (_req, res) => {
    const data = await storage.getBrands();
    res.json(data);
  });

  app.get("/api/brands/:id", async (req, res) => {
    const brand = await storage.getBrand(req.params.id);
    if (!brand) return res.status(404).json({ message: "Not found" });
    res.json(brand);
  });

  app.get("/api/categories", async (_req, res) => {
    const data = await storage.getCategories();
    res.json(data);
  });

  app.get("/api/categories/:id", async (req, res) => {
    const cat = await storage.getCategory(req.params.id);
    if (!cat) return res.status(404).json({ message: "Not found" });
    res.json(cat);
  });

  app.get("/api/products", async (_req, res) => {
    const data = await storage.getProducts();
    res.json(data);
  });

  app.get("/api/products/search", async (req, res) => {
    const q = req.query.q as string;
    if (!q || q.trim().length < 2) return res.json([]);
    const data = await storage.searchProducts(q.trim());
    res.json(data);
  });

  app.get("/api/products/bestsellers", async (_req, res) => {
    const data = await storage.getBestsellers();
    res.json(data);
  });

  app.get("/api/products/discounted", async (_req, res) => {
    const data = await storage.getDiscountedProducts();
    res.json(data);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  });

  app.get("/api/banners/:type", async (req, res) => {
    const data = await storage.getBannersByType(req.params.type);
    res.json(data);
  });

  app.get("/api/news", async (_req, res) => {
    const data = await storage.getNews();
    res.json(data);
  });

  app.get("/api/services", async (_req, res) => {
    const data = await storage.getServices();
    res.json(data);
  });

  // Admin routes — protected by auth
  app.use("/api/admin", requireAuth);

  app.post("/api/admin/brands", async (req, res) => {
    try {
      const validated = insertBrandSchema.parse(req.body);
      const brand = await storage.createBrand(validated);
      res.json(brand);
    } catch (e) {
      handleZodError(res, e);
    }
  });

  app.patch("/api/admin/brands/:id", async (req, res) => {
    try {
      const validated = insertBrandSchema.partial().parse(req.body);
      const updated = await storage.updateBrand(req.params.id, validated);
      if (!updated) return res.status(404).json({ message: "Не найдено" });
      res.json(updated);
    } catch (e) {
      handleZodError(res, e);
    }
  });

  app.delete("/api/admin/brands/:id", async (req, res) => {
    await storage.deleteBrand(req.params.id);
    res.json({ ok: true });
  });

  app.post("/api/admin/categories", async (req, res) => {
    try {
      const validated = insertCategorySchema.parse(req.body);
      const cat = await storage.createCategory(validated);
      res.json(cat);
    } catch (e) {
      handleZodError(res, e);
    }
  });

  app.patch("/api/admin/categories/:id", async (req, res) => {
    try {
      const validated = insertCategorySchema.partial().parse(req.body);
      const updated = await storage.updateCategory(req.params.id, validated);
      if (!updated) return res.status(404).json({ message: "Не найдено" });
      res.json(updated);
    } catch (e) {
      handleZodError(res, e);
    }
  });

  app.delete("/api/admin/categories/:id", async (req, res) => {
    await storage.deleteCategory(req.params.id);
    res.json({ ok: true });
  });

  app.post("/api/admin/products", async (req, res) => {
    try {
      const validated = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(validated);
      res.json(product);
    } catch (e) {
      handleZodError(res, e);
    }
  });

  app.patch("/api/admin/products/:id", async (req, res) => {
    try {
      const validated = insertProductSchema.partial().parse(req.body);
      const updated = await storage.updateProduct(req.params.id, validated);
      if (!updated) return res.status(404).json({ message: "Не найдено" });
      res.json(updated);
    } catch (e) {
      handleZodError(res, e);
    }
  });

  app.delete("/api/admin/products/:id", async (req, res) => {
    await storage.deleteProduct(req.params.id);
    res.json({ ok: true });
  });

  app.post("/api/admin/banners", async (req, res) => {
    try {
      const validated = insertBannerSchema.parse(req.body);
      const banner = await storage.createBanner(validated);
      res.json(banner);
    } catch (e) {
      handleZodError(res, e);
    }
  });

  app.patch("/api/admin/banners/:id", async (req, res) => {
    try {
      const validated = insertBannerSchema.partial().parse(req.body);
      const updated = await storage.updateBanner(req.params.id, validated);
      if (!updated) return res.status(404).json({ message: "Не найдено" });
      res.json(updated);
    } catch (e) {
      handleZodError(res, e);
    }
  });

  app.delete("/api/admin/banners/:id", async (req, res) => {
    await storage.deleteBanner(req.params.id);
    res.json({ ok: true });
  });

  app.post("/api/admin/news", async (req, res) => {
    try {
      const validated = insertNewsSchema.parse(req.body);
      const item = await storage.createNews(validated);
      res.json(item);
    } catch (e) {
      handleZodError(res, e);
    }
  });

  app.patch("/api/admin/news/:id", async (req, res) => {
    try {
      const validated = insertNewsSchema.partial().parse(req.body);
      const updated = await storage.updateNews(req.params.id, validated);
      if (!updated) return res.status(404).json({ message: "Не найдено" });
      res.json(updated);
    } catch (e) {
      handleZodError(res, e);
    }
  });

  app.delete("/api/admin/news/:id", async (req, res) => {
    await storage.deleteNews(req.params.id);
    res.json({ ok: true });
  });

  app.post("/api/admin/services", async (req, res) => {
    try {
      const validated = insertServiceSchema.parse(req.body);
      const service = await storage.createService(validated);
      res.json(service);
    } catch (e) {
      handleZodError(res, e);
    }
  });

  app.patch("/api/admin/services/:id", async (req, res) => {
    try {
      const validated = insertServiceSchema.partial().parse(req.body);
      const updated = await storage.updateService(req.params.id, validated);
      if (!updated) return res.status(404).json({ message: "Не найдено" });
      res.json(updated);
    } catch (e) {
      handleZodError(res, e);
    }
  });

  app.delete("/api/admin/services/:id", async (req, res) => {
    await storage.deleteService(req.params.id);
    res.json({ ok: true });
  });

  return httpServer;
}
