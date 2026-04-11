const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title:   { type: String, required: true },
  slug:    { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: { type: String, default: '' },
  category:{ type: String, default: 'General' },
  tags:    [String],
  author:  { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  cover:   { type: String, default: '' },
  published: { type: Boolean, default: false },
  views:   { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogSchema);
