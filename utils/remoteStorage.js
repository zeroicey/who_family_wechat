import { apiSetItem, apiGetItem, apiRemoveItem } from '../api/remote';

/**
 * @description 将数据存储在远程服务器中
 * @param {string} key 本地缓存中的指定的 key
 * @param {any} value 需要缓存的内容
 */
export const setRemoteStorageSync = (key, value) => {
    const data = JSON.stringify(value);
    return apiSetItem(key, data);
};

/**
 * @description 从远程服务器中获取指定 key 对应的内容
 * @param {string} key 本地缓存中的指定的 key
 * @returns {any} key 对应的内容
 */
export const getRemoteStorageSync = async (key) => {
    const res = await apiGetItem(key);
    if (res && res.data && res.data.value) {
        try {
            return JSON.parse(res.data.value);
        } catch (e) {
            return res.data.value;

        }
    }
    return null;
};

/**
 * @description 从远程服务器中移除指定 key
 * @param {string} key 本地缓存中的指定的 key
 */
export const removeRemoteStorageSync = (key) => {
    return apiRemoveItem(key);
};