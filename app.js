const express = require('express')            //@ módulo que permite criar um servidor web para criação de APIs
const app = express()                         //@ cria o servidor da aplicação
const porta = 3000;                           //@ define a porta para monitorar
const NodeCache = require("node-cache");      //@ cria o cache no servidor
const cache = new NodeCache({ stdTTL: 300 }); // Tempo de vida 300 segundos

var msg = 'Servidor on-line. Categorias disponíveis: "animais, carros, pessoas"'

// Categorias e dados
let pessoas = [
    { id: 1, nome: "Marcelo" },
    { id: 2, nome: "João" },
    { id: 3, nome: "Maria" }
];
let carros = [
    { id: 1, modelo: "Fusca" },
    { id: 2, modelo: "Gol" },
    { id: 3, modelo: "Palio" }
];
let animais = [
    { id: 1, nome: "Cachorro" },
    { id: 2, nome: "Gato" },
    { id: 3, nome: "Papagaio" }
];

// Função que pega os dados presentes nas categorias
function pegaDados(categoria) {
    let dados;

    switch (categoria) {
        case 'pessoas':
            dados = pessoas;
            break;
        case 'carros':
            dados = carros;
            break;
        case 'animais':
            dados = animais;
            break;
        default:
            dados = null;
    }
    return dados;
}
// Função que pega as categorias
function busCategoria(categoria) {
    const cacheKey = `cache_${categoria}`;
    return cache.get(cacheKey);
}
function setCachedData(categoria, dados) {
    const cacheKey = `cache_${categoria}`;
    cache.set(cacheKey, dados);
}
// Função que pega as categorias e ID
    function busCategoriaId(categoria, id) {
    const cachedData = busCategoria(categoria);

    if (cachedData) {
        const elemento = cachedData.find(item => item.id === parseInt(id, 10));
        return elemento;
    }
    return null;
}


// caminho "Home"
app.get('/', (req, res) => {
    res.status(200).send(msg);
});
// caminho categorias
app.get('/:categoria', (req, res) => {
    const categoria = req.params.categoria;
    const dados = pegaDados(categoria);

    if (dados) {
        setCachedData(categoria, dados);
        res.status(200).json(dados);
    } else {
        res.status(400).json({ error: 'Categoria inválida' });
    }
});
// caminho categoria + id
app.get('/:categoria/:id', (req, res) => {
    const categoria = req.params.categoria;
    const id = req.params.id;
    const elemento = busCategoriaId(categoria, id);

    if (elemento) {
        res.status(200).json(elemento);
    } else {
        res.status(404).json({ error: 'Elemento não encontrado' });
    }
});

// Monitorar servidor
app.listen(porta, () => {
    console.log(msg)
    console.log('http://localhost:' + porta)
})