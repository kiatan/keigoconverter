require './app/repositories/word_repository.rb'

class SuggestSentenceService
    include Repository

    # Add suggested sentence
    def add_suggested_sentences(suggested_sentences)
        repository = WordRepository .new
        
        repository.add_suggested_sentence(suggested_sentences)
    end
end