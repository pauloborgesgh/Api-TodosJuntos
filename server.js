import express from "express";
import { PrismaClient, Prisma } from '@prisma/client';
import cors from 'cors';

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(cors()); 

app.get("/",async (req,res)=>{
    return res.json("hello word React API PRONTO")
});

app.put('/denuncias/:id', async (req, res) => {
    const { id } = req.params;
    const { created_by, rua, numero, Dia, bairro, cidade, obs } = req.body;

    try {
        const denuncia = await prisma.denuncias.findUnique({
            where: { id: String(id) }
        });

        if (!denuncia) {
            return res.status(404).json({ message: 'Denúncia não encontrada.' });
        }

        if (denuncia.created_by !== created_by) {
            return res.status(403).json({ message: 'Você não tem permissão para editar esta denúncia.' });
        }

        const updatedDenuncia = await prisma.denuncias.update({
            where: { id: String(id) },
            data: { rua, numero: parseInt(numero, 10), Dia, bairro, cidade, obs }
        });

        res.status(200).json(updatedDenuncia);
    } catch (error) {
        console.error('Erro ao atualizar denúncia:', error);
        res.status(500).json({ error: 'Erro ao atualizar denúncia.' });
    }
});
// Rota para buscar denúncias
app.get('/denuncias', async (req, res) => {
    try {
        let denuncias = [];

        if (Object.keys(req.query).length) {
            denuncias = await prisma.denuncias.findMany({
                where: {
                    endereco: req.query.endereco || undefined,
                    obs: req.query.obs || undefined,
                    dia: req.query.dia || undefined,
                    rua: req.query.rua || undefined,
                    cidade: req.query.cidade || undefined,
                    numero: req.query.numero || undefined
                }
            });
        } else {
            denuncias = await prisma.denuncias.findMany();
        }

        res.status(200).json(denuncias);
    } catch (error) {
        console.error('Erro ao buscar denúncias:', error);
        res.status(500).json({ error: 'Erro ao buscar denúncias' });
    }
});

// Rota para criar denúncias
app.post('/denuncias', async (req, res) => {
    try {
        let { rua, numero, Dia, bairro, cidade, obs, created_by } = req.body;

        if (Dia && typeof Dia === 'string') {
            const parsedDate = new Date(Dia);
            if (!isNaN(parsedDate)) {
                Dia = parsedDate.toISOString();
            } else {
                throw new Error('Data inválida. A data deve estar no formato ISO-8601.');
            }
        }

        const denuncia = await prisma.denuncias.create({
            data: {
                rua,
                numero: parseInt(numero, 10),
                Dia,
                bairro,
                cidade,
                obs,
                created_by
            }
        });

        res.status(201).json(denuncia);
    } catch (error) {
        console.error('Erro ao criar denúncia:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(400).json({ error: 'Erro de requisição conhecido do Prisma' });
        } else {
            res.status(500).json({ error: 'Erro ao fazer denúncia' });
        }
    }
});


app.delete('/denuncias/:id', async (req, res) => {
    const { id } = req.params;
    const { created_by } = req.body;

    try {
        const denuncia = await prisma.denuncias.findUnique({
            where: { id: String(id) }
        });

        if (!denuncia) {
            return res.status(404).json({ message: 'Denúncia não encontrada.' });
        }

        if (denuncia.created_by !== created_by) {
            return res.status(403).json({ message: 'Você não tem permissão para deletar esta denúncia.' });
        }

        await prisma.denuncias.delete({
            where: { id: String(id) }
        });

        res.status(200).json({ message: "Denúncia removida com sucesso!" });
    } catch (error) {
        console.error('Erro ao deletar denúncia:', error);
        res.status(500).json({ error: 'Erro ao deletar denúncia.' });
    }
});


