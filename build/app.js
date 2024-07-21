"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const port = 3456;
const path = require('path');
const uploadsDirectory = path.join(__dirname, 'uploads');
const categoriesRoute = require("./routes/CategoriesRoute");
const usersRoute = require("./routes/UsersRoute");
const rolesRoute = require("./routes/RolesRoute");
const dashBoard = require("./routes/DashBoardRoute");
//kha
const locationRoute = require("./routes/LocationRoute");
const tourRoute = require("./routes/TourRoute");
const orderRoute = require("./routes/OrderRoute");
//trang
const permissionsRouter = require("./routes/PermissionsRouter");
const customersRouter = require("./routes/CustomersRouter");
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use('/uploads', express_1.default.static(uploadsDirectory));
app.get("/", (req, res) => {
    res.send("hello");
});
app.listen(port, () => {
    console.log("Start project success");
});
app.use("/users", usersRoute);
app.use("/roles", rolesRoute);
app.use("/dashboard", dashBoard);
//kha
app.use("/locations", locationRoute);
app.use("/tours", tourRoute);
app.use("/orders", orderRoute);
//trang
app.use("/permissions", permissionsRouter);
app.use("/customers", customersRouter);
app.use("/categories", categoriesRoute);
