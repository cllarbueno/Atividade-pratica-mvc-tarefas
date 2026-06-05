const express = require("express");
const router = express.Router();
const moment = require("moment");
moment.locale('pt-br');
//requisição o Models
//usar chaves para envolver o objeto
const { tarefasModel } = require("../models/tarefasModel");


router.get("/", async (req, res) => {
    res.locals.moment = moment;
    try {
        const lista = await tarefasModel.findAll();
        // console.table(lista);
        res.render("pages/index", { "linhasTabela": lista });

    } catch (error) {
        console.log(error);
    }


});


router.get("/nova-tarefa", (req, res) => {
    res.render("pages/cadastro",{tituloAba:"Nova Tarefa",
        tituloPagina:"Inserção de Tarefa",id_tarefa:"0"});
})

router.get("/editar", async (req, res)=>{
    res.locals.moment = moment;
    const id = req.query.id;
    try{
        const dadosTarefas = await tarefasModel.findbayId(id);
        console.log(dadosTarefas[0]);
        res.render("pages/cadastro",{tituloAba:"Edição de Tarefa",
            tarefa:dadosTarefas[0],
            tituloAba: "Edição de Tarefa",
            tituloPagina:"Alteração de Tarefa",id_tarefa:id});
})



router.post("/nova-tarefa", async (req, res) => {

    // adicionar o express validator
    let dadosInsert = {
        nome: req.body.tarefa,
        prazo: req.body.prazo,
        situacao: req.body.situacao
    }

    try{
        const insert = await tarefasModel.create(dadosInsert);
        console.log(insert);
        res.redirect("/");
    }catch(erro){
        console.log(erro);
    }


})

router.get("/teste-create", async (req, res) => {

    let dadosInsert = {
        nome: "remover virus do PC 2 do 2B",
        prazo: "2026-04-10"
    }
    try {
        const resultInsert =
            await tarefasModel.create(dadosInsert);

        console.log(resultInsert);
        res.send("insert realizado");
    } catch (erro) {
        console.log(erro);
    }

});

router.get("/teste-delete", async (req, res) => {
    // let codigo = 4;
    // try{
    //     const resultDelete = 
    //         await pool.query("delete from tarefas where id_tarefa = ? ", [codigo]); 

    //      console.log(resultDelete);
    //      res.send("Delete físico realizado");       
    // }catch(erro){
    //     console.log(erro);
    // }

});

router.get("/teste-delete-logico", async (req, res) => {
    // let codigo = 6;
    // try{
    //     const resultDelete = 
    //         await pool.query("update tarefas set status_tarefa = 0 where id_tarefa = ? ", [codigo]); 

    //      console.log(resultDelete);
    //      res.send("Delete físico realizado");       
    // }catch(erro){
    //     console.log(erro);
    // }

});




module.exports = router;