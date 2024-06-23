const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { GraphQLError } = require("graphql")
const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const resolvers = {
	Author: {
		bookCount: async (author) => await Book.find({ author: author.id }).countDocuments()
	},
	Query: {
		bookCount: () => Book.collection.countDocuments(),
		authorCount: () => Author.collection.countDocuments(),
		allBooks: async (root, args) => {
			if (args.author || args.genre) {
				const author = await Author.findOne({ name: args.author })
				if (!args.author) return await Book.find({ genres: args.genre }).populate('author')
				if (!args.genre) return await Book.find({ author: author.id }).populate('author')
				return await Book.find({ author: author.id, genres: args.genre }).populate('author')
			}
			return await Book.find({}).populate('author')
		},
		allAuthors: async () => await Author.find({}),
		me: (root, args, context) => context.currentUser
	},
	Mutation: {
		addBook: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'BAD_USER_INPUT',
					}
				})
			}

			let author = await Author.findOne({ name: args.author })
			if (!author) {
				try {
					author = new Author({ name: args.author })
					await author.save()
				} catch (error) {
					throw new GraphQLError(error.message, {
						extensions: {
							code: "BAD_USER_INPUT",
							invalidArgs: args.author,
							error
						}
					})
				}
			}
			try {
				const book = new Book({ ...args, author: author._id })
				pubsub.publish('BOOK_ADDED', { bookAdded: book.populate('author') })
				return await book.save()
			}
			catch (error) {
				throw new GraphQLError(error.message, {
					extensions: {
						code: "BAD_USER_INPUT",
						invalidArgs: args.title,
						error
					}
				})
			}

		},
		editAuthor: async (root, args, { currentUser }) => {
			if (!currentUser) {
				throw new GraphQLError('not authenticated', {
					extensions: {
						code: 'BAD_USER_INPUT',
					}
				})
			}

			let author = await Author.findOne({ name: args.name })
			if (!author) {
				return null
			}

			author.born = args.setBornTo
			return await author.save()
		},
		createUser: async (root, args) => {
			const user = new User({ username: args.username })

			return user.save()
				.catch(error => {
					throw new GraphQLError('Creating the user failed', {
						extensions: {
							code: 'BAD_USER_INPUT',
							invalidArgs: args.username,
							error
						}
					})
				})
		},
		login: async (root, args) => {
			const user = await User.findOne({ username: args.username })

			if (!user || args.password !== 'secret') {
				throw new GraphQLError('wrong credentials', {
					extensions: {
						code: 'BAD_USER_INPUT'
					}
				})
			}

			const userForToken = {
				username: user.username,
				id: user._id,
			}

			return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
		},
	},
	Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  }
}

module.exports = resolvers