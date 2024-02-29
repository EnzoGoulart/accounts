const inquirer = require("inquirer")
const chalk = require("chalk")
const fs = require("fs")
const { error } = require("console")

console.log("top")

operation() 
function operation() {
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message :'O que você deseja fazer?',
        choices: ['Criar Conta', 'Consultar Saldo', 'Depositar', 'Sacar', 'Sair']
    }]).then((a)=>{
        console.clear()

        let action = a['action']

        console.log(chalk.bgWhite.greenBright(`Opção selecionada: ${action}`))

        if(action == 'Criar Conta'){
            criarConta() 
        } else if(action == 'Consultar Saldo'){
            consultarSaldo()
        } else if(action == 'Depositar'){
            depositar()
        } else if(action == 'Sacar'){
            sacar()
        } else if(action == 'Sair'){
            console.log(chalk.greenBright("flw"))
            process.exit()
        }
    }).catch((e)=>{
        console.error("Serviço indisponivel no momento.")
    })
}

function criarConta(){
    inquirer.prompt([{
        name: "accounts",
        message: "Nome da conta: "
    }]).then((a)=>{
            const accounts = a['accounts'] 

            if (!fs.existsSync('accounts')) {
                fs.mkdirSync('accounts');
            }

            if(fs.existsSync(`accounts/${accounts}.json`)){
                throw new Error("") 
            }
            
            fs.writeFileSync(`accounts/${accounts}.json`, '{"balance": 0}');
            console.log("Conta criada com sucesso.")
            operation()
        }).catch(e=>{
            console.log("Conta já existe") 
            return criarConta()
    })
}

function depositar(){
    inquirer.prompt([{
        name: "nome",
        message: "Nome: "
    }]).then((a)=>{
        const nome = a['nome']

        if(!fs.existsSync(`accounts/${nome}.json`)){
            console.log('Conta não existe') 
            return depositar()
        }

        inquirer.prompt([{
            name: "valor",
            message: "Valor do deposito: "
        }]).then((answer)=>{
            const valor = answer['valor']

            if(isNaN(valor))
            {
                console.log("Digite apenas numeros.")
                return depositar()
            }

            mudarValor(nome, valor)
            return operation()
        })
    }).catch(e => console.log(e))
}

function sacar(){
    inquirer.prompt([{
        name: "nome",
        message: "Nome: "
    }]).then(a=>{
        const nome = a['nome']
        
        inquirer.prompt([{
            name: "valor",
            message: "Valor do saque: ",
        }]).then((answer)=>{
            const valor = answer['valor']
 
            if(isNaN(valor))
            {
                console.log("Digite apenas numeros.")
                return sacar()
            }

            mudarValor(nome, valor, 1)
            return operation()
        }).catch(() => {console.log("Erro")})
    }).catch(()=> console.log("Erro"))
}
function valorJson(nome){ 
    const accountJson = fs.readFileSync(`accounts/${nome}.json`, {
        encoding: 'utf8',
        flag: 'r'
    })

    return JSON.parse(accountJson)
}

function mudarValor(nome, valor, add = 0){
    if(!valor)
    {
        console.log("Erro")
        return operation()
    }
    const amount = valorJson(nome)

    amount.balance = parseFloat(JSON.stringify(valorJson(nome).balance))
    if(add == 0){
        amount.balance += parseFloat(valor)
    } else {
        amount.balance -= parseFloat(valor)
    }

    fs.writeFileSync(
       `accounts/${nome}.json`,
        JSON.stringify(amount)
    )
    
    console.log((add == 0 ? "Deposito" : "Saque") + " realizado com sucesso")
}

function consultarSaldo(nome){
    inquirer.prompt([{
        name: "nome",
        message: "Nome: "
    }]).then((a)=>{
        const nome = a['nome']

        if(!fs.existsSync(`accounts/${nome}.json`)){
            console.log('Conta não existe') 
            return depositar()
        }

        console.log('Saldo: ' + valorJson(nome).balance)

        operation()
    }).catch(e => console.log(e))
}