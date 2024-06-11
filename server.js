import express, { query } from "express";
import { PrismaClient } from '@prisma/client'
import cors from 'cors'
const prisma = new PrismaClient();




const app = express();

app.use(express.json());
app.use(cors());

app.get('/denuncias', async (req, res) => {
    let denuncia = []
   

    if (req.query) {
        denuncia = await prisma.denuncias.findMany({
            where: {
                endereco: req.query.endereco,
                obs: req.query.obs,
                dia: req.query.dia,
                rua: req.query.rua,
                cidade: req.query.cidade,
                numero: req.query.numero




            }
        })
    } else {
        const denuncia = await prisma.denuncia.findMany()
    }


    res.status(200).json(denuncia);


})

app.post('/denuncias', async (req, res) => {

    await prisma.denuncias.create({
        data: {
            rua: req.body.rua,
            numero : req.body.numero,
            Dia:      req. body.Dia,
            bairro : req.body.bairro,
            cidade : req.body.cidade,
            obs :  req.body.obs
            

            
        }
    })

    res.status(201).json(req.body);


})

app.put('/denuncias/:id', async (req, res) => {
    await prisma.denuncias.update({
        where: {
            id: req.params.id
        },
        data: {

            rua: req.body.rua,
            numero : req.body.numero,
            Dia:      req. body.Dia,
            bairro : req.body.bairro,
            cidade : req.body.cidade,
            obs :  req.body.obs
           
    }
    })

res.status(200).json(req.body);


})

app.delete('/denuncias/:id', async (req, res) => {

    await prisma.denuncias.delete({
        where: {
            id: req.params.id
        }
    })
    res.status(200).json({ message: "Denuncia removida com Sucesso!" });


})


//Rotas Usuario Get

app.get('/user', async (req, res) => {
    let user = []

    if (req.query) {
        user = await prisma.user.findMany({
            where: {
                email: req.query.email,
                nome: req.query.nome,
                password : req.query.password,
     
            }
        })
    } else {
        const user = await prisma.user.findMany()
    }


    res.status(200).json(user);


})
///verificação 
app.post('/user/login', async (req, res) => {
    try {
      let users = [];
  
      // Verificar se os parâmetros de consulta foram fornecidos
      if (req.body.email && req.body.password) {
        users = await prisma.user.findMany({
          where: {
            email: req.body.email,
            password: req.body.password,
            
            
          },
          
          
        });
        console.log('usuario encontrado');

      } else {
        // Se nenhum parâmetro de consulta foi fornecido, retornar todos os usuários
        users = await prisma.user.findMany();
      }
  
      // Verificar se há algum usuário retornado
      if (users.length > 0) {
        console.log('Usuário encontrado:', users[0].email); // Adicionando um console.log aqui
        res.status(200).json(users);
      } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
      }
    } catch (error) {
      console.error('Erro:', error);
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  });
  



//Rotas Usuario Post

// app.post('/user', async (req, res) => {

//     await prisma.user.create({
//         data: {
//             email:req.body.email,
//             name:req.body.email,
//             password: req.body.password,
//             re_password: req.body.re_password,
           
           
//         }
//     })
//     res.status(201).json(req.body);


// })

//registro de usuario
app.post('/user', async (req, res) => {

    await prisma.user.create({
        data: {
            name:req.body.email,
            email:req.body.email,
            password: req.body.password,
            re_password: req.body.re_password,
           
        }
    })
    res.status(201).json(req.body);


})


app.get('/user/revr', async (req, res) => {
    let register = []

    if (req.query) {
        register = await prisma.register.findMany({
            where: {
                email: req.query.email,
                nome: req.query.nome,
                password : req.query.password,
     
            }
        })
    } else {
        const register = await prisma.register.findMany()
    }


    res.status(200).json(register);


})

app.listen(3000, () => {
    console.log('servidor dodando port 3000');
})



