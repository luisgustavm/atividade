const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors()); // Permite requisições do frontend
app.use(express.json()); // Permite receber JSON no body

// Configure aqui seu email Gmail e senha de app (veja abaixo)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'espacointerativoluis@gmail.com',
    pass: 'dzcyyfgeeabfpegh'
  }
});

app.post('/enviar-codigo', (req, res) => {
  const { email, codigo } = req.body;

  if (!email || !codigo) {
    return res.status(400).json({ erro: 'Email e código são obrigatórios.' });
  }

  const mailOptions = {
    from: 'SEU_EMAIL@gmail.com',
    to: email,
    subject: 'Código de Recuperação de Senha',
    text: `Seu código para recuperação de senha é: ${codigo}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ erro: 'Erro ao enviar email' });
    }
    console.log('Email enviado: ' + info.response);
    res.json({ sucesso: 'Email enviado com sucesso!' });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
