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
import { randomUUID } from "crypto";
import express from "express";
import bcrypt from "bcryptjs";
import type { Request, Response, NextFunction } from "express";

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
  app.use("/uploads", express.static("uploads"));

  app.post("/api/upload", requireAuth, upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "Файл не загружен" });
    }
    res.json({ url: `/uploads/${req.file.filename}` });
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

  app.delete("/api/admin/services/:id", async (req, res) => {
    await storage.deleteService(req.params.id);
    res.json({ ok: true });
  });

  return httpServer;
}
