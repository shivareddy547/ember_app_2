EmberTest.booksController = Ember.ArrayController.create();

$.get('/books.json', function(data) {
    EmberTest.set('books', data);
});
