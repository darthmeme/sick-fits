const mutations = {
  async createItem (parent, args, ctx, info) {
    const item = await ctx.db.mutation.createItem({ data: { ...args } })

    return item
  },
  updateItem (parent, args, ctx, info) {
    const updates = { ...args }
    delete updates.id

    return ctx.db.mutation.updateItem({ data: updates, where: { id: args.id }})
  },
  async deleteItem (parent, args, ctx, info) {
    const where = { id: args.id }
    const item = await ctx.db.query.item({ where }, `{ id, name }`)
    
    return ctx.db.mutation.deleteItem({ where })
  }
};

module.exports = mutations;
