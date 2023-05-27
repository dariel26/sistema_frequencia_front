import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
});

const apiSFE = {
    login: async (login, password) => await api.post("/api/v1/login", { login: login, senha: password }),
    infoUser: async (token) => await api.get("/api/v1/info-usuario", { headers: { token } })
}

export default apiSFE;
