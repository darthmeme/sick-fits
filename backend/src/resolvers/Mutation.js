const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { randomBytes } = require('crypto')
const { promisify } = require('util')
const { transport, makeANiceEmail } = require('../mail')
const { hasPermission } = require('../utils')
const stripe = require('../stripe')

const mutations = {
  async createItem (parent, args, ctx, info) {
    if (!ctx.request.userId) throw new Error('You must be logged in to do that')

    const item = await ctx.db.mutation.createItem({
      data: { 
        ...args, 
        user: {
          connect: {
            id: ctx.request.userId
          }
        }
      }
    }, info)

    return item
  },
  updateItem (parent, args, ctx, info) {
    const updates = { ...args }
    delete updates.id

    return ctx.db.mutation.updateItem({ data: updates, where: { id: args.id }}, info)
  },
  async deleteItem (parent, args, ctx, info) {
    const where = { id: args.id }
    const item = await ctx.db.query.item({ where }, `{ id, name, user { id } }`)
    const ownsItem = item.user.id === ctx.request.userId
    const hasPermission = ctx.request.user.permissions.some(
      permission => ['ADMIN', 'ITEM_DELETE'].includes(permission)
    )
    
    if (ownsItem || hasPermission) {
      return ctx.db.mutation.deleteItem({ where }, info)
    } else {
      throw new Error('Permission denied')
    }
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
  },
  async updatePermissions (parent, args, ctx, info) {
    if (!ctx.request.userId) throw new Error('Must be logged in')

    hasPermission(ctx.request.user, ['ADMIN', 'PERMISSION_UPDATE'])

    return ctx.db.mutation.updateUser({  
      where: { id: args.id },
      data: { permissions: { set: args.permissions }}
    }, info)
  },
  async addToCart (parent, args, ctx, info) {
    if (!ctx.request.userId) throw new Error('Must be logged in')

    const [existingCartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: ctx.request.userId },
        item: { id: args.id }
      }
    })

    if (existingCartItem) {
      return ctx.db.mutation.updateCartItem({
        where: {
          id: existingCartItem.id
        },
        data: {
          quantity: existingCartItem.quantity + 1
        }
      }, info)
    }

    return ctx.db.mutation.createCartItem({
      data: {
        user: { connect: { id: ctx.request.userId } },
        item: { connect: { id: args.id } }
      }
    }, info)
  },
  async removeFromCart (parent, args, ctx, info) {
    const [cartItem] = await ctx.db.query.cartItems({
      where: {
        user: { id: ctx.request.userId },
        id: args.id
      }
    })

    if (!cartItem) throw new Error('Cart item does not exist or belong to user')

    return ctx.db.mutation.deleteCartItem({ where: { id: args.id } }, info)
  },
  async createOrder (parent, args, ctx, info) {
    if (!ctx.request.userId) throw new Error('Permissions denied')

    const user = await ctx.db.query.user({ where: { id: ctx.request.userId } }, `{
      id
      name
      email
      cart {
        id
        quantity
        item { id name price description image}
      }
    }`)

    const amount = user.cart.reduce((tally, cartItem) => tally + (cartItem.quantity * cartItem.item.price), 0)

    const charge = await stripe.charges.create({
      amount,
      currency: 'USD',
      source: args.token
    })

    const orderItems = user.cart.map(cartItem => {
      const orderItem = {
        quantity: cartItem.quantity,
        user: { connect: { id: ctx.request.userId } },
        ...cartItem.item
      }
      delete orderItem.id

      return orderItem
    })

    const order = await ctx.db.mutation.createOrder({
      data: {
        total: charge.amount,
        charge: charge.id,
        items: { create: orderItems },
        user: { connect: { id: ctx.request.userId } }
      }
    })

    const cartItemIds = user.cart.map(item => item.id)

    await ctx.db.mutation.deleteManyCartItems({ where: { id_in: cartItemIds } })

    return order
  }
};

module.exports = mutations;
