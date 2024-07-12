import express, { query } from "express";
import { PrismaClient } from '@prisma/client'
import cors from 'cors';
const prisma = new PrismaClient();




const app = express();

app.use(express.json());
app.use(cors());

// app.get('/denuncias', async (req, res) => {
//     let denuncia = []

//     if (req.query) {
//         denuncia = await prisma.denuncias.findMany({
//             where: {
//                 endereco: req.query.endereco,
//                 obs: req.query.obs,
//                 dia: req.query.dia,
//                 rua: req.query.rua,
//                 cidade: req.query.cidade,
//                 numero: req.query.numero




//             }
//         })
//     } else {
//         const denuncia = await prisma.denuncias.findMany()
//     }


//     res.status(200).json(denuncia);


// })

// app.post('/denuncias', async (req, res) => {
//     try {
//       const { rua, numero, Dia, bairro, cidade, obs } = req.body;
  
//       const denuncia = await prisma.denuncias.create({
//         data: {
//           rua,
//           numero: parseInt(numero, 10),  
//           Dia,
//           bairro,
//           cidade,
//           obs
//         }
//       });
  
//       res.status(201).json(denuncia);
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: ' Erro ao fazer denuncia' });
//     }
//   });

// app.put('/denuncias/:id', async (req, res) => {
//     await prisma.denuncias.update({
//         where: {
//             id: req.params.id
//         },
//         data: {

//             rua: req.body.rua,
//             numero : req.body.numero,
//             Dia:      req. body.Dia,
//             bairro : req.body.bairro,
//             cidade : req.body.cidade,
//             obs :  req.body.obs
           
//     }
//     })

// res.status(200).json(req.body);


// })

// app.delete('/denuncias/:id', async (req, res) => {

//     await prisma.denuncias.delete({
//         where: {
//             id: req.params.id
//         }
//     })
//     res.status(200).json({ message: "Denuncia removida com Sucesso!" });


// })


// app.listen(3000, () => {
//     console.log('servidor dodando port 3000');
// })




// import express from "express";
// import { PrismaClient } from '@prisma/client';
// import cors from 'cors';

// const prisma = new PrismaClient();
// const app = express();

// app.use(express.json());
app.use(cors());

app.get('/denuncias', async (req, res) => {
    try {
        let denuncias = [];

        if (req.query) {
            denuncias = await prisma.denuncias.findMany({
                where: {
                    endereco: req.query.endereco,
                    obs: req.query.obs,
                    dia: req.query.dia,
                    rua: req.query.rua,
                    cidade: req.query.cidade,
                    numero: req.query.numero
                }
            });
        } else {
            denuncias = await prisma.denuncias.findMany();
        }

        res.status(200).json(denuncias);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao buscar denuncias' });
    }
});

app.post('/denuncias', async (req, res) => {
    try {
        const { rua, numero, Dia, bairro, cidade, obs } = req.body;

        const denuncia = await prisma.denuncias.create({
            data: {
                rua,
                numero: parseInt(numero, 10),  
                Dia,
                bairro,
                cidade,
                obs
            }
        });

        res.status(201).json(denuncia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao fazer denuncia' });
    }
});

app.put('/denuncias/:id', async (req, res) => {
    try {
        const updatedDenuncia = await prisma.denuncias.update({
            where: {
                id: req.params.id
            },
            data: {
                rua: req.body.rua,
                numero: req.body.numero,
                Dia: req.body.Dia,
                bairro: req.body.bairro,
                cidade: req.body.cidade,
                obs: req.body.obs
            }
        });

        res.status(200).json(updatedDenuncia);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao atualizar denuncia' });
    }
});

app.delete('/denuncias/:id', async (req, res) => {
    try {
        await prisma.denuncias.delete({
            where: {
                id: req.params.id
            }
        });

        res.status(200).json({ message: "Denuncia removida com sucesso!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erro ao remover denuncia' });
    }
});

app.listen(3000, () => {
    console.log('Servidor rodando na porta 3000');
});
