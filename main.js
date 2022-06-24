const KEY_BD = '@usuariosestudo'


var listaPokemon = {
    ultimoIdGerado:0,
    usuarios:[]
}


var FILTRO = ''


function gravarBD(){
    localStorage.setItem(KEY_BD, JSON.stringify(listaPokemon) )
}

function lerBD(){
    const data = localStorage.getItem(KEY_BD)
    if(data){
        listaPokemon = JSON.parse(data)
    }
    desenhar()
}


function pesquisar(value){
    FILTRO = value;
    desenhar()
}


function desenhar(){
    const tbody = document.getElementById('listaPokemonBody')
    if(tbody){
        var data = listaPokemon.usuarios;
        if(FILTRO.trim()){
            const expReg = eval(`/${FILTRO.trim().replace(/[^\d\w]+/g,'.*')}/i`)
            data = data.filter( usuario => {
                return expReg.test( usuario.nome ) || expReg.test( usuario.tipo )
            } )
        }
        data = data
            .sort( (a, b) => {
                return a.nome < b.nome ? -1 : 1
            })
            .map( usuario => {
                return `<tr>
                        <td>${usuario.id}</td>
                        <td>${usuario.nome}</td>
                        <td>${usuario.tipo}</td>
                        <td>
                            <button onclick='vizualizar("cadastro",false,${usuario.id})'>Editar</button>
                            <button class='vermelho' onclick='perguntarSeDeleta(${usuario.id})'>Deletar</button>
                        </td>
                    </tr>`
            } )
        tbody.innerHTML = data.join('')
    }
}

function insertUsuario(nome, tipo){
    const id = listaPokemon.ultimoIdGerado + 1;
    listaPokemon.ultimoIdGerado = id;
    listaPokemon.usuarios.push({
        id, nome, tipo
    })
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function editUsuario(id, nome, tipo){
    var usuario = listaPokemon.usuarios.find( usuario => usuario.id == id )
    usuario.nome = nome;
    usuario.tipo = tipo;
    gravarBD()
    desenhar()
    vizualizar('lista')
}

function deleteUsuario(id){
    listaPokemon.usuarios = listaPokemon.usuarios.filter( usuario => {
        return usuario.id != id
    } )
    gravarBD()
    desenhar()
}

function perguntarSeDeleta(id){
    if(confirm('Quer deletar o registro de id '+id)){
        deleteUsuario(id)
    }
}


function limparEdicao(){
    document.getElementById('nome').value = ''
    document.getElementById('tipo').value = ''
}

function vizualizar(pagina, novo=false, id=null){
    document.body.setAttribute('page',pagina)
    if(pagina === 'cadastro'){
        if(novo) limparEdicao()
        if(id){
            const usuario = listaPokemon.usuarios.find( usuario => usuario.id == id )
            if(usuario){
                document.getElementById('id').value = usuario.id
                document.getElementById('nome').value = usuario.nome
                document.getElementById('tipo').value = usuario.tipo
            }
        }
        document.getElementById('nome').focus()
    }
}



function submeter(e){
    e.preventDefault()
    const data = {
        id: document.getElementById('id').value,
        nome: document.getElementById('nome').value,
        tipo: document.getElementById('tipo').value,
    }
    if(data.id){
        editUsuario(data.id, data.nome, data.tipo)
    }else{
        insertUsuario( data.nome, data.tipo )
    }
}


window.addEventListener('load', () => {
    lerBD()
    document.getElementById('cadastroRegistro').addEventListener('submit', submeter)
    document.getElementById('inputPesquisa').addEventListener('keyup', e => {
        pesquisar(e.target.value)
    })

})