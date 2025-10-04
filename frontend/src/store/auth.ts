import { create } from "zustand";
import api from "../api/axios";

type User = { id:number; username:string; email:string; role:string } | null;

type State = {
  user: User;
  loading: boolean;
  login: (username:string, password:string) => Promise<void>;
  register: (username:string, password:string, email?:string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
};

export const useAuth = create<State>((set) => ({
  user: null,
  loading: false,
  async login(username, password) {
    set({ loading: true });
    const { data } = await api.post("/auth/token", { username, password });
    localStorage.setItem("tokens", JSON.stringify(data));
    await (useAuth.getState().fetchMe());
    set({ loading: false });
  },
  async register(username, password, email) {
    set({ loading: true });
    await api.post("/auth/register", { username, password, email });
    await (useAuth.getState().login(username, password));
    set({ loading: false });
  },
  logout() {
    localStorage.removeItem("tokens");
    set({ user: null });
  },
  async fetchMe() {
    try { const { data } = await api.get("/auth/me"); set({ user: data }); }
    catch { set({ user: null }); }
  },
}));