// Rota para login do usuário
app.post('/user/login', async (req, res) => {
    try {
        const { name, password } = req.body;

        if (name && password) {
            const user = await prisma.user.findFirst({
                where: { name, password }
            });

            if (user) {
                console.log('Usuário encontrado:', user.name);
                res.status(200).json(user);
            } else {
                res.status(404).json({ message: 'Usuário não encontrado' });
            }
        } else {
            res.status(400).json({ message: 'Nome e senha são obrigatórios.' });
        }
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

// Rota para buscar ID do usuário
app.get('/user/id_usuario', async (req, res) => {
    try {
        const { name, password } = req.query;

        const user = await prisma.user.findFirst({
            where: { name, password },
            select: { id: true }
        });

        if (user) {
            res.status(200).json({ id: user.id });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error('Erro ao buscar ID do usuário:', error);
        res.status(500).json({ error: 'Erro ao buscar usuário' });
    }
});

// Rota para cadastro de usuário
app.post('/user', async (req, res) => {
    try {
        const { email, name, password, cpf } = req.body;

        const user = await prisma.user.create({
            data: { email, name, password, cpf }
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Erro ao criar cadastro:', error);
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(400).json({ error: 'Erro de requisição conhecido do Prisma' });
        } else {
            res.status(500).json({ error: 'Erro ao realizar cadastro' });
        }
    }
});

//rota do angular
app.delete('/denuncias/remove/:id', async (req, res) => {
    // Obtém o ID da denúncia da URL
    const { id } = req.params;
    console.log('ID da denúncia recebido:', id);

    // Obtém o campo created_by do corpo da requisição
    const { created_by } = req.body;
    console.log('created_by recebido:', created_by);

    try {
        // Busca a denúncia no banco de dados
        const denuncia = await prisma.denuncias.findUnique({
            where: { id: String(id) },
        });
        console.log('Denúncia encontrada:', denuncia);

        // Verifica se a denúncia existe
        if (!denuncia) {
            console.log('Denúncia não encontrada.');
            return res.status(404).json({ message: 'Denúncia não encontrada.' });
        }

        // Verifica se o usuário autenticado é o criador da denúncia
        if (denuncia.created_by !== created_by) {
            console.log('Usuário não tem permissão para deletar esta denúncia.');
            return res.status(403).json({ message: 'Você não tem permissão para deletar esta denúncia.' });
        }

        // Deleta a denúncia
        await prisma.denuncias.delete({
            where: { id: String(id) },
        });
        console.log('Denúncia deletada com sucesso.');

        // Responde com sucesso
        return res.status(200).json({ message: 'Denúncia removida com sucesso!' });
    } catch (error) {
        console.error('Erro ao deletar denúncia:', error);
        return res.status(500).json({ error: 'Erro ao deletar denúncia.' });
    }
});


  app.delete('/denuncia/:id', async (req, res) => {
  const { id } = req.params;
  const { created_by } = req.body; // created_by vem do corpo da requisição

  try {
    // Busca a denúncia no banco de dados
    const denuncia = await prisma.denuncias.findUnique({
      where: { id: String(id) },
    });

    // Verifica se a denúncia existe
    if (!denuncia) {
      return res.status(404).json({ message: 'Denúncia não encontrada.' });
    }

    // Verifica se o usuário autenticado é o criador da denúncia
    if (denuncia.created_by !== created_by) {
      return res.status(403).json({ message: 'Você não tem permissão para deletar esta denúncia.' });
    }

    // Deleta a denúncia
    await prisma.denuncias.delete({
      where: { id: String(id) },
    });

    // Responde com sucesso
    return res.status(200).json({ message: 'Denúncia removida com sucesso!' });
  } catch (error) {
    console.error('Erro ao deletar denúncia:', error);
    return res.status(500).json({ error: 'Erro ao deletar denúncia.' });
  }
});

//rota do angular
app.put('/denuncias/edit/:id', async (req, res) => {
    const { id } = req.params;
    console.log('ID recebido para atualização:', id);
    const data = req.body; // Dados da denúncia para atualização
    console.log('Dados recebidos para atualização:', data);
  
    try {
      // Atualiza a denúncia no banco de dados
      const denuncia = await prisma.denuncias.update({
        where: { id: String(id) },
        data: data
      });
  
      console.log('Denúncia atualizada:', denuncia);
      
      return res.status(200).json({ message: 'Denúncia atualizada com sucesso!', denuncia });
    } catch (error) {
      console.error('Erro ao atualizar denúncia:', error);
      return res.status(500).json({ error: 'Erro ao atualizar denúncia.' });
    }
  });
  


  
  
// Inicializa o servidor
app.listen(process.env.PORT || 3000, () => {
    console.log('Servidor rodando');
  });
