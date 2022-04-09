require './app/models/api/keigo_dictionary_model.rb'
require './app/models/api/word_sentence_model.rb'
require './app/services/search_word_service.rb'

class Api::V1::KeigoDictionariesController < ApplicationController
  include Api

  # Get keigo word-sentences for given word 
  def show
    # TODO: By default return "not found" only for now. 
    # Will be updated in later backlogs
    
    # get word to be searched for from url params
    @param_word = params[:word]
    
    not_found = Api::KeigoDictionaryModel.new(
      word_type: "not_found", 
      word_sentences: [], 
      meaning: "")

    service = SearchWordService .new
    search_results = service.search_verb(@param_word)

    if search_results.nil? || search_results.empty?
      render json: [not_found], status: 200
    else
      render json: [search_results], status: 200
    end
  end
end