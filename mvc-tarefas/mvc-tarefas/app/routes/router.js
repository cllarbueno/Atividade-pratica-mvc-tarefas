const express = require("express");
const router = express.Router();
const moment = require("moment");
moment.locale('pt-br');
 
const { body, validationResult } = require("express-validator");
 
// IMPORT CORRIGIDO
const tarefasModel = require("../app/models/tarefasModel");
 
// LISTAR
router.get("/", async (req, res) => {
    res.locals.moment = moment;
    try {
        const lista = await tarefasModel.findAll();
        res.render("pages/index", { "linhasTabela": lista });
    } catch (error) {
        console.log(error);
    }
});
 
// NOVA TAREFA (FORM)
router.get("/nova-tarefa", (req, res) => {
    res.locals.moment = moment;
    res.render("pages/cadastro", {
        tarefa: {
            id_tarefa: "",
            nome_tarefa: "",
            prazo_tarefa: "",
            situacao_tarefa: 1,
            status: 1
        },
        tituloAba: "Nova Tarefa",
        tituloPagina: "Inserção de Tarefa",
        id_tarefa: "0"
    });
});
 
// EDITAR
router.get("/editar", async (req, res) => {
    res.locals.moment = moment;
    const id = req.query.id;
    try {
        const dadosTarefa = await tarefasModel.findById(id);
        res.render("pages/cadastro", {
            tarefa: dadosTarefa[0],
            tituloAba: "Edição de Tarefa",
            tituloPagina: "Alteração de Tarefa",
            id_tarefa: id
        });
    } catch (erro) {
        console.log(erro);
    }
});
 
// CRIAR COM VALIDAÇÃO
router.post("/nova-tarefa",
    body('tarefa').isLength({ min: 5, max: 45 }).withMessage("Nome inválido"),
    body('prazo').isDate().withMessage("Data inválida"),
    body('situacao').isInt({ min: 0, max: 4 }).withMessage("Situação inválida"),
 
    async (req, res) => {
 
        const erros = validationResult(req);
 
        if (!erros.isEmpty()) {
            return res.send(erros.array());
        }
 
        let dadosInsert = {
            nome: req.body.tarefa,
            prazo: req.body.prazo,
            situacao: req.body.situacao
        };
 
        try {
            await tarefasModel.create(dadosInsert);
            res.redirect("/");
        } catch (erro) {
            console.log(erro);
        }
    }
);
 
// EXCLUSÃO LÓGICA
router.get("/excluir-logico/:id", async (req, res) => {
    try {
        await tarefasModel.excluirLogico(req.params.id);
        res.redirect("/");
    } catch (erro) {
        console.log(erro);
    }
});
 
// EXCLUSÃO FÍSICA
router.get("/excluir-fisico/:id", async (req, res) => {
    try {
        await tarefasModel.excluirFisico(req.params.id);
        res.redirect("/");
    } catch (erro) {
        console.log(erro);
    }
});
 
module.exports = router;