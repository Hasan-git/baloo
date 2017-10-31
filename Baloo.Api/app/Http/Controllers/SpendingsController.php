<?php

namespace App\Http\Controllers;

use App\Http\Transformers\spending\SpendingViewModel;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use Spatie\Fractalistic\Fractal;
use Illuminate\Http\Request;
use App\Spending;

class SpendingsController extends Controller
{
  /* api/spendings/get */
  public function get()
  {
    try {

      $spendings = Spending::All();
      $result= fractal($spendings, new SpendingViewModel);

      return ok($result);

    }catch (\Exception $e){
        return $e->getMessage();
    }
  }

  /* api/spendings/get/1 */
  public function getById($id)
  {
    try{

      if(!$id)
        return response()->json([],400);

      $spending = Spending::find($id);

      if( !$spending)
        return response()->json([],404);

      $result = fractal($spending, new SpendingViewModel);

      return ok($result);

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

  /* api/spendings/get/month */
  public function getByMonth($month)
  {
    try{

      if(!$month)
        return response()->json([],400);

      $spending = Spending::thisMonth($month)->get();

      if(!$spending)
        return response()->json([],404);

      $result = fractal($spending, new SpendingViewModel);

      return ok($result);

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

  /* api/spendings/post */
  public function post( Request $model)
  {
    try{

      $rules = array('name' => 'required');
      $validator = Validator::make($model->all(), $rules);

      if ($validator->fails())
          return response()->json(['errors' => $validator->getMessageBag()->toArray()], 400);

      $spending = new Spending($model->all());
      $spending->save();
      $result = fractal($spending, new SpendingViewModel);

     return ok($result);

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

  /* api/spendings/update */
  public function update( Request $model)
  {
    try{

      $rules = array('id'=>'required','name' => 'required');
      $validator = Validator::make($model->all(), $rules);

      if ($validator->fails())
          return response()->json(['errors' => $validator->getMessageBag()->toArray()], 400);

      $result = Spending::find($model->id);

      if(!$result)
        return response()->json([],404);

      $result->update($model->all());

      $result = fractal($result, new SpendingViewModel);

      return ok($result);

    }
    catch (\Exception $e) {
        return $e->getMessage();
    }
  }

  /* api/spendings/delete/1 */
  public function delete($id)
  {

    try{

        $spending = Spending::find($id);

        if(!$spending)
          return response()->json([],404);

        $spending->delete();

      return ok();

    }
    catch (\Exception $e) {
        //return $e->getMessage();
    }
  }
}
