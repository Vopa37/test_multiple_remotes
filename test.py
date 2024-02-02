import pymysql
import paramiko
from sshtunnel import SSHTunnelForwarder

# SSH konfigurace
ssh_host = 'ssh_host_address'
ssh_port = 22
ssh_username = 'ssh_username'
ssh_password = 'ssh_password'

# Databázová konfigurace
db_host = 'db_host_address'
db_port = 3306
db_username = 'db_username'
db_password = 'db_password'
db_name = 'db_name'

# Vytvoření SSH tunelu
with SSHTunnelForwarder(
    (ssh_host, ssh_port),
    ssh_username=ssh_username,
    ssh_password=ssh_password,
    remote_bind_address=(db_host, db_port)
) as tunnel:
    # Připojení k databázi
    db_connection = pymysql.connect(
        host='127.0.0.1',
        port=tunnel.local_bind_port,
        user=db_username,
        passwd=db_password,
        db=db_name
    )

    # Vykonání SQL dotazu
    cursor = db_connection.cursor()
    cursor.execute("SELECT * FROM your_table;")
    rows = cursor.fetchall()

    # Zpracování výsledků
    for row in rows:
        print(row)

    # Uzavření spojení
    cursor.close()
    db_connection.close()