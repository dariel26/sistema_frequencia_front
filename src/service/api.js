import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
});

const apiSFE = {
    login: async (login, password) => await api.post("/api/v1/login", { login: login, senha: password }),
    infoUser: async (token) => await api.get("/api/v1/info-usuario", { headers: { token } }),
    listaCoordenadores: async (token) => await api.get("/api/v1/coordenador", { headers: { token } }),
    adicionaCoordenador: async (token, cs) => await api.post("/api/v1/coordenador", cs, { headers: { token } }),
    atualizarCoordenador: async (token, nome, papel, email) => await api.patch("/api/v1/coordenador/" + email, { nome, papel }, { headers: { token } }),
    deletaCoordenador: async (token, emails) => await api.post("/api/v1/coordenador/delete", emails, { headers: { token } }),
    listaPreceptor: async (token) => await api.get("/api/v1/preceptor", { headers: { token } }),
    adicionaPreceptor: async (token, ps) => await api.post("/api/v1/preceptor", ps, { headers: { token } }),
    atualizarPreceptor: async (token, nome, email) => await api.patch("/api/v1/preceptor/" + email, { nome }, { headers: { token } }),
    deletaPreceptor: async (token, emails) => await api.post("/api/v1/preceptor/delete", emails, { headers: { token } }),
    listaAluno: async (token) => await api.get("/api/v1/aluno", { headers: { token } }),
    adicionaAluno: async (token, as) => await api.post("/api/v1/aluno", as, { headers: { token } }),
    atualizarAluno: async (token, nome, matricula) => await api.patch("/api/v1/aluno/" + matricula, { nome }, { headers: { token } }),
    deletaAluno: async (token, matriculas) => await api.post("/api/v1/aluno/delete", matriculas, { headers: { token } }),
}

export default apiSFE;
