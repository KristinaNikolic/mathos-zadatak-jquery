$(document).ready(function () {
			var API = 'http://193.246.33.24/data';
			
			var users = $("#users");
		
			$.get(API, {user:6}, function(data) {
				$.each(data, function(i, usr) {
					addUser(usr);
				})
			});
			
			function addUser(usr) {
				users.append('<tr data-id="'+usr.id+'"><td id="name" valign="middle">'+usr.name+'</td><td id="surname" valign="middle">'+usr.surname+'</td><td><button class="btn btn-warning edit">Edit</button><button class="btn btn-danger delete">Delete</button></td></tr>');
			};
			
			var dialogAdd=$("#dialogAdd").dialog( {
				autoOpen: false,
				modal:true,
				buttons: {
					'Add new' : function () {
						formAdd.submit();
					},
					Cancel: function () {
						dialogAdd.dialog('close');
					}
				},
				close : function () {
					formAdd[0].reset();
				}
			});
			
			var dialogEdit=$("#dialogEdit").dialog( {
				autoOpen: false,
				modal:true,
				buttons: {
					'Edit' : function () {
						formEdit.submit();
					},
					Cancel: function () {
						dialogEdit.dialog('close');
						$("#users").find(".edited").removeClass("edited", 2500);
					}
				},
				close : function () {
					formEdit[0].reset();
					
					$("#users").find(".edited").removeClass("edited");
				}
			});
			
			var formAdd = dialogAdd.find('form');
			var formEdit = dialogEdit.find('form');
			
			formAdd.on('submit', function (e) {
				e.preventDefault();
				
				$.post(API + '/create', formAdd.serialize()).done(function (data) {
					//serialize - uhvati sve sto je u formi i serializira u oblik koji se salje na server koristeci sva polja
					addUser(data);
					dialogAdd.dialog('close');
				}).fail(function(error) {
					alert('Neuspjesno dodavanje');
					console.log(error.responseText);
				});
			});
			
			
			$("#addNew").click(function() {
				dialogAdd.dialog("open");
			});
			
			$("#users").on('click', '.delete', function() {
				var row = $(this).closest('tr');
				$.post(API + '/destroy/' +row.data('id'), {}, function(data) {
					row.toggle(1500);
				});
			});
			
			$("#users").on('click', '.edit', function() {
				var row = $(this).closest('tr');
				formEdit.find('#ime').val(row.find('#name').text());
				formEdit.find('#prezime').val(row.find('#surname').text());
				formEdit.addClass("id");
				formEdit.id = row.data('id');
				row.addClass("edited", 1000);
				dialogEdit.dialog("open");				
			});
			
			formEdit.on('submit', function (e) {
				e.preventDefault();
				
				$.post(API + '/update/' + formEdit.id, formEdit.serialize()).done(function (data) {
					//serialize - uhvati sve sto je u formi i serializira u oblik koji se salje na server koristeci sva polja
					editUser();
				}).fail(function(error) {
					alert('Neuspjesno dodavanje');
					console.log(error.responseText);
					
					$("#users").find(".edited").removeClass("edited");
				});
			});
				
			function editUser() {
				var row = $("#users").find(".edited");
				row.find("#name").text(formEdit.find('#ime').val());
				row.find("#surname").text(formEdit.find('#prezime').val());
				
				$("#users").find(".edited").removeClass("edited");
				
				dialogEdit.dialog('close');
			} 
			
			$(function() {
				$( ".table tbody").sortable({
					placeholder: "ui-state-highlight"
				});
				$( ".table tbody" ).disableSelection();
			  });
				
			});