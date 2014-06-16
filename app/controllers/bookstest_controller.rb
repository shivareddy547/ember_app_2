class BookstestController < ApplicationController
  layout 'new_application'
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
                  '2' => contact.ispn_no
                 }
            end
        }
      }
    end


  end


end
