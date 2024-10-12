import create from "zustand";
import { getUserHome } from "../api/userHomeApi";

const useUserHome = create((set) => ({
  userHome: {},
  fetchGetUserHome: async (userId) => {
    try {
      const res = await getUserHome(userId);
      console.log("User Home", res.data);
      if (res && res.status === 200) {
        set({ userHome: res.data });
      }
    } catch (err) {
      console.log("Error get userhome", err);
    }
  },
}));
export default useUserHome;
