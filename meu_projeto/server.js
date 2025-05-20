require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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

// Model de Usuário
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  senhaHash: { type: String, required: true }
});

const User = mongoose.model('User', UserSchema);

// Rotas básicas (exemplo)

// Cadastro
app.post('/api/register', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Preencha todos os campos' });

  const bcrypt = require('bcrypt');
  const saltRounds = 10;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Usuário já existe' });

    const senhaHash = await bcrypt.hash(senha, saltRounds);
    const newUser = new User({ email, senhaHash });
    await newUser.save();
    res.json({ message: 'Usuário criado com sucesso' });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ error: 'Preencha todos os campos' });

  const bcrypt = require('bcrypt');
  const jwt = require('jsonwebtoken');

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Usuário não encontrado' });

    const senhaValida = await bcrypt.compare(senha, user.senhaHash);
    if (!senhaValida) return res.status(400).json({ error: 'Senha incorreta' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token, email: user.email });
  } catch (err) {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Rota protegida exemplo
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const jwt = require('jsonwebtoken');

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

app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-senhaHash');
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });

    res.json(user);
  } catch {
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
