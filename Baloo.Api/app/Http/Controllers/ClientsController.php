<?php

namespace App\Http\Controllers;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use App\Http\Transformers\client\ClientViewModel;
use App\Http\Transformers\client\ClientImagesViewModel;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Spatie\Fractalistic\Fractal;
use Illuminate\Http\Request;
use App\Client;
use App\Clients_images;
use Storage;

class ClientsController extends Controller
{

  /* api/clients/get */
  public function get()
  {
    try {

      $clients = Client::all();
      $result = fractal($clients, new ClientViewModel);

      return ok($result);

    }catch (\Exception $e){
        return $e->getMessage();
    }
  }

  /* api/clients/get/1 */
  public function getById($id)
  {

    try{

      if(!$id)
        return response()->json([],400);

      $client = Client::find($id);

      if( !$client)
        return response()->json([],404);

      $result = fractal($client, new ClientViewModel);

      return ok($result);

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

  /* api/clients/post */
  public function post( Request $model)
  {
    try{

      $rules = array('name' => 'required','dob'=>'date','imagefile' => 'mimes:jpeg,jpg,bmp,png');
      $validator = Validator::make($model->all(), $rules);

      if ($validator->fails())
          return response()->json(['errors' => $validator->getMessageBag()->toArray()], 400);

      $client = new Client($model->all());

      if($model->hasFile('imagefile')){

        $fileName = uniqid().'@'.$model->file('imagefile')->getClientOriginalName();

        Storage::put(
            'clients/'. $fileName,
            file_get_contents($model->file('imagefile')->getRealPath())
        );
        $client->image = $fileName;
      }

      $client->save();

      $result = fractal($client, new ClientViewModel);

      return ok($result);

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

    /* api/clients/update */
  public function update( Request $model)
  {
    try{

      $rules = array('id'=>'required','name' => 'required','dob'=>'date','imagefile' => 'mimes:jpeg,jpg,bmp,png');
      $validator = Validator::make($model->all(), $rules);

      if ($validator->fails())
          return response()->json(['errors' => $validator->getMessageBag()->toArray()], 400);

      $client = Client::find($model->id);

      if(!$client)
        return response()->json([],404);

      //User Deleted The existing Image
      if(!strlen($model->image) && strlen($client->image)){
        if(Storage::has('clients/'.$client->image)){
            Storage::delete('clients/'.$client->image);
        }
        $client->image = null;
      }

      //User Uploaded New Image
      if($model->hasFile('imagefile')){

        $fileName = uniqid().'@'.$model->file('imagefile')->getClientOriginalName();

        Storage::put(
            'clients/'. $fileName,
            file_get_contents($model->file('imagefile')->getRealPath())
        );
        $client->image = $fileName;
      }

      $client->update($model->all());

      $result = fractal($client, new ClientViewModel);

      return ok($result);

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

  /* api/clients/getClientImages/1 */
  public function getClientImages($id)
  {
    try {

      $client = Client::find($id);

      $result = fractal($client->images, new ClientImagesViewModel);

      return ok($result);

    }catch (\Exception $e){
        return $e->getMessage();
    }
  }

    /* api/clients/addImage */
  public function addImage( Request $model)
  {
    try{

      $rules = array('imagefile' => 'mimes:jpeg,jpg,bmp,png');
      $validator = Validator::make($model->all(), $rules);

      if ($validator->fails())
          return response()->json(['errors' => $validator->getMessageBag()->toArray()], 400);

      $entity = new Clients_images($model->all());

      if($model->hasFile('imagefile')){

        $fileName = uniqid().'@'.$model->file('imagefile')->getClientOriginalName();

        Storage::put(
            'clients/'. $fileName,
            file_get_contents($model->file('imagefile')->getRealPath())
        );
        $entity->name = $fileName;
      }

      $entity->save();

      //$result = fractal($client, new ClientViewModel);
      $result = fractal($entity, new ClientImagesViewModel);

      return ok($result);

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

    /* api/clients/deleteImage/1 */
  public function deleteImage($id)
  {

    try{

        $entity = Clients_images::find($id);

        if(!$entity)
          return response()->json([],404);

         if(Storage::exists('clients/'.$entity->name)){
           Storage::delete('clients/'.$entity->name);
        }

        $entity->delete();

      return ok();

    }
    catch (\Exception $e) {
        //return $e->getMessage();
    }
  }

  /* api/clients/delete/1 */
  public function delete($id)
  {

    try{

        $client = Client::find($id);

        if(!$client)
          return response()->json([],404);

        $client->delete();

      return ok();

    }
    catch (\Exception $e) {
        //return $e->getMessage();
    }
  }

}
