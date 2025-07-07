require('dotenv').config();

module.exports = {
  NODE_ENV: 'development',
  PORT: 5000,
  MONGO_URI: 'mongodb+srv://jobvista01:jobvista1@cluster0.i8meito.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  JWT_SECRET: '3vE$y!cL7@xDqR2jZ#NmWqP0Uf^hTgK9',
  JWT_EXPIRE: '30d',
  JWT_COOKIE_EXPIRE: 30,
  SMTP_HOST: 'sandbox.smtp.mailtrap.io',
  SMTP_PORT: 2525,
  SMTP_EMAIL: '81b52b5d8c082f',
  SMTP_PASSWORD: 'b1641969512d75',
  FROM_NAME: 'JIRA Clone',
  FROM_EMAIL: 'noreply@jiracclone.com'
};
