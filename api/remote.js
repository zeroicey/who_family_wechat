import request from "./request";

export const apiSetItem = async (key, value) => {
    return request.post("/storage/setItem", { key, value });
};

export const apiGetItem = async (key) => {
    return request.post("/storage/getItem", { key });
};

export const apiRemoveItem = async (key) => {
    return request.post("/storage/removeItem", { key });
};

