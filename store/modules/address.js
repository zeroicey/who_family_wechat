import { getRemoteStorageSync, setRemoteStorageSync } from "../../utils/remoteStorage";

const state = {
  addresses: getRemoteStorageSync("addresses") || [],
};

const getters = {
  get_addresses: (state) => state.addresses,

  get_default_address: (state) => {
    return state.addresses.find((address) => address.isDefault);
  },
};

const mutations = {
  set_addresses(state, addresses) {
    state.addresses = addresses;
    setRemoteStorageSync("addresses", state.addresses);
  },

  add_address(state, addressPayload) {
    // Ensure new address has a unique ID
    const newId =
      state.addresses.length > 0
        ? Math.max(...state.addresses.map((a) => a.id)) + 1
        : 1;
    const newAddress = {
      id: newId,
      alias: addressPayload.alias,
      fullAddress: addressPayload.fullAddress,
      name: addressPayload.name,
      phone: addressPayload.phone,
      isDefault: addressPayload.isDefault || false,
    };

    // If this new address is set to be the default, then unset all other addresses.
    if (newAddress.isDefault) {
      state.addresses.forEach((a) => (a.isDefault = false));
    } else if (state.addresses.every((a) => !a.isDefault)) {
      // If no default address exists, make this one the default.
      newAddress.isDefault = true;
    }

    state.addresses.unshift(newAddress);
    setRemoteStorageSync("addresses", state.addresses);
  },

  update_address(state, updatedAddress) {
    const index = state.addresses.findIndex(
      (address) => address.id === updatedAddress.id
    );
    if (index !== -1) {
      const wasDefault = state.addresses[index].isDefault;

      // If setting a new default, unset others.
      if (updatedAddress.isDefault) {
        state.addresses.forEach((a) => (a.isDefault = false));
      }

      state.addresses.splice(index, 1, updatedAddress);

      // If the address that was default is no longer default, and no other address is default,
      // make the first address the new default.
      if (
        wasDefault &&
        !updatedAddress.isDefault &&
        state.addresses.length > 0 &&
        state.addresses.every((a) => !a.isDefault)
      ) {
        state.addresses[0].isDefault = true;
      }

      setRemoteStorageSync("addresses", state.addresses);
    }
  },

  delete_address(state, addressId) {
    const index = state.addresses.findIndex(
      (address) => address.id === addressId
    );
    if (index === -1) {
      return;
    }

    const wasDefault = state.addresses[index].isDefault;
    state.addresses.splice(index, 1);

    // If the deleted address was the default, and there are still addresses left,
    // make the first one the new default.
    if (
      wasDefault &&
      state.addresses.length > 0 &&
      state.addresses.every((a) => !a.isDefault)
    ) {
      state.addresses[0].isDefault = true;
    }
    setRemoteStorageSync("addresses", state.addresses);
  },

  set_default_address(state, addressId) {
    state.addresses.forEach((address) => {
      address.isDefault = address.id === addressId;
    });
    setRemoteStorageSync("addresses", state.addresses);
  },
};

const actions = {
  async load_addresses({ commit }) {
    const addresses = await getRemoteStorageSync("addresses") || [];
    commit("set_addresses", addresses);
    console.log("[地址模块] 地址加载成功");
  },

  add_address({ commit }, address) {
    commit("add_address", address);
    console.log("[地址模块] 地址添加成功");
  },

  update_address({ commit }, address) {
    commit("update_address", address);
    console.log("[地址模块] 地址更新成功");
  },

  delete_address({ commit }, addressId) {
    commit("delete_address", addressId);
    console.log("[地址模块] 地址删除成功");
  },

  set_default_address({ commit }, addressId) {
    commit("set_default_address", addressId);
    console.log("[地址模块] 默认地址设置成功");
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
