class Api::KeigoDictionaryModel
    include ActiveModel::API

    attr_accessor :word_type, :word_sentences, :meaning
end