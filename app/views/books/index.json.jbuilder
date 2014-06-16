json.array!(@books) do |book|
  json.extract! book, :id, :name, :author, :ispn_no
  json.url book_url(book, format: :json)
end
