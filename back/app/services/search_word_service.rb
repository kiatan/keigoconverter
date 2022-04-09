require './app/repositories/word_repository.rb'
require './app/models/repository/word_model.rb'
require './app/models/api/keigo_dictionary_model.rb'
require './app/models/api/word_sentence_model.rb'

class SearchWordService
    include Api
    include Repository

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
                word_type: "exact_verb",
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
            end

            results.append(new_keigo_dictionary)
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
end