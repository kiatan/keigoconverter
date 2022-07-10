require './app/repositories/word_repository.rb'
require './app/models/repository/word_model.rb'
require './app/models/api/keigo_dictionary_model.rb'
require './app/models/api/word_sentence_model.rb'
require './app/services/formula_verb_service.rb'

class SearchWordService
    include Api
    include Repository

    # search word sheet by sheet
    def search_word(given_word)

        # search in verbs
        search_verb_results = search_verb(given_word)
        unless search_verb_results.nil? || search_verb_results.empty?
            return search_verb_results
        end

        # search in bikagos
        search_elegant_speech_results = search_elegant_speech(given_word)
        unless search_elegant_speech_results.nil? || search_elegant_speech_results.empty?
            return search_elegant_speech_results
        end

        # search in nouns
        search_noun_results = search_noun(given_word)
        unless search_noun_results.nil? || search_noun_results.empty?
            return search_noun_results
        end

        # search formula verbs
        search_formula_verb_results = search_formula_verb(given_word)
        unless search_formula_verb_results.nil? || search_formula_verb_results.empty?
            return search_formula_verb_results
        end

        # given_word is not found in any search, return empty array
        return []
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

    # Search given word in noun_exact_match
    def search_noun(given_word)
        results = []
        
        # Get all the nouns from Sheet
        word_repository = WordRepository .new
        nouns = word_repository.get_noun_list

        # Get all the sentences from Sheet
        sentences = word_repository.get_sentences

        # Search for given word
        found_nouns = nouns.select {|word| word.word_content == given_word}

        # If given word is not found return empty array
        if found_nouns.nil? || found_nouns.empty?
            return results
        end
            
        found_nouns.each do |noun|
            new_keigo_dictionary = Api::KeigoDictionaryModel .new(
                word_type: noun.word_type,
                word_sentences: [
                    Api::WordSentenceModel .new(
                        form: noun.word_form,
                        word: noun.word_content,
                        sentences: search_sentences(sentences, noun.word_content)
                    )
                ],
                meaning: noun.meaning
            )

            # Search all the related nouns (in different form) to the given word
            related_nouns = nouns.select { |related_noun| related_noun.sheet_row == noun.sheet_row && related_noun.word_content != noun.word_content}

            if related_nouns.nil? || related_nouns.empty?
                results.append(new_keigo_dictionary)
                next
            else
                related_nouns.each do |related_noun|
                    new_keigo_dictionary.word_sentences.append(
                        Api::WordSentenceModel .new(
                            form: related_noun.word_form,
                            word: related_noun.word_content,
                            sentences: search_sentences(sentences, related_noun.word_content)
                        )
                    )
                end 
                results.append(new_keigo_dictionary)
            end
        end

        return results
    end

    # Search given word in verb_group1_exception
    def search_verb_group1_exception(given_word)
        results = []
        
        # Get all the verbs from Sheet
        word_repository = WordRepository .new
        verbs = word_repository.get_verb_group1_exception_list

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
                        word: verb.word_content
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
                            word: related_verb.word_content
                        )
                    )
                end 
                results.append(new_keigo_dictionary)
            end
        end

        return results
    end

    # Check whether if given word is a verb
    # if it is, return the verb with other forms based on formula
    # else, return empty result
    def search_formula_verb(given_word)
        formula_verb_service = FormulaVerbService .new

        # check whether if given word is verb using Mecab
        given_word_property = formula_verb_service.get_word_properties(given_word)

        # if it is verb, we don't need to process anymore, simply return empty result
        if given_word_property.type != "動詞"
            return []
        end

        # as it is verb, check is it in group 1 verb exceptions
        # if it is, we can simply get the other forms from database
        result = search_verb_group1_exception(given_word)

        unless result.nil? || result.empty?
            return result
        end

        # verb is not in execption list, so get other forms using formula 
        # try getting word conversion using group 2 verb formula
        result = formula_verb_service.get_group2_verb(given_word_property)

        unless result.nil? || result.empty?
            return result
        end

        # try getting word conversion using group 1 verb formula
        result = formula_verb_service.get_group1_verb(given_word_property)

        # return result even if it is empty by trying out group 1 verb formula
        # which means verb conversion using formula failed
        return result
    end
end