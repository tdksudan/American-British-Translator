const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')

class Translator {
    constructor(){
        this.highlight = (text) => `<span class ="highlight">${text}</span>`;

    }

    translate(text, locale){
        if (!text || typeof text !== 'string') return '';

        let translation = text;
        let dictionary = {};
        let titles = {};

        if (locale === 'american-to-british'){
            dictionary = { ...americanToBritishWords, ...americanOnly};
            titles = { 'Mr': 'Mr', 'Mrs.': 'Mrs', 'Dr.':'Dr'};
        } else if (locale === 'british-to-american'){
            dictionary = { ...britishToAmericanWords, ...britishOnly};
            titles = { 'Mr': 'Mr.', 'Mrs': 'Mrs.', 'Dr': 'Dr.'};
        } else {
            return 'Invalid local';
        }

        //Replace titles
        for (const [Key, val] of Object.entries(titles)) {
            const regex = new RegExp (`\\b${key}\\b`, 'gi');
            translation = translation.replace(regex, (match)=> this.highlight(val));
        }

        //Replace dictionary entires
        for (const [key, val] of Object.entries(dictionary)) {
            const regex = new RegExp (`\\b${key}\\b`, 'gi');
            translation = translation.replace(regex, (match) => this.highlight(val));
        }

        //Handle time format conversion
        translation = this.convertTime(translation, locale);

        return translation === text? 'Everything looks good to me!': translation;
    }

    convertTime(text, locale) {
        const regex = locale === 'american-to-british'
        ? /(\d{1,2}):(\d{2})/g 
        : /(\d{1,2})\.(\d{2})/g;

        const replacement = locale === 'american-to-british'
        ? (match, h, m) => this.highlight(`${h}.${m}`)
        : (match, h, m) => this.highlight(`${h}:${m}`);

        return text.replace(regex, replacement);


    }

}

module.exports = Translator;