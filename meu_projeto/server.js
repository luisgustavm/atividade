require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.use(cors());
app.use(express.json());

// Conexão MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado!'))
.catch(err => console.error('Erro conexão MongoDB:', err));

// Model de Usuário com campos extras
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senhaHash: { type: String, required: true },
  avatar: { type: String, default: '' },          // link ou nome do avatar
  moedas: { type: Number, default: 0 },
  quizRespostas: { type: Object, default: {} }    // você pode definir melhor o tipo conforme usar
});

const User = mongoose.model('User', UserSchema);

// Middleware para autenticar token JWT
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não enviado' });

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido' });
  }
};

// Rota de cadastro
app.post('/api/register', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Preencha todos os campos' });

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Usuário já existe' });

    const saltRounds = 10;
    const senhaHash = await bcrypt.hash(senha, saltRounds);
    const newUser = new User({ email, senhaHash });
    await newUser.save();
    res.json({ message: 'Usuário criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Rota de login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Preencha todos os campos' });

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, user.senhaHash);
    if (!senhaValida) return res.status(400).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, email: user.email });
  } catch {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Rota para pegar dados do usuário (perfil)
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-senhaHash');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
    res.json(user);
  } catch {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Rota para atualizar avatar, moedas e respostas do quiz
app.post('/api/atualizar', authMiddleware, async (req, res) => {
  const { avatar, moedas, quizRespostas } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    if (avatar !== undefined) user.avatar = avatar;
    if (moedas !== undefined) user.moedas = moedas;
    if (quizRespostas !== undefined) user.quizRespostas = quizRespostas;

    await user.save();
    res.json({ message: 'Dados atualizados' });
  } catch {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
