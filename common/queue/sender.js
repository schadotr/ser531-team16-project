const amqp = require('amqplib/callback_api');

const sendToQueue = (queueName, data) => {
    amqp.connect('amqp://localhost', (err, connection) => {
        if (err) {
            throw err;
        }
        connection.createChannel((err, channel) => {
            if (err) {
                throw err;
            }
            channel.assertQueue(queueName, {
                durable: false
            });
            channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)));
        });
    });
}

module.exports = sendToQueue;