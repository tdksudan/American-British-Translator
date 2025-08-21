const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js")
const britishOnly = require('./british-only.js')


class Translator {
    constructor() {
        this.highlight = (text) => `<span class="highlight">${text}</span>`;

    }

    translate(text, locale) {
        if (!text || typeof text !== 'string') return '';

        let translation = text;
        let dictionary = {};
        let titles = {};

        if (locale === 'american-to-british') {
            dictionary = { ...americanToBritishSpelling, ...americanOnly };
            titles = americanToBritishTitles;
        } else if (locale === 'british-to-american') {
            // Reverse americanToBritishSpelling
            const reversedSpelling = Object.fromEntries(
                Object.entries(americanToBritishSpelling).map(([key, val]) => [val, key])
            );

            dictionary = { ...reversedSpelling, ...britishOnly };

            // Reverse titles
            titles = Object.fromEntries(
                Object.entries(americanToBritishTitles).map(([key, val]) => [val, key])
            );
        } else {
            return 'Invalid locale';
        }

        //Replace titles
        for (const [key, val] of Object.entries(titles)) {
            const baseTitle = key.slice(0, -1); // e.g., "Mr"
            const regex = new RegExp(`\\b${baseTitle}\\.?(?=\\s)`, 'gi'); // Match "Mr." only if followed by space

            translation = translation.replace(regex, (match) => {
                const preservedCase = match[0] === match[0].toUpperCase()
                    ? val.charAt(0).toUpperCase() + val.slice(1)
                    : val;

                return this.highlight(preservedCase); // No period added
            });
            console.log('Translated:', translation);
        }



        //Replace dictionary entires
        // Sort dictionary keys by length descending
        const sortedEntries = Object.entries(dictionary).sort((a, b) => b[0].length - a[0].length);

        for (const [key, val] of sortedEntries) {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            translation = translation.replace(regex, (match) => {
                // Avoid replacing inside already-highlighted spans
                if (translation.includes(this.highlight(match))) return match;
                return this.highlight(val);
            });
        }

        //Handle time format conversion
        translation = this.convertTime(translation, locale);

        return translation === text ? 'Everything looks good to me!' : translation;
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