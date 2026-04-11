const express = require('express');
const router = express.Router();
const BlogPost = require('../models/BlogPost');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const posts = await BlogPost.find({ published: true }).sort('-createdAt').populate('author', 'name');
  res.json({ success: true, data: posts });
});

router.get('/:slug', async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug }).populate('author', 'name');
  if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
  post.views++;
  await post.save();
  res.json({ success: true, data: post });
});

router.post('/', protect, adminOnly, async (req, res) => {
  const post = await BlogPost.create({ ...req.body, author: req.user._id });
  res.status(201).json({ success: true, data: post });
});

router.put('/:id', protect, adminOnly, async (req, res) => {
  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, data: post });
});

router.delete('/:id', protect, adminOnly, async (req, res) => {
  await BlogPost.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Post deleted' });
});

module.exports = router;
