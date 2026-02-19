import {
  type User, type InsertUser,
  type Brand, type InsertBrand,
  type Category, type InsertCategory,
  type Product, type InsertProduct,
  type Banner, type InsertBanner,
  type News, type InsertNews,
  type Service, type InsertService,
  users, brands, categories, products, banners, news, services
} from "@shared/schema";
import { db } from "./db";
import { eq, and, gt, desc, asc, or, ilike } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getBrands(): Promise<Brand[]>;
  getBrand(id: string): Promise<Brand | undefined>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: string, brand: Partial<InsertBrand>): Promise<Brand>;
  deleteBrand(id: string): Promise<void>;

  getCategories(): Promise<Category[]>;
  getCategory(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category>;
  deleteCategory(id: string): Promise<void>;

  getProducts(): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  getProduct(id: string): Promise<Product | undefined>;
  getBestsellers(): Promise<Product[]>;
  getDiscountedProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  getBannersByType(type: string): Promise<Banner[]>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBanner(id: string, banner: Partial<InsertBanner>): Promise<Banner>;
  deleteBanner(id: string): Promise<void>;

  getNews(): Promise<News[]>;
  createNews(item: InsertNews): Promise<News>;
  updateNews(id: string, item: Partial<InsertNews>): Promise<News>;
  deleteNews(id: string): Promise<void>;

  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [created] = await db.insert(users).values(user).returning();
    return created;
  }

  async getBrands(): Promise<Brand[]> {
    return db.select().from(brands).orderBy(asc(brands.sortOrder));
  }

  async getBrand(id: string): Promise<Brand | undefined> {
    const [brand] = await db.select().from(brands).where(eq(brands.id, id));
    return brand;
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const [created] = await db.insert(brands).values(brand).returning();
    return created;
  }

  async updateBrand(id: string, brand: Partial<InsertBrand>): Promise<Brand> {
    const [updated] = await db.update(brands).set(brand).where(eq(brands.id, id)).returning();
    return updated;
  }

  async deleteBrand(id: string): Promise<void> {
    await db.delete(brands).where(eq(brands.id, id));
  }

  async getCategories(): Promise<Category[]> {
    return db.select().from(categories).orderBy(asc(categories.sortOrder));
  }

  async getCategory(id: string): Promise<Category | undefined> {
    const [cat] = await db.select().from(categories).where(eq(categories.id, id));
    return cat;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(category).returning();
    return created;
  }

  async updateCategory(id: string, category: Partial<InsertCategory>): Promise<Category> {
    const [updated] = await db.update(categories).set(category).where(eq(categories.id, id)).returning();
    return updated;
  }

  async deleteCategory(id: string): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  async getProducts(): Promise<Product[]> {
    return db.select().from(products);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const q = `%${query.toLowerCase()}%`;
    return db.select().from(products).where(
      or(
        ilike(products.name, q),
        ilike(products.description, q),
        ilike(products.shortSpecs, q),
      )
    );
  }

  async getProduct(id: string): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async getBestsellers(): Promise<Product[]> {
    return db.select().from(products).where(eq(products.isBestseller, true));
  }

  async getDiscountedProducts(): Promise<Product[]> {
    return db.select().from(products).where(gt(products.discountPercent, 0));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }

  async updateProduct(id: string, product: Partial<InsertProduct>): Promise<Product> {
    const [updated] = await db.update(products).set(product).where(eq(products.id, id)).returning();
    return updated;
  }

  async deleteProduct(id: string): Promise<void> {
    await db.delete(products).where(eq(products.id, id));
  }

  async getBannersByType(type: string): Promise<Banner[]> {
    return db.select().from(banners).where(
      and(eq(banners.type, type), eq(banners.isActive, true))
    ).orderBy(asc(banners.sortOrder));
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const [created] = await db.insert(banners).values(banner).returning();
    return created;
  }

  async updateBanner(id: string, banner: Partial<InsertBanner>): Promise<Banner> {
    const [updated] = await db.update(banners).set(banner).where(eq(banners.id, id)).returning();
    return updated;
  }

  async deleteBanner(id: string): Promise<void> {
    await db.delete(banners).where(eq(banners.id, id));
  }

  async getNews(): Promise<News[]> {
    return db.select().from(news).orderBy(desc(news.date));
  }

  async createNews(item: InsertNews): Promise<News> {
    const [created] = await db.insert(news).values(item).returning();
    return created;
  }

  async updateNews(id: string, item: Partial<InsertNews>): Promise<News> {
    const [updated] = await db.update(news).set(item).where(eq(news.id, id)).returning();
    return updated;
  }

  async deleteNews(id: string): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  async getServices(): Promise<Service[]> {
    return db.select().from(services).orderBy(asc(services.sortOrder));
  }

  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service> {
    const [updated] = await db.update(services).set(service).where(eq(services.id, id)).returning();
    return updated;
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }
}

export const storage = new DatabaseStorage();
