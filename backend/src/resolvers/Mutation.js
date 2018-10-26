const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { transport, makeANiceEmail } = require('../mail')

const mutations = {
  async createItem (parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem({ data: { ...args } }, info)

    return item
  },
  updateItem (parent, args, ctx, info) {
    const updates = { ...args }
    delete updates.id

    return ctx.db.mutation.updateItem({ data: updates, where: { id: args.id }}, info)
  },
  async deleteItem (parent, args, ctx, info) {
    const where = { id: args.id }
    const item = await ctx.db.query.item({ where }, `{ id, name }`)
    
    return ctx.db.mutation.deleteItem({ where }, info)
  },
  async signup (parent, args, ctx, info) {
    args.email = args.email.toLowerCase()

    const password = await bcrypt.hash(args.password, 10)

    const user = await ctx.db.mutation.createUser({
      data: {
        ...args,
        password,
        permissions: { set: ['USER'] }
      }
    }, info)


    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    })

    return user
  },
  async signin (parent, args, ctx, info) {
    const { email, password } = args

    const user = await ctx.db.query.user({ where: { email } })

    if (!user) throw new Error(`No such such user found with email: ${email}`)

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) throw new Error('Invalid password!')

    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET)

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    })

    return user
  },
  async signout (parent, args, ctx, info) {
    ctx.response.clearCookie('token')

    return {
      message: 'You\'ve signed out!'
    }
  },
  async requestResetToken (parent, args, ctx, info) {
    const user = await ctx.db.query.user({ where: { email: args.email } })

    if (!user) throw new Error(`No such such user found with email: ${args.email}`)

    const resetToken = (await promisify(randomBytes)(20)).toString('hex')
    const resetTokenExpiry = Date.now() + 3600000

    await ctx.db.mutation.updateUser({
      where: { email: args.email },
      data: { resetToken, resetTokenExpiry }
    })

    const mailResponse = await transport.sendMail({
      from: 'noreply@sickfits.com',
      to: user.email,
      subject: 'Reset password link',
      html: makeANiceEmail(
        `In order to reset your password, click <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">here</a>`
      )
    })

    return {
      message: 'Reset token sent'
    }
  },
  async resetPassword (parent, args, ctx, info) {
    const [user] = await ctx.db.query.users({
      where: {
        resetToken: args.resetToken,
        resetTokenExpiry_gte: Date.now() - 3600000
      }
    })

    if (!user) throw new Error('Invalid or expired token!')

    const password = await bcrypt.hash(args.newPassword, 10)

    const updatedUser = await ctx.db.mutation.updateUser({
      where: { email: user.email },
      data: { password, resetToken: '', resetTokenExpiry: '' }
    })

    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET)

    ctx.response.cookie('token', token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365
    })

    return updatedUser
  }
};

module.exports = mutations;
