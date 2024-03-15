import { createSocket } from 'dgram';
import mysql from 'mysql2';

const connection = mysql.createConnection({
	host: '192.168.1.131',
	user: 'server',
	password: 'nCrGu@rd!@n$',
	database: 'mydb',
	port: '3306',
});

export default async function handler(req, res) {
	if (req.method === 'POST') {
		// Handle POST requests (e.g., sending data to the server)
		const { tag_id, transaction_balance } = req.body;

		try {
			await connection.connect();

			if (transaction_balance === 0) {
				const result = await connection
					.promise()
					.query(
						'SELECT id_number, first_name, middle_initial, last_name, balance, roles, number_of_passengers FROM users_server WHERE tag_uid = ?',
						[tag_id]
					);
				// Process the result and send the response
				res.status(200).json(result[0]);
			} else {
				await connection
					.promise()
					.query('UPDATE users_server SET balance = ? WHERE tag_uid = ?', [transaction_balance, tag_id]);
				// Update the database and send the response
				res.status(200).json({ message: 'Database updated successfully!' });
			}
		} catch (error) {
			console.error('Error:', error);
			res.status(500).json({ error: 'Internal server error' });
		} finally {
			await connection.end();
		}
	} else {
		// Handle other HTTP methods (e.g., GET)
		res.status(405).json({ error: 'Method Not Allowed' });
	}
}
