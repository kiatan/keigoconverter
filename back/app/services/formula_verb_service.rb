require 'natto'
require './app/models/services/word_property_model.rb'

class FormulaVerbService
    include Services

    # Get properties of given word
    def get_word_properties(given_word)
        given_word_property = Services::WordPropertyModel.new
        natto = Natto::MeCab.new

        # We will get only the first word property from given_word,
        # in case it is a compound consists of more than one word
        # word_count is used to count during parsing
        word_count = 0        

        # parse given_word to get properties
        natto.parse(given_word) do |n|
            feature_array = n.feature.split(",")

            # Surface is the original form of parsed word
            given_word_property.surface = n.surface
            # Type is verb, noun, adjective etc. in Japanese
            given_word_property.type = feature_array[0]
            given_word_property.plain_form = feature_array[6]
            given_word_property.pronunciation = feature_array[7]

            word_count += 1

            if word_count > 0
                break
            end
        end

        return given_word_property
    end

    # Get verb in converted word model, if verb is group 2 verb
    def get_group2_verb(given_word_property)
        # Check whether if verb is group 2
        if is_group2_verb?(given_word_property.pronunciation)
            return convert_group2_verb(given_word_property.plain_form)
        end

        # Simply return empty result if given word is not group 2 verb
        return []
    end

    # Check is a word Group 2 word
    # Assume given word is verb of plain form
    # Group 2 check using pronunciation, in case given word only consists of 2 characters and the first word is kanji
    def is_group2_verb?(given_word_pronunciation)
        group2_verb_endings = [
            "エル", "ケル", "ゲル", "メル", "セル", "テル", "レル", "ネル", "ゼル", "ヘル", "ベル", "ペル", "デル",  
            "イル", "キル", "ギル", "ミル", "シル", "チル", "リル", "ニル", "ジル", "ヒル", "ビル", "ピル", "ヂル"
        ]

        if given_word_pronunciation.length >= 2
            verb_ending = given_word_pronunciation.last(2)
            if group2_verb_endings.include?(verb_ending)
                return true
            end
        end

        return false
    end

    # Convert given verb based on group 2 verb convesion formula
    def convert_group2_verb(given_word_plain_form)
        return [Api::KeigoDictionaryModel .new(
            word_type: "formula_verb",
            word_sentences: [
                Api::WordSentenceModel .new(
                    form: "plain",
                    word: given_word_plain_form
                ),
                Api::WordSentenceModel .new(
                    form: "honorific",
                    word: given_word_plain_form.gsub("る", "られる")
                ),
                Api::WordSentenceModel .new(
                    form: "honorific",
                    word: "お" + given_word_plain_form.gsub("る", "になる")
                ),
                Api::WordSentenceModel .new(
                    form: "humble",
                    word: "お" + given_word_plain_form.gsub("る", "にする")
                ),
                Api::WordSentenceModel .new(
                    form: "polite",
                    word: given_word_plain_form.gsub("る", "ます")
                )
            ]
        )]
    end

    # Get verb in converted word model, if verb is group 1 verb
    def get_group1_verb(given_word_property)
        # Check whether if verb is group 1
        if is_group1_verb?(given_word_property.plain_form)
            return convert_group1_verb(given_word_property.plain_form)
        end

        # Simply return empty result if given word is not group 1 verb
        return []
    end

    # Check is a word Group 1 word
    # Assume given word is verb of plain form
    def is_group1_verb?(given_word_plain_form)
        group1_endings = ["う", "す", "く", "つ", "む", "ぐ", "ぶ", "る", "ぬ"]

        if given_word_plain_form.length >= 2
            verb_ending = given_word_plain_form.last(1)
            if group1_endings.include?(verb_ending)
                return true
            end
        end

        return false
    end

    # Convert given verb based on group 1 verb convesion formula
    def convert_group1_verb(given_word_plain_form)
        verb_ending = given_word_plain_form.last(1)

        group1_verb_conversion = {
            "う" => {
                "a_sound" => "わ",
                "i_sound" => "い"
            },
            "す" => {
                "a_sound" => "さ",
                "i_sound" => "し"
            },
            "く" => {
                "a_sound" => "か",
                "i_sound" => "き"
            },
            "つ" => {
                "a_sound" => "た",
                "i_sound" => "ち"
            },
            "む" => {
                "a_sound" => "ま",
                "i_sound" => "み"
            },
            "ぐ" => {
                "a_sound" => "が",
                "i_sound" => "ぎ"
            },
            "ぶ" => {
                "a_sound" => "ば",
                "i_sound" => "び"
            },
            "る" => {
                "a_sound" => "ら",
                "i_sound" => "り"
            },
            "ぬ" => {
                "a_sound" => "な",
                "i_sound" => "に"
            }
        }

        return [Api::KeigoDictionaryModel .new(
            word_type: "formula_verb",
            word_sentences: [
                Api::WordSentenceModel .new(
                    form: "plain",
                    word: given_word_plain_form
                ),
                Api::WordSentenceModel .new(
                    form: "honorific",
                    word: given_word_plain_form.gsub(verb_ending, group1_verb_conversion[verb_ending]["a_sound"] + "れる")
                ),
                Api::WordSentenceModel .new(
                    form: "honorific",
                    word: "お" + given_word_plain_form.gsub(verb_ending, group1_verb_conversion[verb_ending]["i_sound"] + "になる")
                ),
                Api::WordSentenceModel .new(
                    form: "humble",
                    word: "お" + given_word_plain_form.gsub(verb_ending, group1_verb_conversion[verb_ending]["i_sound"] + "します")
                ),
                Api::WordSentenceModel .new(
                    form: "polite",
                    word: given_word_plain_form.gsub(verb_ending, group1_verb_conversion[verb_ending]["i_sound"] + "ます")
                )
            ]
        )]
    end    
end