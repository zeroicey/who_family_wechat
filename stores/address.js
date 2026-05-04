import { defineStore } from "pinia";
import {
  getRemoteStorageSync,
  setRemoteStorageSync,
} from "@/utils/remoteStorage";

export const useAddressStore = defineStore("address", {
  state: () => ({
    addresses: [],
  }),

  getters: {
    get_addresses: (state) => state.addresses,

    get_default_address: (state) => {
      return state.addresses.find((address) => address.isDefault);
    },
  },

  actions: {
    set_addresses(addresses) {
      this.addresses = addresses;
      setRemoteStorageSync("addresses", this.addresses);
    },

    add_address(addressPayload) {
      const newId =
        this.addresses.length > 0
          ? Math.max(...this.addresses.map((address) => address.id)) + 1
          : 1;
      const newAddress = {
        id: newId,
        alias: addressPayload.alias,
        fullAddress: addressPayload.fullAddress,
        name: addressPayload.name,
        phone: addressPayload.phone,
        isDefault: addressPayload.isDefault || false,
      };

      if (newAddress.isDefault) {
        this.addresses.forEach((address) => {
          address.isDefault = false;
        });
      } else if (this.addresses.every((address) => !address.isDefault)) {
        newAddress.isDefault = true;
      }

      this.addresses.unshift(newAddress);
      setRemoteStorageSync("addresses", this.addresses);
      console.log("[地址模块] 地址添加成功");
    },

    update_address(updatedAddress) {
      const index = this.addresses.findIndex(
        (address) => address.id === updatedAddress.id
      );
      if (index !== -1) {
        const wasDefault = this.addresses[index].isDefault;

        if (updatedAddress.isDefault) {
          this.addresses.forEach((address) => {
            address.isDefault = false;
          });
        }

        this.addresses.splice(index, 1, updatedAddress);

        if (
          wasDefault &&
          !updatedAddress.isDefault &&
          this.addresses.length > 0 &&
          this.addresses.every((address) => !address.isDefault)
        ) {
          this.addresses[0].isDefault = true;
        }

        setRemoteStorageSync("addresses", this.addresses);
      }
      console.log("[地址模块] 地址更新成功");
    },

    delete_address(addressId) {
      const index = this.addresses.findIndex(
        (address) => address.id === addressId
      );
      if (index === -1) {
        return;
      }

      const wasDefault = this.addresses[index].isDefault;
      this.addresses.splice(index, 1);

      if (
        wasDefault &&
        this.addresses.length > 0 &&
        this.addresses.every((address) => !address.isDefault)
      ) {
        this.addresses[0].isDefault = true;
      }
      setRemoteStorageSync("addresses", this.addresses);
      console.log("[地址模块] 地址删除成功");
    },

    set_default_address(addressId) {
      this.addresses.forEach((address) => {
        address.isDefault = address.id === addressId;
      });
      setRemoteStorageSync("addresses", this.addresses);
      console.log("[地址模块] 默认地址设置成功");
    },

    async load_addresses() {
      const addresses = (await getRemoteStorageSync("addresses")) || [];
      this.set_addresses(addresses);
      console.log("[地址模块] 地址加载成功");
    },
  },
});

export default useAddressStore;
