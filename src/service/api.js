import axios from "axios";

const api = axios.create({
    baseURL: process.env.REACT_APP_API,
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

    //SUBGRUPOS
    listarSubgrupos: async (token) => await api.get("/api/v1/subgrupo", { headers: { token } }),
    adicionarSubgrupos: async (token, subgrupos) => await api.post("/api/v1/subgrupo", { subgrupos }, { headers: { token } }),
    deletarSubgrupos: async (token, ids) => await api.delete("/api/v1/subgrupo/" + ids.join(","), { headers: { token } }),

    //ESTAGIOS
    listarEstagios: async (token) => await api.get("/api/v1/estagio", { headers: { token } }),
    adicionarEstagios: async (token, estagios) => await api.post("/api/v1/estagio", { estagios }, { headers: { token } }),
    deletarEstagios: async (token, ids) => await api.delete("/api/v1/estagio/" + ids.join(","), { headers: { token } }),

    //COORD-ESTAGIO
    adicionarCoordenadoresAEstagios: async (token, dados) => await api.post("/api/v1/coord-estagio", { dados }, { headers: { token } }),

    //ESTAGIO-GRUPO
    adicionarGruposAEstagios: async (token, dados) => await api.post("/api/v1/estagio-grupo", { dados }, { headers: { token } }),
    editarGrupoEmEstagio: async (token, novosDados) => await api.put("/api/v1/estagio-grupo", { novosDados }, { headers: { token } }),
    deletarGruposDeEstagios: async (token, ids) => await api.delete("/api/v1/estagio-grupo/" + ids.join(","), { headers: { token } }),

    //ALUNO-SUBGRUPO
    adicionarAlunosASubgrupos: async (token, dados) => await api.post("/api/v1/aluno-subgrupo", { dados }, { headers: { token } }),
    deletarAlunosDeSubgrupos: async (token, ids) => await api.delete("/api/v1/aluno-subgrupo/" + ids.join(","), { headers: { token } }),

    //LOCAL
    listarLocais: async (token) => await api.get("/api/v1/local", { headers: { token } }),
    adicionarLocais: async (token, locais) => await api.post("/api/v1/local", { locais }, { headers: { token } }),
    deletarLocais: async (token, ids) => await api.delete("/api/v1/local/" + ids.join(","), { headers: { token } }),
    editarLocais: async (token, novosDados) => await api.put("/api/v1/local", { novosDados }, { headers: { token } }),

    //ATIVIDADE
    listarAtividades: async (token) => await api.get("/api/v1/atividade", { headers: { token } }),
    adicionarAtividades: async (token, atividades) => await api.post("/api/v1/atividade", { atividades }, { headers: { token } }),
    deletarAtividades: async (token, ids) => await api.delete("/api/v1/atividade/" + ids.join(","), { headers: { token } }),
    editarAtividades: async (token, novosDados) => await api.put("/api/v1/atividade", { novosDados }, { headers: { token } }),

    //PREC-ATIVIADE
    adicionarPreceptoresAAtividades: async (token, dados) => await api.post("/api/v1/prec-atividade", { dados }, { headers: { token } }),

    //LOCAL-ATIVIDADE
    adicionarLocaisAAtividades: async (token, dados) => await api.post("/api/v1/local-atividade", { dados }, { headers: { token } }),

    //DATA-ATIVIDADE
    adicionarDatasAAtividade: async (token, dados) => await api.post("/api/v1/data-atividade", { dados }, { headers: { token } }),
    editarDatasDeAtividade: async (token, novosDados) => await api.put("/api/v1/data-atividade", { novosDados }, { headers: { token } }),

    //ALUNO-DATA-ATIVIDADE
    adicionarAlunoADataAtividade: async (token, dados) => await api.post("/api/v1/aluno-data-atividade", { dados }, { headers: { token } }),

}

export default apiSFE;
