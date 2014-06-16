class BooksController < ApplicationController
  before_action :set_book, only: [:show, :edit, :update, :destroy]

  # GET /books
  # GET /books.json
  def index
   # @books = Book.all

    if params[:order].try(:[], "0").try(:[], "column").present?
      order_sort = params["order"].try(:[], "0").try(:[], "dir")
      if params[:order].try(:[], "0").try(:[], "column").to_i == 0
        order_params = "name"
      elsif params[:order].try(:[], "0").try(:[], "column").to_i == 1

        order_params = "author"
      elsif params[:order].try(:[], "0").try(:[], "column").to_i == 2
        order_params = "email"
      elsif params[:order].try(:[], "0").try(:[], "column").to_i == 3
        order_params = "ispn_no"
      end
    end
    if params[:search].try(:[], "value").present?
      @contacts = Book.where("name LIKE '%#{params[:search].try(:[], 'value')}%' OR author LIKE '%#{params[:search].try(:[], 'value')}%' OR ispn_no LIKE '%#{params[:search].try(:[], 'value')}%'").limit(params[:length]).offset(params[:start]).reorder("#{order_params} #{order_sort}")
      @contacts_count = Book.where("name LIKE '%#{params[:search].try(:[], 'value')}%' OR author LIKE '%#{params[:search].try(:[], 'value')}%' OR ispn_no LIKE '%#{params[:search].try(:[], 'value')}%'").limit(params[:length]).count
    else
      @contacts = Book.all.limit(params[:length]).offset(params[:start]).reorder("#{order_params} #{order_sort}")
      @contacts_count = Book.all.count
    end

    respond_to do |format|
      format.html
      format.json {
        render json: {
            draw: 1,
            recordsTotal: @contacts_count,
            recordsFiltered: @contacts_count,

            data: @contacts && @contacts.map do |contact|
              {
                  'DT_RowId' => "row_#{contact.id}",

                  '0' => contact.name.to_s.truncate(35),
                  '1' => contact.author,
                  '2' => contact.ispn_no,
                  '3' => contact.created_at,
                  'id' => contact.id}
            end
        }
      }
    end


  end

  # GET /books/1
  # GET /books/1.json
  def show
  end

  # GET /books/new
  def new
    @book = Book.new
  end

  # GET /books/1/edit
  def edit
  end

  # POST /books
  # POST /books.json
  def create
    @book = Book.new(name: params[:name],author: params[:author],ispn_no: params[:ispn_no])

    respond_to do |format|
      if @book.save
        format.html { redirect_to @book, notice: 'Book was successfully created.' }
        format.json { render :show, status: :created, location: @book }
      else
        format.html { render :new }
        format.json { render json: @book.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /books/1
  # PATCH/PUT /books/1.json
  def update
    respond_to do |format|
      if @book.update(name: params[:name],author: params[:author],ispn_no: params[:ispn_no])
        format.json { render :show, status: :ok, location: @book }
        format.html { redirect_to @book, notice: 'Book was successfully updated.' }

      else
        format.json { render json: @book.errors, status: :unprocessable_entity }
        format.html { render :edit }

      end
    end
  end

  # DELETE /books/1
  # DELETE /books/1.json
  def destroy
    @book.destroy
    respond_to do |format|
      format.json { render :json => {status: "sucess"} }
      format.html { redirect_to books_url, notice: 'Book was successfully destroyed.' }

    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_book
      @book = Book.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def book_params
      params.require(:book).permit(:name, :author, :ispn_no)
    end
end
