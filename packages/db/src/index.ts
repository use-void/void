// packages/db/src/index.ts

// 1. Export Connection & Helper methods
export * from "./connection";

// 2. Export Models
export * from "./models/user.model";
export * from "./models/store-config.model";
export * from "./models/product.model";
export * from "./models/order.model";
export * from "./models/integration.model";
export * from "./models/category.model";

// 3. Setup (سنقوم بتحديثه)
export * from "./setup";

// 4. Utils
import { Types } from "mongoose";
export type ObjectIdType = Types.ObjectId;