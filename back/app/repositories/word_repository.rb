require "google/apis/sheets_v4"
require "googleauth"
require "fileutils"
require './app/models/repository/word_model.rb'
require './app/models/repository/sentence_model.rb'

class WordRepository
    include Repository

    # Get Google Sheets service client
    def get_sheet_service
        service = Google::Apis::SheetsV4::SheetsService.new
        service.authorization = Google::Auth::ServiceAccountCredentials.make_creds(
            json_key_io: File.open('./config/credentials.json'),
            scope: Google::Apis::SheetsV4::AUTH_SPREADSHEETS_READONLY)
    
        return service
    end

    # Get verb_exact_match sheet from column A(row 1) to column E(row 200)
    def get_verb_exact_match
        spreadsheet_id = "14mOAb85PpFOkJkO4fy82LOj1XdArpBgls-wbHZTnCaE"
        range = "verb_exact_match!A1:E200"
        service = get_sheet_service
    
        return service.get_spreadsheet_values(spreadsheet_id, range)
    end

    # Get verb_exact_match sheet from column A(row 1) to column C(row 500)
    def get_exact_match_sentence
        spreadsheet_id = "14mOAb85PpFOkJkO4fy82LOj1XdArpBgls-wbHZTnCaE"
        range = "exact_match_sentence!A1:C500"
        service = get_sheet_service
    
        return service.get_spreadsheet_values(spreadsheet_id, range)
    end

    # Get all the collapsed values in a rows that are separated using newlines
    def get_collapsed_row_values(collapsed_string)
        if collapsed_string.include?(",\r\n")
            return collapsed_string.split(",\r\n")
        end
    
        if collapsed_string.include?("\r\n")
            return collapsed_string.split("\r\n")
        end
    
        return collapsed_string.split(",\n")
    end
    
    # Get verb that in converted into WordModel
    def get_converted_verb(row_number, form, word, meaning)
        return Repository::WordModel .new(
            sheet_row: "verb_#{row_number}",
            word_type: "exact_verb",
            word_form: form,
            word_content: word,
            meaning: meaning
        )
    end
    
    # Add a converted verb into given converted_verb_list
    def add_converted_verb(converted_verb_list, raw_row, row_number, form, meaning)
        row_values = get_collapsed_row_values(raw_row)
        row_values.each do |row_value|
            converted_verb_list.append(get_converted_verb(row_number, form, row_value, meaning))
        end
    end

    # Get list of verbs
    def get_verb_list
        converted_verb_list = []
        # Get all the values in verb_exact_match sheet 
        raw_verb_list = get_verb_exact_match.values

        # return empty array if values are not founf
        if raw_verb_list.nil? || raw_verb_list.empty?
            return []
        end

        # Convert all verb into WordModel through loop
        row_count = 1
        raw_verb_list.each do |row|
            # first row is header, so skip it
            if row_count == 1 then
                row_count += 1
                next
            end

            # plain
            add_converted_verb(converted_verb_list, row[0], row_count, "plain", row[4])

            # honorific
            add_converted_verb(converted_verb_list, row[1], row_count, "honorific", row[4])

            # humble
            add_converted_verb(converted_verb_list, row[2], row_count, "humble", row[4])

            # polite
            add_converted_verb(converted_verb_list, row[3], row_count, "polite", row[4])

            row_count += 1
        end
        
        puts converted_verb_list
        return converted_verb_list
    end

    def get_sentences
        converted_sentence_list = []
        raw_sentences =  get_exact_match_sentence.values

        # return empty array if values are not founf
        if raw_sentences.nil? || raw_sentences.empty?
            return []
        end

        raw_sentences.each do |row|
            # Skip header row, empty row, row that contains "Continue"
            if row[0] == "verb" || row[0] == "Continue" || row[0].present? == false then
                next
            end

            converted_sentence_list.append(Repository::SentenceModel .new(
                word: row[0],
                sentence_jp: row[1],
                sentence_en: row[2]
            ))
        end

        return converted_sentence_list
    end
end   
