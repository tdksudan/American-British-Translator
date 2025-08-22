'use strict';

const Translator = require('../components/translator.js');

module.exports = function (app) {
  
  const translator = new Translator();

  app.route('/api/translate')
    .post((req, res) => {
      const {text, locale} = req.body;

      //Validate presence of fields
      if (text === undefined || locale === undefined){
        return res.json({error: 'Required field(s) missing'});

      }

      //Validate empty text
      if (text.trim() === ''){
        return res.json({error: 'No text to translate'});
      }

      //Validate locale 
      if (locale !== 'american-to-british' && locale !== 'british-to-american'){
        return res.json({ error: 'Invalid value for locale field'});
      }

      //Perform translation
      const translation = translator.translate(text, locale);

      return res.json({ text, translation});
    });
};
