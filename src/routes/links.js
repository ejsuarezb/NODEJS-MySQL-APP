const express = require('express');
const router = express.Router();

const pool = require('../database.js');
const { isLoggedIn } = require('../lib/auth.js');

router.get('/add', isLoggedIn, (req, res) =>{
  res.render('links/add');
});

router.post('/add', isLoggedIn, async(req, res) => {
  const {title, url, description } = req.body;
  const newLink = {
    title,
    url,
    description,
    user_id: req.user.id
  };
  await pool.query('INSERT INTO links set ?', [newLink]);
  req.flash('success', 'Link saved successfully');
  res.redirect('/links');
});

router.get('/', isLoggedIn, async(req, res) => {
  const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
  res.render('links/list.hbs', { links });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  await pool.query('DELETE FROM links WHERE id =?', [id]);
  req.flash('success', 'Link Removed successfully');
  res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const links = await pool.query('SELECT *  FROM links WHERE id =?', [id]);
  res.render('links/edit.hbs', {link: links[0]});
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { title, url, description} = req.body;
  const newLink = {
    title,
    url,
    description
  };
  await pool.query('UPDATE links SET ? WHERE id = ?', [newLink, id]);
  req.flash('success', 'Link Updated successfully');
  res.redirect('/links');
});

module.exports = router;
