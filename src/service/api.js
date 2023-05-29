import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
});

const apiSFE = {
    login: async (login, password) => await api.post("/api/v1/login", { login: login, senha: password }),
    infoUser: async (token) => await api.get("/api/v1/info-usuario", { headers: { token } }),
    listaCoordenadores: async (token) => await api.get("/api/v1/coordenador", { headers: { token } }),
    adicionaCoordenador: async (token, c) => await api.post("/api/v1/coordenador", c, { headers: { token } }),
    atualizarCoordenador: async (token, nome, papel, email) => await api.patch("/api/v1/coordenador/" + email, { nome, papel }, { headers: { token } }),
    deletaCoordenador: async (token, email) => await api.delete("/api/v1/coordenador/" + email, { headers: { token } }),
}

export default apiSFE;
