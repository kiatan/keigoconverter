require './app/models/api/word_sentence_model.rb'
require './app/models/api/sentence_model.rb'
require './app/services/suggest_sentence_service.rb'

class Api::V1::KeigoDictionarySentencesController < ApplicationController
  include Api

  # Get keigo word-sentences for given word 
  def create
    # get request body	
    request_body = JSON.parse(request.body.read)

    suggested_sentences = Api::WordSentenceModel.new(
      form: request_body["form"], 
      word: request_body["word"],
      sentences: []
    )

    request_body["sentences"].each do |sentence|
      suggested_sentences.sentences.append(
        Api::SentenceModel.new(
          word: sentence["word"],
          sentence_ja: sentence["sentence_ja"],
          sentence_en: sentence["sentence_en"]
        )
      )
    end
    
    service = SuggestSentenceService .new
    service.add_suggested_sentences(suggested_sentences)

    render json:suggested_sentences.sentences, status: 200
  end
end