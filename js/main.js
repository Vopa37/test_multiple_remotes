const ssh2 = require('ssh2');
const mysql = require('mysql');

// SSH konfigurace
const sshConfig = {
  host: 'ssh_host_address',
  port: 22,
  username: 'ssh_username',
  password: 'ssh_password'
};

// Databázová konfigurace
const dbConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'db_username',
  password: 'db_password',
  database: 'db_name'
};

// Vytvoření SSH klienta
const sshClient = new ssh2.Client();

// Připojení přes SSH
sshClient.on('ready', () => {
  sshClient.forwardOut(
    '127.0.0.1',
    0,
    'db_host_address',
    3306,
    (err, stream) => {
      if (err) throw err;

      // Připojení k databázi
      const dbConnection = mysql.createConnection({
        host: '127.0.0.1',
        user: 'db_username',
        password: 'db_password',
        database: 'db_name',
        stream: stream // Stream z SSH tunelu
      });

      dbConnection.connect((err) => {
        if (err) throw err;

        // Vykonání SQL dotazu
        dbConnection.query('SELECT * FROM your_table', (err, results) => {
          if (err) throw err;

          // Zpracování výsledků
          results.forEach((row) => {
            console.log(row);
          });

          // Uzavření spojení
          dbConnection.end();
          sshClient.end();
        });
      });
    }
  );
}).connect(sshConfig);
