// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//= require jquery-1.10.2.min

//= require jquery_ujs
//= require turbolinks
//= require jquery
//= require handlebars
//= require ember
//= require ember-data
//= require_self
//= require ./ember_test
//= require jquery.dataTables

// for more details see: http://emberjs.com/guides/application/
EmberTest = Ember.Application.create({
    LOG_TRANSITIONS: true

});
EmberTest.Router.map(function() {
    this.route('about');
    this.resource('book_edit', {path: '/books/:book_id/edit'});
    this.resource('book_delete', {path: '/books/:book_id/delete'});
    this.resource('books', { path: '/books' }, function() {
        this.route('new');
        //this.resource('edit', {path: '/books/:book_id/edit'});
        this.route("show", { path: "/:book_id" });
        //this.route("delete", { path: "/:book_id" });
    });
});

EmberTest.BooksShowRoute = Ember.Route.extend({
    model: function(params) {
       // alert("yes")
        // alert(JSON.stringify(params));
        // alert(JSON.stringify(params.book_id));
        return Ember.$.getJSON('/books/'+params.book_id);
    }
});

EmberTest.BooksRoute = Ember.Route.extend({
    actions:{
        book_delete:function(e){

            console.log($(event.target).attr('id'));
var book_id = $(event.target).attr('id');
           alert(book_id);
            return Ember.$.ajax('/books/' + book_id, {
                "type": 'DELETE', // HTTP method
                "beforeSend" : function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
                "data": {},
                "success": function (data, textStatus, jqXHR) {
                    window.location.href = "#/books"
                    reload_table();
                },
                "error": function (jqXHR, textStatus, errorThrown) {
                    window.console.log(jqXHR);
                }
            });

        }

    }
});


EmberTest.BookEditRoute = Ember.Route.extend({

    model: function(params) {
        // alert(JSON.stringify(params));
        // alert(JSON.stringify(params.book_id));

       return Ember.$.getJSON('/books/'+params.book_id);
    },
    actions:{
        book_update:function(){
            var book_id = $('form#test_ember #id').val();
            return Ember.$.ajax('/books/' + book_id, {
                "type": 'PATCH', // HTTP method
                "beforeSend" : function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
                "data": $('form#test_ember').serialize(),
                "success": function (data, textStatus, jqXHR) {
                    window.location.href = "#/books"
                    reload_table();
                },
                "error": function (jqXHR, textStatus, errorThrown) {
                    window.console.log(jqXHR);
                }
            });

        },

        cancel:function(){
            window.location.href = "#/books"
            reload_table();
        }
    }
});

EmberTest.BooksNewRoute = Ember.Route.extend({
    actions:{
        book_create:function(){
         return Ember.$.ajax('/books', {
                "type": 'POST', // HTTP method
                "beforeSend" : function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
                "data": $('form#test_ember').serialize(),
                "success": function (data, textStatus, jqXHR) {
                    window.location.href = "#/books"
                    if ($('#example').hasClass('dataTable')) {

                    }
                    else {
                        reload_table();
                    }
                },
                "error": function (jqXHR, textStatus, errorThrown) {
                    window.console.log(jqXHR);
                }
            });

        },

        cancel:function(){
            window.location.href = "#/books"
            reload_table();
        }
    }
});

EmberTest.BooksDeleteRoute = Ember.Route.extend({
    actions:{
        book_delete:function(){
alert("hello");
            return Ember.$.ajax('/books', {
                "type": 'POST', // HTTP method
                "beforeSend" : function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
                "data": $('form#test_ember').serialize(),
                "success": function (data, textStatus, jqXHR) {
                    alert("dd")
                    window.location.href = "#/books"
                    reload_table();
                },
                "error": function (jqXHR, textStatus, errorThrown) {
                    window.console.log(jqXHR);
                }
            });

        },

        cancel:function(){
            window.location.href = "#/books"
            reload_table();
        }
    }
});

EmberTest.ApplicationRoute = Ember.Route.extend({

   actions:{
   application_book:function(){
       window.location.href = "#/books"
       if ($('#example').hasClass('dataTable')) {

            }
       else {
           var timer =  setInterval(function(){
               $("#example").dataTable({
                   "ajax": "/books.json",
                   "aoColumns": [null, null, null,{ "sTitle": "Actions","bSearchable": false,"bSortable": false, "mRender": function ( data, type, row)  {
                     //  var s= 1
                       return  '<a href=#/books/' + row["id"] + '/edit >Edit</a></br><a href=#/books/' + row["id"] + ' >Show</a></br><a class="book_delete" id= '+  row["id"]  +' >Delete</a>';
                   }}],

               });

              $(document).on("click", "#example tbody tr", function () {

                   var id = this.id;
                   $(this).toggleClass('selected');
               } );

              clearInterval(timer);

           }, 1000);
       }
     //  alert("yes");



   }



   }

});

$(document).on("click", ".book_delete", function () {
    var book_id = $(this).attr("id");
    $.ajax({
        url: '/books/' + book_id,
        type: 'DELETE', // HTTP method
        beforeSend : function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
        data: {},
        success: function (reponse) {
            window.location.href = "#/books"
            reload_table();
           // window.location.href = "#/books"
        },
        error: function (jqXHR, textStatus, errorThrown) {
            window.console.log(jqXHR);
        }
    });

});



function reload_table()
{

    if ($('#example').hasClass('dataTable')) {

    }
    else {
        var timer =  setInterval(function(){


            $("#example").dataTable({
                "ajax": "/books.json",
                "aoColumns": [null, null, null,{ "sTitle": "Actions","bSearchable": false,"bSortable": false, "mRender": function ( data, type, row)  {
                    //  var s= 1
                    return  '<a href=#/books/' + row["id"] + '/edit >Edit</a></br><a href=#/books/' + row["id"] + ' >Show</a></br><a class="book_delete" id= '+  row["id"]  +' >Delete</a>';
                }}],

            });




            $(document).on("click", "#example tbody tr", function () {

                var id = this.id;
                $(this).toggleClass('selected');
            } );

            clearInterval(timer);

        }, 1000);
    }
}


//= require_tree .
