require './app/repositories/word_repository.rb'
require './app/models/repository/word_model.rb'
require './app/models/api/keigo_dictionary_model.rb'
require './app/models/api/word_sentence_model.rb'

class SearchWordService
    include Api
    include Repository

    # search word sheet by sheet
    def search_word(given_word)
        search_verb_results = search_verb(given_word)

        if search_verb_results.nil? || search_verb_results.empty?
            search_elegant_speech_results = search_elegant_speech(given_word)
            if search_elegant_speech_results.nil? || search_elegant_speech_results.empty?
                return []
            else
                return search_elegant_speech_results
            end
        else
            return search_verb_results
        end
    end

    # Search given word in verb_exact_match
    def search_verb(given_word)
        results = []
        
        # Get all the verbs from Sheet
        word_repository = WordRepository .new
        verbs = word_repository.get_verb_list

        # Get all the sentences from Sheet
        sentences = word_repository.get_sentences

        # Search for given word
        found_verbs = verbs.select {|word| word.word_content == given_word}

        # If given word is not found return empty array
        if found_verbs.nil? || found_verbs.empty?
            return results
        end
            
        found_verbs.each do |verb|
            new_keigo_dictionary = Api::KeigoDictionaryModel .new(
                word_type: verb.word_type,
                word_sentences: [
                    Api::WordSentenceModel .new(
                        form: verb.word_form,
                        word: verb.word_content,
                        sentences: search_sentences(sentences, verb.word_content)
                    )
                ],
                meaning: verb.meaning
            )

            # Search all the related verbs (in different form) to the given word
            related_verbs = verbs.select { |related_verb| related_verb.sheet_row == verb.sheet_row && related_verb.word_content != verb.word_content}

            if related_verbs.nil? || related_verbs.empty?
                results.append(new_keigo_dictionary)
                next
            else
                related_verbs.each do |related_verb|
                    new_keigo_dictionary.word_sentences.append(
                        Api::WordSentenceModel .new(
                            form: related_verb.word_form,
                            word: related_verb.word_content,
                            sentences: search_sentences(sentences, related_verb.word_content)
                        )
                    )
                end 
                results.append(new_keigo_dictionary)
            end
        end

        return results
    end

    # Search sentences related to given_word
    def search_sentences(sentence_list, given_word)
        result = sentence_list.select {|sentence| sentence.word == given_word}

        if result.nil? || result.empty?
            return []
        end

        return result
    end

    # Search given word in elegant_speech
    def search_elegant_speech(given_word)
        results = []
        
        # Get all the elegant speech from Sheet
        word_repository = WordRepository .new
        bikagos = word_repository.get_elegant_speech_list

        # Search for given word
        found_bikagos = bikagos.select {|word| word.word_content == given_word}

        # If given word is not found return empty array
        if found_bikagos.nil? || found_bikagos.empty?
            return results
        end
            
        found_bikagos.each do |bikago|
            new_keigo_dictionary = Api::KeigoDictionaryModel .new(
                word_type: bikago.word_type,
                word_sentences: [
                    Api::WordSentenceModel .new(
                        form: bikago.word_form,
                        word: bikago.word_content,
                        sentences: []
                    )
                ],
                meaning: ""
            )
            
            # Search all the related elegant speech (in different form) to the given word and do not get same content again
            related_bikagos = bikagos.select { |related_bikago| related_bikago.sheet_row == bikago.sheet_row && related_bikago.word_content != bikago.word_content}

            if related_bikagos.nil? || related_bikagos.empty?
                results.append(new_keigo_dictionary)
                next
            else
                related_bikagos.each do |related_bikago|
                    new_keigo_dictionary.word_sentences.append(
                        Api::WordSentenceModel .new(
                            form: related_bikago.word_form,
                            word: related_bikago.word_content,
                            sentences: []
                        )
                    )
                end 
                results.append(new_keigo_dictionary)
            end            
        end

        return results
    end
end