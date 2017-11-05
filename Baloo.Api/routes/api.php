<?php


// User Identity
Route::group(['prefix' => 'users','middleware' => ['auth:api']], function() {

  Route::get('/user/{email}', 'UsersController@GetUserByEmail');

});
  // Route::get('users/user/{email}', 'UsersController@GetUserByEmail');

//Route::group(['prefix' => 'names','middleware' => ['auth:api',"role:admin"]], function() {
Route::group(['prefix' => 'names'], function() {

  Route::get('/get', 'CarsNamesController@get');
  Route::get('/get/{name}', 'CarsNamesController@getByName');
  Route::post('/post', 'CarsNamesController@post');
  Route::post('/update', 'CarsNamesController@update');
  Route::post('/delete/{id}', 'CarsNamesController@delete');

});

Route::group(['prefix' => 'cars'], function() {

  Route::get('/get', 'CarsController@get');
  Route::get('/get/{id}', 'CarsController@getById');
  Route::post('/post', 'CarsController@post');
  Route::post('/carSold', 'CarsController@carSold');
  Route::post('/update', 'CarsController@update');
  Route::post('/delete/{id}', 'CarsController@delete');

});

Route::group(['prefix' => 'clients'], function() {

  Route::get('/get', 'ClientsController@get');
  Route::get('/get/{id}', 'ClientsController@getById');
  Route::post('/post', 'ClientsController@post');
  Route::post('/update', 'ClientsController@update');
  Route::post('/delete/{id}', 'ClientsController@delete');

});


Route::group(['prefix' => 'repairs'], function() {

  Route::get('/get', 'RepairsController@get');
  Route::get('/get/{id}', 'RepairsController@getById');
  Route::get('/get/car/{id}', 'RepairsController@getByCar');
  Route::post('/post', 'RepairsController@post');
  Route::post('/update', 'RepairsController@update');
  Route::post('/delete/{id}', 'RepairsController@delete');

});


Route::group(['prefix' => 'rents'], function() {

  Route::get('/get', 'RentsController@get');
  Route::get('/get/{id}', 'RentsController@getById');
  Route::post('/post', 'RentsController@post');
  Route::post('/update', 'RentsController@update');
  Route::post('/delete/{id}', 'RentsController@delete');

});

Route::group(['prefix' => 'spendings'], function() {

  Route::get('/get', 'SpendingsController@get');
  Route::get('/get/{id}', 'SpendingsController@getById');
  Route::get('/get/month/{month}', 'SpendingsController@getByMonth');
  Route::post('/post', 'SpendingsController@post');
  Route::post('/update', 'SpendingsController@update');
  Route::post('/delete/{id}', 'SpendingsController@delete');

});

Route::group(['prefix' => 'alerts'], function() {

  Route::get('/get', 'AlertsController@get');
  Route::post('/statusChanged', 'AlertsController@updateAlertStatus');

});

Route::group(['prefix' => 'reports'], function() {

  Route::get('/soldCars', 'ReportsController@soldCars');
  Route::get('/cars', 'ReportsController@cars');
  Route::get('/carsStituations', 'ReportsController@carsSituations');

});
