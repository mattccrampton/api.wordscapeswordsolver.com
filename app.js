// OK STARTING

//import 'dotenv/config'
import cors from 'cors'
import express from 'express'

//import all_the_words from './words.json'
import all_the_words from './scrabble_words.json'

const app = express()

app.use(cors())

app.use(express.json())

function searchWord(known_letters, allowed_letters){

    const possible_matches = all_the_words.filter((current_word) => {

        const this_allowed_letters = [...allowed_letters]

        if (current_word.length !== known_letters.length) {
            return false
        }

        for (let i=0; i<known_letters.length; i++) {

            if (!this_allowed_letters.includes(current_word.charAt(i))){
                //letter not allowed
                return false
            }

            //console.log("known_letter", known_letters.length, typeof known_letters[i] !== "undefined", typeof known_letters[i], known_letters[i])

            if (
                known_letters[i] !== "" &&
                known_letters[i] != current_word.charAt(i)
            ){
                //letter doesn't match
                return false
            }

            //Letter matched, remove it from the list
            let found_letter_i = this_allowed_letters.indexOf(current_word.charAt(i))
            this_allowed_letters.splice(found_letter_i, 1)

            if (
                i == known_letters.length - 1 && 
                known_letters.length == current_word.length
            ) {
                //if we got here, the word matches
                return current_word + found_letter_i
            }

        }
        
    })

    return possible_matches

}

app.post('/wordscapes_word_solver', (req, res) => {

    console.log("req", req.body)
    const known_letters = []
    for(let i=1; i<=req.body.unknown_word_letter_count; i++){

        let unknown_word_letter = req.body[`unknown_word_letter_${i}`]

        if (unknown_word_letter.length > 0) {
            unknown_word_letter = unknown_word_letter.toLowerCase()
        }

        known_letters.push(unknown_word_letter)
    }

    const available_letters = []
    for(let i=1; i<=7; i++){

        let available_letter = req.body[`available_letter_${i}`]

        if (available_letter.length > 0) {
            console.log("available_letter", available_letter)
            console.log("typof available_letter", typeof available_letter)
            available_letter = available_letter.toLowerCase()
        }

        available_letters.push(available_letter)
    }



  res.json({
        "_metadata": {
            "success_flag": true
        }, 
        "data": searchWord(known_letters,available_letters)
        //"data": searchWord(["","","",""],["n","p","l","e","g","u"])
  })

})

app.listen(3000, () =>
  console.log(`Example app listening on port 3000!`),
)
