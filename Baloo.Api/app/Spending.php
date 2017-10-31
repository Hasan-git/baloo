<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Carbon;

class Spending extends Model
{

  // Setters
  public function setDateAttribute($value)
  {
      $this->attributes['date'] =  Carbon::parse($value)->format('Y-m-d');
  }

   // Scopes
  public function scopeThisMonth($query, $month = null )
  {
    if($month == null || $month < 1 || $month > 12){
      $month = Carbon::now()->month;
    }
      return $query->whereMonth('date', '=' , $month);
  }

  protected $fillable = ['date','payment','name'];
  protected $guarded = ['id',"created_at",'updated_at','deleted_at'];
  protected $casts = [
    'payment' => 'integer'
  ];
}
