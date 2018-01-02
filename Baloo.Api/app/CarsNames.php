<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;

class CarsNames extends Model
{
  use SoftDeletes;

  public function car()
  {
    return $this->belongsTo(Car::class);
  }

  protected $fillable = ['name','brand'];
  protected $guarded = ['id',"created_at",'updated_at','deleted_at'];

  protected $dates = ['deleted_at'];
}
