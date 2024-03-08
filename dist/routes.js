"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = require("express");
const add_item_js_1 = __importDefault(require("./controller/handle_cart/add_item.js"));
const delete_item_js_1 = __importDefault(require("./controller/handle_cart/delete_item.js"));
const error_handler_js_1 = __importDefault(require("./controller/middleware/error_handler.js"));
const try_catch_js_1 = __importDefault(require("./controller/utils/try_catch.js"));
const request_data_transformer_js_1 = __importDefault(require("./controller/middleware/request_data_transformer.js"));
const check_for_duplicit_record_js_1 = __importDefault(require("./controller/middleware/check_for_duplicit_record.js"));
const insert_records_js_1 = __importDefault(require("./controller/sql/insert_records.js"));
const update_records_js_1 = __importDefault(require("./controller/sql/update_records.js"));
const login_request_validation_js_1 = __importDefault(require("./controller/middleware/login_request_validation.js"));
const register_request_validation_js_1 = __importDefault(require("./controller/middleware/register_request_validation.js"));
const update_files_js_1 = __importDefault(require("./controller/file_handlers/updates/update_files.js"));
const save_files_js_1 = __importDefault(require("./controller/file_handlers/savers/save_files.js"));
const send_emails_js_1 = __importDefault(require("./controller/other/send_emails.js"));
const select_request_js_1 = __importDefault(require("./DB/select_request.js"));
const update_not_user_data_js_1 = __importDefault(require("./controller/file_handlers/updates/update_not_user_data.js"));
const update_admin_data_js_1 = __importDefault(require("./controller/file_handlers/updates/update_admin_data.js"));
const update_user_data_js_1 = __importDefault(require("./controller/file_handlers/updates/update_user_data.js"));
const empty_cart_js_1 = __importDefault(require("./controller/handle_cart/empty_cart.js"));
const refund_request_validation_js_1 = __importDefault(require("./controller/middleware/refund_request_validation.js"));
const write_json_js_1 = __importDefault(require("./controller/file_handlers/write_json.js"));
exports.router = (0, express_1.Router)();
exports.router.post('/login_request', request_data_transformer_js_1.default, login_request_validation_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, update_records_js_1.default)(["users"], [["login_status"]], [[["Active"]]], req.body.login_request_validation.user_id);
        const user_data = yield (0, select_request_js_1.default)("SELECT id, username, email, password, login_status FROM users WHERE id = ?", req.body.login_request_validation.user_id);
        const user_account_data = yield (0, select_request_js_1.default)("SELECT id, name, surname, phone, adress, city, postcode FROM user_data WHERE user_id = ?", req.body.login_request_validation.user_id);
        // if(req.body.login_request_validation.user_id == process.env.ADMIN_ID){
        //   await update_admin_data(req.body.login_request_validation.user_id)
        // }else{
        //   await udpade_user_data(req.body.login_request_validation.user_id)
        // }
        res.send({ msg: "user loged in", next_status: true, status: true, user_data: user_data, user_account_data: user_account_data });
    });
}));
exports.router.post('/logoff_request', request_data_transformer_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, update_records_js_1.default)(["users"], [["login_status"]], [[["Inactive"]]], req.body.record_id);
        const user_data = yield (0, select_request_js_1.default)("SELECT id, username, email, password, login_status FROM users WHERE id = ?", req.body.record_id);
        const user_account_data = yield (0, select_request_js_1.default)("SELECT id, name, surname, phone, adress, city, postcode FROM user_data WHERE user_id = ?", req.body.record_id);
        // await update_login_data(req.body.user_id)
        res.send({ msg: "user loged off", next_status: true, status: true, user_data: user_data, user_account_data: user_account_data });
    });
}));
exports.router.post('/register_request', request_data_transformer_js_1.default, register_request_validation_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const transformed_data = req.body.transformed_data;
        const record_id = yield (0, insert_records_js_1.default)(transformed_data.tables, transformed_data.columns, transformed_data.values);
        const user_data = yield (0, select_request_js_1.default)("SELECT id, username, email, password, login_status FROM users WHERE id = ?", [record_id.toString()]);
        const user_account_data = yield (0, select_request_js_1.default)("SELECT id, name, surname, phone, adress, city, postcode FROM user_data WHERE user_id = ?", [record_id.toString()]);
        // await udpade_user_data(Number(record_id))
        res.send({ msg: "user registred", next_status: true, status: true, user_data: user_data, user_account_data: user_account_data });
    });
}));
exports.router.post('/add_record', request_data_transformer_js_1.default, check_for_duplicit_record_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const transformed_data = req.body.transformed_data;
        var record_id = yield (0, insert_records_js_1.default)(transformed_data.tables, transformed_data.columns, transformed_data.values);
        if (req.files) {
            yield (0, save_files_js_1.default)("./public/images/" + JSON.parse(req.body.folder) + "/" + record_id, req.files);
        }
        if (req.body.user_id) {
            if (req.body.user_id == process.env.ADMIN_ID) {
                yield (0, update_admin_data_js_1.default)(req.body.user_id);
            }
            else {
                yield (0, update_user_data_js_1.default)(req.body.user_id);
            }
        }
        else {
            yield (0, update_not_user_data_js_1.default)();
        }
        if (req.body.order) {
            (0, empty_cart_js_1.default)();
        }
        res.send({ msg: "record added", next_status: true, status: true });
    });
}));
exports.router.post('/edit_record', request_data_transformer_js_1.default, check_for_duplicit_record_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const transformed_data = req.body.transformed_data;
        if (req.body.files_names_to_keep) {
            yield (0, update_records_js_1.default)(transformed_data.tables, transformed_data.columns, transformed_data.values, JSON.parse(req.body.record_id), JSON.parse(req.body.files_names_to_keep));
        }
        else {
            yield (0, update_records_js_1.default)(transformed_data.tables, transformed_data.columns, transformed_data.values, JSON.parse(req.body.record_id));
        }
        if (req.files) {
            yield (0, update_files_js_1.default)(JSON.parse(req.body.files_names_to_keep), JSON.parse(req.body.folder), JSON.parse(req.body.record_id), req.files);
        }
        else if (req.body.files_names_to_keep) {
            yield (0, update_files_js_1.default)(JSON.parse(req.body.files_names_to_keep), JSON.parse(req.body.folder), JSON.parse(req.body.record_id));
        }
        if (req.body.user_id) {
            if (req.body.user_id == process.env.ADMIN_ID) {
                yield (0, update_admin_data_js_1.default)(req.body.user_id);
            }
            else {
                yield (0, update_user_data_js_1.default)(req.body.user_id);
            }
        }
        else {
            yield (0, update_not_user_data_js_1.default)();
        }
        if (req.body.psw_change) {
            res.send({ msg: "password changed", next_status: true });
        }
        res.send({ msg: "record edited", next_status: true });
    });
}));
exports.router.post('/change_record_status', request_data_transformer_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const transformed_data = req.body.transformed_data;
        yield (0, update_records_js_1.default)(transformed_data.tables, transformed_data.columns, transformed_data.values, req.body.record_id);
        if (req.body.user_id) {
            if (req.body.user_id == process.env.ADMIN_ID) {
                yield (0, update_admin_data_js_1.default)(req.body.user_id);
            }
            else {
                yield (0, update_user_data_js_1.default)(req.body.user_id);
            }
        }
        else {
            yield (0, update_not_user_data_js_1.default)();
        }
        res.send({ msg: "status changed", next_status: true, status: true });
    });
}));
exports.router.post('/add_to_cart', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, add_item_js_1.default)(JSON.parse(req.body.product), JSON.parse(req.body.selected_size));
        res.send({ msg: "added to cart" });
    });
}));
exports.router.post('/delete_from_cart', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        (0, delete_item_js_1.default)(req.body.pozition);
        res.send({ msg: "deleted from cart" });
    });
}));
exports.router.post('/refund_request', request_data_transformer_js_1.default, check_for_duplicit_record_js_1.default, refund_request_validation_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var code = Math.floor(100000 + Math.random() * 900000).toString();
        (0, send_emails_js_1.default)([req.body.transformed_data.email], code);
        var refund_products = yield (0, select_request_js_1.default)("SELECT products.id, products.name, order_products.size, order_products.amount, order_products.prize FROM order_products JOIN products ON products.id = order_products.product_id WHERE order_id = ?;", req.body.order_data[0].id);
        if (req.body.user_id) {
            if (req.body.user_id == process.env.ADMIN_ID) {
                yield (0, update_admin_data_js_1.default)(req.body.user_id);
            }
            else {
                yield (0, update_user_data_js_1.default)(req.body.user_id);
            }
        }
        else {
            yield (0, update_not_user_data_js_1.default)();
        }
        res.send({ msg: "order found", next_status: true, status: true, code: code, data: { refunds: [req.body.order_data[0]], order_products: refund_products } });
    });
}));
exports.router.post('/send_aut_code', request_data_transformer_js_1.default, check_for_duplicit_record_js_1.default, (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var code = Math.floor(100000 + Math.random() * 900000).toString();
        (0, send_emails_js_1.default)([req.body.transformed_data.email], code);
        res.send({ msg: "order found", next_status: true, status: true, code: code, record_id: req.body.user_id_auth });
    });
}));
exports.router.get('/tet', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("prvni get request");
        res.send("vracim prvni request");
    });
}));
exports.router.get('/', (req, res) => {
    console.log("prvni get request");
    res.send("vracim prvni request");
});
exports.router.get('/test_request', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%';",
                "SELECT product_sizes.size, product_sizes.current_amount FROM product_sizes WHERE product_sizes.product_id = $ ;", "SELECT product_images.image_url FROM product_images WHERE product_images.product_id = $ ;"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_product_by_id', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND products.id = " + JSON.parse(req.body.id) + " AND product_images.image_url like '%_main.%';",
                "SELECT product_sizes.size, product_sizes.current_amount FROM product_sizes WHERE product_sizes.product_id = $ ;", "SELECT product_images.image_url FROM product_images WHERE product_images.product_id = $ ;"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_admin_collections', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active';",
                "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_admin_products', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT products.id, products.name as product_name, products.price, DATE_FORMAT(products.add_date, '%Y-%m-%d') as add_date, products.discount, products.description, product_images.image_url as 'url', collections.id as collection_id, collections.name as collection_name from products left join collections on collections.id = products.collection_id join product_images on product_images.product_id = products.id WHERE products.status = 'Active' AND product_images.image_url like '%_main.%';",
                "SELECT product_sizes.size, product_sizes.current_amount FROM product_sizes WHERE product_sizes.product_id = $ ;", "SELECT product_images.image_url FROM product_images WHERE product_images.product_id = $ ;"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_admin_orders', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT orders.id, orders.name, orders.surname, orders.email, orders.adress, orders.phone, orders.postcode, DATE_FORMAT(orders.add_date, '%Y-%m-%d') as add_date, orders.status FROM orders;",
                "SELECT order_products.id, order_products.product_id, order_products.size, order_products.amount, products.name, products.price, products.discount, products.collection_id, products.description FROM order_products JOIN products ON products.id = product_id WHERE order_id = $ ;"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.post('/get_collections', (0, try_catch_js_1.default)(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var data = yield Promise.all([(0, write_json_js_1.default)(["SELECT collections.id, collections.name, DATE_FORMAT(collections.add_date, '%Y-%m-%d') as add_date, collection_images.image_url FROM collections JOIN collection_images ON collection_images.collection_id = collections.id WHERE collection_images.image_url LIKE '%_main%' AND collections.status = 'Active';",
                "SELECT collection_images.image_url FROM collection_images WHERE collection_images.collection_id = $"])]);
        res.send(JSON.parse(data));
    });
}));
exports.router.use(error_handler_js_1.default);
