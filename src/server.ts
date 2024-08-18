import Fastify from "fastify";
import { getUser } from "./routes/user/get-user";
import { createUser } from "./routes/user/create-user";
import { updateUser } from "./routes/user/update-user";
import { deleteUser } from "./routes/user/delete-user";
import { getListCategory } from "./routes/category/get-list-category";
import { getInformationCategory } from "./routes/category/get-information-category";
import { createCategory } from "./routes/category/create-category";
import { updateCategory } from "./routes/category/update-category";
import { deleteCategory } from "./routes/category/delete-category";
import { getListProduct } from "./routes/product/get-list-product";
import { getInformationProduct } from "./routes/product/get-information-product";
import { createProduct } from "./routes/product/create-product";
import { updateProduct } from "./routes/product/update-product";
import { deleteProduct } from "./routes/product/delete-product";

const app = Fastify();

app.register(getUser);
app.register(createUser);
app.register(updateUser);
app.register(deleteUser);

app.register(getListCategory);
app.register(getInformationCategory);
app.register(createCategory);
app.register(updateCategory);
app.register(deleteCategory);

app.register(getListProduct);
app.register(getInformationProduct);
app.register(createProduct);
app.register(updateProduct);
app.register(deleteProduct);

app.listen({ port: 3333 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
