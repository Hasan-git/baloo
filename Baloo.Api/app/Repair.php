<?php

namespace App;

use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Model;
use App\Car;
use Carbon;

class Repair extends Model
{

  use SoftDeletes;

  public function car()
  {
    return $this->belongsTo(Car::class);
  }

  public function client()
  {
    return $this->belongsTo(Client::class);
  }

  // Setters
  public function setDateAttribute($value)
  {
      $this->attributes['date'] =  Carbon::parse($value)->format('Y-m-d');
  }

  public function setCompletionDateAttribute($value)
  {
      $this->attributes['completionDate'] =  Carbon::parse($value)->format('Y-m-d');
  }

  // Scopes
  public function scopeActive($query)
  {
      return $query->where('isFinished', 0)->orWhere('clientDueAmount','>',0);
  }

  protected $fillable = ['date','completionDate','problem','garage','cost','car_id','client_id','company','isFinished','clientPayment','clientTotalCost','clientDueAmount'];
  protected $guarded = ['id',"created_at",'updated_at','deleted_at'];

  protected $dates = ['deleted_at'];

    protected $casts = [
         'clientDueAmount'=>'integer',
         'cost'=>'integer'
    ];

}
