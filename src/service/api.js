import axios from "axios";

const api = axios.create({
    baseURL: "http://192.168.0.103:5000",
});

const apiSFE = {
    //ALUNOS
    listarAlunos: async (token) => await api.get("/api/v1/aluno", { headers: { token } }),
    adicionarAlunos: async (token, alunos) => await api.post("/api/v1/aluno", { alunos }, { headers: { token } }),
    deletarAlunos: async (token, ids) => await api.delete("/api/v1/aluno/" + ids.join(","), { headers: { token } }),
    editarAlunos: async (token, novosDados) => await api.put("/api/v1/aluno", { novosDados }, { headers: { token } }),

    //COORDENADORES
    listarCoordenadores: async (token) => await api.get("/api/v1/coordenador", { headers: { token } }),
    adicionarCoordenadores: async (token, coordenadores) => await api.post("/api/v1/coordenador", { coordenadores }, { headers: { token } }),
    deletarCoordenadores: async (token, ids) => await api.delete("/api/v1/coordenador/" + ids.join(","), { headers: { token } }),
    editarCoordenadores: async (token, novosDados) => await api.put("/api/v1/coordenador", { novosDados }, { headers: { token } }),

    //PRECEPTORES
    listarPreceptores: async (token) => await api.get("/api/v1/preceptor", { headers: { token } }),
    adicionarPreceptores: async (token, preceptores) => await api.post("/api/v1/preceptor", { preceptores }, { headers: { token } }),
    deletarPreceptores: async (token, ids) => await api.delete("/api/v1/preceptor/" + ids.join(","), { headers: { token } }),
    editatPreceptores: async (token, novosDados) => await api.put("/api/v1/preceptor", { novosDados }, { headers: { token } }),

    //USUARIO
    infoUsuario: async (token) => await api.get("/api/v1/usuario/info", { headers: { token } }),
    usuarioPadrao: async (token) => await api.get("/api/v1/usuario/padrao", { headers: { token } }),
    mudarSenha: async (token, novosDados) => await api.post("/api/v1/usuario/senha", { novosDados }, { headers: { token } }),
    login: async (login, password) => await api.post("/api/v1/login", { login: login, senha: password }),

    //GRUPOS
    listarGrupos: async (token) => await api.get("/api/v1/grupo", { headers: { token } }),
    adicionarGrupos: async (token, grupos) => await api.post("/api/v1/grupo", { grupos }, { headers: { token } }),
    deletarGrupos: async (token, ids) => await api.delete("/api/v1/grupo/" + ids.join(","), { headers: { token } }),

    //ESTAGIOS
    listarEstagios: async (token) => await api.get("/api/v1/estagio", { headers: { token } }),
    adicionarEstagios: async (token, estagios) => await api.post("/api/v1/estagio", { estagios }, { headers: { token } }),
    deletarEstagios: async (token, ids) => await api.delete("/api/v1/estagio/" + ids.join(","), { headers: { token } }),

    //COORD-ESTAGIO
    adicionarCoordenadoresAEstagios: async (token, dados) => await api.post("/api/v1/coord-estagio", { dados }, { headers: { token } }),

    //ESTAGIO-GRUPO
    adicionarGruposAEstagios: async (token, dados) => await api.post("/api/v1/estagio-grupo", { dados }, { headers: { token } }),
    deletarGruposDeEstagios: async (token, ids) => await api.delete("/api/v1/estagio-grupo/" + ids.join(","), { headers: { token } }),

    //ATIVIDADES
    listarAtividades: async (token) => await api.get("/api/v1/atividade", { headers: { token } }),
    adicionarAtividades: async (token, atividades) => await api.post("/api/v1/atividade", { atividades }, { headers: { token } }),
    deletarAtividades: async (token, ids) => await api.delete("/api/v1/atividade/" + ids.join(","), { headers: { token } }),
    editarAtividades: async (token, novosDados) => await api.put("/api/v1/atividade", { novosDados }, { headers: { token } }),

    listaLugares: async (token) => await api.get("/api/v1/local", { headers: { token } }),
    adicionaLugar: async (token, place) => await api.post("/api/v1/local", place, { headers: { token } }),
    deletaLugar: async (token, id) => await api.delete("/api/v1/local/" + id, { headers: { token } }),
}

export default apiSFE;
