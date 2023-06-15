import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000",
});

const apiSFE = {
    login: async (login, password) => await api.post("/api/v1/login", { login: login, senha: password }),

    infoUser: async (token) => await api.get("/api/v1/info-usuario", { headers: { token } }),
    usuarioPadrao: async (token, credencias) => await api.post("/api/v1/info-usuario/padrao", credencias, { headers: { token } }),
    mudarSenha: async (token, senha) => await api.post("/api/v1/info-usuario/mudar-senha", { senha }, { headers: { token } }),

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

    listaGrupos: async (token) => await api.get("/api/v1/grupo", { headers: { token } }),
    adicionaGrupo: async (token, grupo) => await api.post("/api/v1/grupo", grupo, { headers: { token } }),
    incluirEmGrupo: async (token, matricula, id_grupo) => await api.post("/api/v1/aluno-grupo/" + matricula, { id_grupo }, { headers: { token } }),
    removeGrupo: async (token, id_grupo) => await api.delete("/api/v1/grupo/" + id_grupo, { headers: { token } }),


    listaEstagios: async (token) => await api.get("/api/v1/estagio", { headers: { token } }),
    adicionaEstagio: async (token, estagio) => await api.post("/api/v1/estagio", estagio, { headers: { token } }),
    removeEstagio: async (token, id_estagio) => await api.delete("/api/v1/estagio/" + id_estagio, { headers: { token } }),
    trocarCoordenadorEstagio: async (token, id_estagio, id_coordenador) => await api.post("/api/v1/coord-estagio", { id_coordenador, id_estagio }, { headers: { token } }),
    associarGrupoEstagio: async (token, grupoEstagio) => await api.post("/api/v1/estagio-grupo", grupoEstagio, { headers: { token } }),
    desAssociarGrupoEstagio: async (token, id_grupo, id_estagio) => await api.delete("/api/v1/estagio-grupo/grupo/" + id_grupo + "/estagio/" + id_estagio, { headers: { token } }),

    adicionaAtividade: async (token, atividade) => await api.post("/api/v1/atividade", atividade, { headers: { token } }),
    deletarAtividade: async (token, id_atividade) => await api.delete("/api/v1/atividade/" + id_atividade, { headers: { token } }),
    
    listaLugares: async (token) => await api.get("/api/v1/local", { headers: { token } }),
    adicionaLugar: async (token, place) => await api.post("/api/v1/local", place, { headers: { token } }),
    deletaLugar: async (token, id) => await api.delete("/api/v1/local/" + id, { headers: { token } }),
}

export default apiSFE;
