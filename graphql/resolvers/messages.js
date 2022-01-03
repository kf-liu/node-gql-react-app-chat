const { UserInputError, AuthenticationError } = require('apollo-server');
const { Op } = require('sequelize');

const { User, Message } = require('../../models');

module.exports = {
    Query: {
        getMessage: async (_, { from }, { user }) => {
            try {
                if (!user) throw new AuthenticationError('Unauthenticated');

                const otherUser = await User.findOne({ where: { username: from } });
                if (!otherUser) throw new UserInputError('User not found');

                const username = [user.username, otherUser.username];

                const messages = await Message.findAll({
                    where: {
                        from: { [Op.in]: username },
                        to: { [Op.in]: username },
                    },
                    order: [['createdAt', 'DESC']],
                });
                return messages;
            } catch (err) {
                console.log(err);
                throw err;
            }
        },
    },
    Mutation: {
        sendMessage: async (_parent, { to, content }, { user }) => {
            try {
                if (!user) throw new AuthenticationError('Unauthenticated');

                const recipient = await User.findOne({ where: { username: to } });
                if (!recipient) throw new UserInputError('User not found');
                else if (recipient.username === user.username) throw new UserInputError('You cannot message yourself');

                if (content.trim() === '') throw new UserInputError('Message is empty');

                const message = await Message.create({
                    from: user.username,
                    to,
                    content,
                });
                return message;
            } catch (err) {
                console.log(err);
                throw err;
            }
        },
    },
};